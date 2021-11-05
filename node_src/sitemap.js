const fs = require('fs')
const { findIndex, findLastIndex, omit, template } = require('lodash')
const yaml = require('js-yaml')
const { getAllBlocks } = require('./helpers.js')

const rawPageTemplates = fs.readFileSync(
    `./surveys/${process.env.SURVEY}/config/page_templates.yml`,
    'utf8'
)
const rawBlockTemplates = fs.readFileSync(
    `./surveys/${process.env.SURVEY}/config/block_templates.yml`,
    'utf8'
)
const globalVariables = yaml.load(
    fs.readFileSync(`./surveys/${process.env.SURVEY}/config/variables.yml`, 'utf8')
)

const injectVariables = (yamlObject, variables, templateName) => {
    // convert variable values to strings if needed
    Object.keys(variables).forEach((v) => {
        const value = variables[v]
        if (typeof value === 'object') {
            variables[v] = JSON.stringify(value)
        }
    })

    try {
        // convert template object back to string for variables injection
        const templateString = yaml.dump(yamlObject)
        // Inject variables in raw yaml templates
        const interpolatedTemplate = template(templateString)(variables)
        // convert raw populated template to object
        const populatedTemplate = yaml.load(interpolatedTemplate)

        return populatedTemplate
    } catch (error) {
        console.log(`// injectVariables error in template "${templateName}"`)
        console.log(error)
    }
}

const applyTemplate = (block, templateName, rawTemplates, parent) => {
    // load raw templates
    const templates = yaml.load(rawTemplates)

    // pick the corresponding template
    const templateObject = templates[templateName]
    if (!templateObject) {
        throw new Error(`No template named "${templateName}" found.`)
    }

    // defines all available variables to be injected
    // at build time in the GraphQL queries
    const variables = {
        ...(parent ? { parentId: parent.id } : {}),
        ...(templateObject.defaultVariables || {}),
        ...globalVariables,
        id: block.id,
        fieldId: block.id,
        ...(block.variables || {}),
        ...(block.pageVariables || {}),
    }
    
    const populatedTemplate = injectVariables(templateObject, variables, templateName)

    return {
        ...populatedTemplate,
        ...block,
    }
}

exports.pageFromConfig = (stack, item, parent, pageIndex) => {
    try {
        // if template has been provided, apply it
        if (item.template) {
            item = applyTemplate(item, item.template, rawPageTemplates, parent)
        }

        const pagePath = item.path || `/${item.id}`
        const page = {
            ...item,
            path: parent === undefined ? pagePath : `${parent.path.replace(/\/$/, '')}${pagePath}`,
            is_hidden: !!item.is_hidden,
            children: [],
            pageIndex,
        }
        // if page has no defaultBlockType, get it from parent
        if (!page.defaultBlockType) {
            page.defaultBlockType = (parent && parent.defaultBlockType) || 'default'
        }

        if (!page.path.endsWith('/')) {
            page.path = `${page.path}/`
        }

        if (Array.isArray(page.blocks)) {
            page.blocks = page.blocks.map((block) => {
                // everything that's not in block.variants is part of the main block
                const { variants: variants_ = [], ...mainBlockConfig } = block
                const blockVariants = [{ ...mainBlockConfig, isMainBlock: true }, ...variants_]

                const blockPath = `${page.path}${block.id}/`

                const variants = blockVariants.map((blockVariant) => {
                    // if template has been provided, apply it

                    // if block has variables, inject them based on current page and global variables
                    if (blockVariant.variables) {
                        blockVariant.variables = injectVariables(blockVariant.variables, {
                            ...item,
                            ...globalVariables,
                        })
                    }

                    // also pass page variables to block so it can inherit them
                    if (page.variables) {
                        blockVariant.pageVariables = injectVariables(page.variables, {
                            ...item,
                            ...globalVariables,
                        })
                    }

                    if (blockVariant.template) {
                        blockVariant = applyTemplate(
                            blockVariant,
                            blockVariant.template,
                            rawBlockTemplates,
                            page
                        )
                    }

                    // if block type is missing, get it from parent
                    if (!blockVariant.blockType) {
                        blockVariant.blockType = page.defaultBlockType
                    }

                    blockVariant.path = blockVariant.isMainBlock ? blockPath : blockPath + `${blockVariant.id}/`

                    return blockVariant
                })

                return { id: block.id, variants }
            })
        }

        if (parent === undefined) {
            stack.hierarchy.push(page)
        }
        stack.flat.push(page)

        if (Array.isArray(item.children)) {
            item.children.forEach((child) => {
                page.children.push(exports.pageFromConfig(stack, child, page, pageIndex))
            })
        }

        return page
    } catch (error) {
        console.log('// pageFromConfig Error')
        console.log(error)
    }
}

let computedSitemap = null

exports.computeSitemap = async (rawSitemap, locales) => {
    try {
        if (computedSitemap !== null) {
            return computedSitemap
        }

        const stack = {
            flat: [],
            hierarchy: [],
        }

        rawSitemap.forEach((item, pageIndex) => {
            exports.pageFromConfig(stack, item, undefined, pageIndex)
        })

        // assign prev/next page using flat pages
        stack.flat.forEach((page) => {
            // if the page is hidden, do not generate pagination for it
            if (page.is_hidden) return

            const index = findIndex(stack.flat, (p) => p.path === page.path)
            const previous = stack.flat[index - 1]

            // we exclude hidden pages from pagination
            if (previous !== undefined && previous.is_hidden !== true) {
                page.previous = omit(previous, [
                    'is_hidden',
                    'previous',
                    'next',
                    'children',
                    'blocks',
                ])
            }

            const lastIndex = findLastIndex(stack.flat, (p) => p.path === page.path)
            const next = stack.flat[lastIndex + 1]

            // we exclude hidden pages from pagination
            if (next !== undefined && next.is_hidden !== true) {
                page.next = omit(next, ['is_hidden', 'previous', 'next', 'children', 'blocks'])
            }
        })

        const now = new Date()
        const sitemapContent = [
            `###################################################################`,
            `# DO NOT EDIT`,
            `###################################################################`,
            `# this file was generated by \`gatsby-node.js\``,
            `# please edit \`raw_sitemap.yaml\` instead.`,
            `# generated on: ${now.toISOString()}`,
            `###################################################################`,
            yaml.dump({ locales, contents: stack.hierarchy }, { noRefs: true }),
        ].join('\n')
        await fs.writeFileSync(`./surveys/${process.env.SURVEY}/config/sitemap.yml`, sitemapContent)
        await fs.writeFileSync(
            `./surveys/${process.env.SURVEY}/config/blocks.yml`,
            yaml.dump(getAllBlocks({ contents: stack.hierarchy }), { noRefs: true })
        )

        return stack
    } catch (error) {
        throw new Error(error)
    }
}
