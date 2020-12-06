const { omit } = require('lodash')
const indentString = require('indent-string')
const _ = require('lodash')
const path = require('path')
const fs = require('fs')

/*

Get the localized version of a page path

*/
const getLocalizedPath = (path, locale) => (locale ? `/${locale.id}${path}` : path)
exports.getLocalizedPath = getLocalizedPath

/*

Get locales without the strings, to avoid loading every locale's dictionnary in memory

Also add paths

*/
const getCleanLocales = (locales) =>
    locales.map((l) => ({ path: `/${l.id}`, ...omit(l, ['strings']) }))
exports.getCleanLocales = getCleanLocales

/*

Get a page's context

*/
exports.getPageContext = (page) => {
    const context = omit(page, ['path', 'children'])
    context.basePath = page.path

    return {
        ...context,
        ...page.data,
    }
}

/*

Clean ID string

*/
exports.cleanIdString = (id) => id.replace(new RegExp('-', 'g'), '_')

/*

Wrap query contents with query FooQuery {...}

*/
exports.wrapWithQuery = (queryName, queryContents) => `query ${queryName} {
  ${indentString(queryContents, 4)}
  }`

/*

Loop over a page's blocks to assemble its page query

*/
exports.getPageQuery = (page) => {
    const { blocks = [] } = page
    const blocksWithQueries = blocks.filter((b) => !!b.query)
    // if there are no blocks or no blocks have queries defind, return undefined
    if (blocksWithQueries.length === 0) {
        return
    }
    return `### ${page.id}
${_.compact(blocksWithQueries.map((b) => `# ${b.id}\n` + b.query)).join('\n')}
`
}

/*

Log to file

*/
exports.logToFile = async (fileName, object, options = {}) => {
    const { mode = 'append', timestamp = false } = options

    const logsDirPath = `${__dirname}/.logs`
    if (!fs.existsSync(logsDirPath)) {
        fs.mkdirSync(logsDirPath, { recursive: true })
    }
    const fullPath = `${logsDirPath}/${fileName}`
    const contents = typeof object === 'string' ? object : JSON.stringify(object, null, 2)
    const now = new Date()
    const text = timestamp ? now.toString() + '\n---\n' + contents : contents
    if (mode === 'append') {
        const stream = fs.createWriteStream(fullPath, { flags: 'a' })
        stream.write(text + '\n')
        stream.end()
    } else {
        fs.writeFile(fullPath, text, (error) => {
            // throws an error, you could also catch it here
            if (error) throw error

            // eslint-disable-next-line no-console
            console.log(`Object saved to ${fullPath}`)
        })
    }
}

/*

Create individual pages for each block (for social media meta tags)

*/
exports.createBlockPages = (page, context, createPage, locales) => {
    const blocks = page.blocks
    if (!Array.isArray(blocks) || blocks.length === 0) {
        return
    }

    blocks.forEach((block) => {
        // allow for specifying explicit pageId in block definition
        if (!block.pageId) {
            block.pageId = page.id
        }
        locales.forEach((locale) => {
            const blockPage = {
                path: getLocalizedPath(block.path, locale),
                component: path.resolve(`./src/core/share/ShareBlockTemplate.js`),
                context: {
                    ...context,
                    redirect: `${getLocalizedPath(page.path, locale)}#${block.id}`,
                    block,
                    locales: getCleanLocales(locales),
                    locale,
                },
            }
            createPage(blockPage)
        })
    })
}
