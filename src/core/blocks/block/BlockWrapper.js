import React from 'react'
import Block from 'core/blocks/block/Block'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { EmptyWrapper, TabsWrapper } from 'core/blocks/block/BlockTabs'

const BlockWrapper = (props) => {
    const { block, pageData, index: blockIndex } = props
    const { wrapBlock = true } = block
    const WrapperComponent = wrapBlock ? TabsWrapper : EmptyWrapper
    return <WrapperComponent block={block} pageData={pageData} blockIndex={blockIndex} />
}

export const BlockError = ({ message, data, block }) => (
    <Block block={block}>
        <div className="error">{message}</div>
        {data && !isEmpty(data) && (
            <pre className="error error-data">
                <code>{JSON.stringify(data, '', 2)}</code>
            </pre>
        )}
    </Block>
)

class ErrorBoundary extends React.Component {
    state = {}
    static getDerivedStateFromError(error) {
        return { error }
    }
    render() {
        const { block, pageData } = this.props
        const { error } = this.state
        if (error) {
            return (
                <BlockError
                    block={block}
                    message={error.message}
                    data={get(pageData, block.dataPath)}
                />
            )
        }
        return this.props.children
    }
}

const BlockWrapperWithBoundary = (props) => (
    <ErrorBoundary {...props}>
        <BlockWrapper {...props} />
    </ErrorBoundary>
)

export default BlockWrapperWithBoundary
