import React, { memo } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { mq, spacing } from 'core/theme'
import BlockTitleOriginal from 'core/blocks/block/BlockTitle'
import ShareBlockDebug from 'core/share/ShareBlockDebug'
import BlockData from './BlockData'
import * as Tabs from '@radix-ui/react-tabs'
import BlockChart from 'core/blocks/block/BlockChart'
import BlockShare from 'core/blocks/block/BlockShare'
import { ChartIcon, DataIcon, ShareIcon } from 'core/icons'

const Container = styled.div`
    @media ${mq.small} {
        margin-bottom: ${spacing(2)};
    }

    @media ${mq.mediumLarge} {
        margin-bottom: ${spacing(4)};
    }

    &:last-child {
        margin-bottom: 0;
    }
`

const TabsList = styled(Tabs.List)`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const TabsTrigger = styled(Tabs.Trigger)`
    cursor: pointer;
    margin-bottom: ${spacing()};
`

const Block = (props) => {
    const {
        isShareable,
        className,
        children,
        units,
        setUnits,
        error,
        data,
        block = {},
        legendProps,
        titleProps,
        headings,
        tables,
    } = props
    const {
        id,
        showLegend,
        legendPosition = 'bottom',
        showTitle = true,
        showNote = true,
        overrides = {},
    } = block

    const BlockTitle = overrides.BlockTitle || BlockTitleOriginal

    return (
        <Container
            id={id}
            className={`Block Block--${id}${className !== undefined ? ` ${className}` : ''}`}
        >
            {/* {showTitle && (
                <BlockTitle
                    isShareable={isShareable}
                    units={units}
                    setUnits={setUnits}
                    data={data}
                    block={block}
                    view={view}
                    setView={setView}
                    {...titleProps}
                />
            )} */}
            {isShareable && <ShareBlockDebug block={block} />}

            <TabsRoot defaultValue="chart" orientation="vertical">
                <SideArea>
                    <TabsList aria-label="tabs example">
                        <TabsTrigger value="chart">
                            <ChartIcon enableTooltip={true} labelId="tabs.chart" />
                        </TabsTrigger>
                        <TabsTrigger value="data">
                            <DataIcon enableTooltip={true} labelId="tabs.data" />
                        </TabsTrigger>
                        <TabsTrigger value="share">
                            <ShareIcon enableTooltip={true} labelId="tabs.share" />
                        </TabsTrigger>
                    </TabsList>
                </SideArea>
                <MainArea>
                    <Tabs.Content value="chart">
                        <BlockChart {...props} />
                    </Tabs.Content>
                    <Tabs.Content value="data">
                        <BlockData {...props} />
                    </Tabs.Content>
                    <Tabs.Content value="share">
                        <BlockShare {...props} />
                    </Tabs.Content>
                </MainArea>
            </TabsRoot>
        </Container>
    )
}

const MainArea = styled.div`
    grid-area: main;
`
const SideArea = styled.div`
    grid-area: side;
`

const TabsRoot = styled(Tabs.Root)`
    display: grid;
    grid-template-columns: 1fr 60px;
    grid-template-areas: 'main side';
`

Block.propTypes = {
    block: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.node,
        description: PropTypes.node,
    }).isRequired,
    isShareable: PropTypes.bool.isRequired,
    className: PropTypes.string,
    values: PropTypes.object,
}
Block.defaultProps = {
    showDescription: true,
    isShareable: true,
}

export default memo(Block)
