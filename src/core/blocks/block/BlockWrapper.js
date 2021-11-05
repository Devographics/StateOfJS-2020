import React from 'react'
import BlockSwitcher from 'core/blocks/block/BlockSwitcher'
import Block from 'core/blocks/block/Block'

const EmptyWrapper = ({ children }) => <div className="empty-wrapper">{children}</div>

const TabsWrapper = ({ children, variantIndex }) => (
    <div className="tabs-wrapper">
        <h2>variant {variantIndex}</h2>
        {children}
    </div>
)

const BlockWrapper = (props) => {
    const { block, pageData, index: blockIndex } = props
    const { variants, wrapBlock = true } = block
    const WrapperComponent = wrapBlock ? TabsWrapper : EmptyWrapper
    return (
        <div className="block-wrapper">
            {variants.map((variant, variantIndex) => (
                <WrapperComponent key={variant.id} variantIndex={variantIndex}>
                    <BlockSwitcher
                        block={variant}
                        pageData={pageData}
                        blockIndex={blockIndex}
                        variantIndex={variantIndex}
                    />
                </WrapperComponent>
            ))}
        </div>
    )
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
