import React from 'react'
import { EmptyWrapper, TabsWrapper } from 'core/blocks/block/BlockTabs'
import { ErrorBoundary } from 'core/blocks/block/BlockError'

const BlockWrapper = (props) => {
    const { block, pageData, index: blockIndex } = props
    const { wrapBlock = true } = block
    const WrapperComponent = wrapBlock ? TabsWrapper : EmptyWrapper
    return <WrapperComponent block={block} pageData={pageData} blockIndex={blockIndex} />
}

const BlockWrapperWithBoundary = (props) => (
    <ErrorBoundary {...props}>
        <BlockWrapper {...props} />
    </ErrorBoundary>
)

export default BlockWrapperWithBoundary

