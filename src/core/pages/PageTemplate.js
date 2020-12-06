import React from 'react'
import PageHeader from 'core/pages/PageHeader'
import PageFooter from 'core/pages/PageFooter'
import { usePageContext } from 'core/helpers/pageContext'
import BlockSwitcher from 'core/blocks/block/BlockSwitcher'

const PageTemplate = ({ pageContext = {} }) => {
    const context = usePageContext()
    const { pageData, showTitle = true, is_hidden = false } = pageContext
    return (
        <>
            {showTitle && <PageHeader />}
            <div className="Page__Contents">
                {context.blocks &&
                    context.blocks.map((block, i) => (
                        <BlockSwitcher key={block.id} block={block} pageData={pageData} index={i} />
                    ))}
            </div>
            {!is_hidden && <PageFooter />}
        </>
    )
}

export default PageTemplate
