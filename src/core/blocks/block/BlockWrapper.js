import React from 'react'
import BlockSwitcher from 'core/blocks/block/BlockSwitcher'
import Block from 'core/blocks/block/Block'
import * as Tabs from '@radix-ui/react-tabs'
import BlockTitle from 'core/blocks/block/BlockTitle'
import styled from 'styled-components'
import { spacing } from 'core/theme'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

const EmptyWrapper = ({ block, pageData, blockIndex }) => (
    <div className="empty-wrapper">
        {block.variants.map((block, variantIndex) => (
            <BlockSwitcher
                key={block.id}
                block={block}
                pageData={pageData}
                blockIndex={blockIndex}
                variantIndex={variantIndex}
            />
        ))}
    </div>
)

const BlockHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: ${(props) => props.theme.separationBorder};
    padding-bottom: ${spacing(0.5)};
    margin-bottom: ${spacing(1)};
`

const TabsList = styled(Tabs.List)`
    display: flex;
    justify-content: flex-end;
    align-items: center;
`

const TabsTrigger = styled(Tabs.Trigger)`
    border: 1px solid pink;
`

const TabsWrapper = ({ block, pageData, blockIndex }) => (
    <div className="tabs-wrapper">
        <Tabs.Root defaultValue="tab0" orientation="horizontal">
            <BlockHeader>
                <BlockTitle block={block} {...block.titleProps} />
                {block.variants.length > 1 && (
                    <TabsList aria-label="tabs example">
                        {block.variants.map((block, variantIndex) => (
                            <TabsTrigger key={block.id} value={`tab${variantIndex}`}>
                                {variantIndex === 0 ? 'All Respondents' : block.id}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                )}
            </BlockHeader>
            {block.variants.map((block, variantIndex) => (
                <Tabs.Content key={block.id} value={`tab${variantIndex}`}>
                    <BlockSwitcher
                        block={block}
                        pageData={pageData}
                        blockIndex={blockIndex}
                        variantIndex={variantIndex}
                    />
                </Tabs.Content>
            ))}
        </Tabs.Root>
    </div>
)

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
