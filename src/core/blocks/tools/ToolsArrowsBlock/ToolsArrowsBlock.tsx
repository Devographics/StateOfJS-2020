// @ts-ignore
import React, { useMemo } from 'react'
import { keyBy, sortBy } from 'lodash'
// @ts-ignore
import { useI18n } from 'core/i18n/i18nContext'
// @ts-ignore
import Block from 'core/blocks/block/Block'
// @ts-ignore
import ChartContainer from 'core/charts/ChartContainer'
import { BlockContext } from 'core/blocks/types'
import { ToolsExperienceToolData, ToolsArrowsToolData } from './types'
import { ToolsArrowsChart } from './ToolsArrowsChart.js'
import get from 'lodash/get'

/**
 * Convert raw API data to be compatible with tools arrows chart.
 */
const useNormalizedData = (rawData: ToolsExperienceToolData[]): ToolsArrowsToolData[] =>
    useMemo(() => {
        let data: ToolsArrowsToolData[] = rawData.map((tool) => {
            return {}
        })

        return data
    }, [rawData])

interface ToolsArrowsBlockProps {
    index: number
    block: BlockContext<
        'toolsExperienceMarimekkoTemplate',
        'ToolsExperienceMarimekkoBlock',
        { toolIds: string },
        any
    >
    data: ToolsExperienceToolData[]
    triggerId: string | null
}

export const ToolsArrowsBlock = ({ block, data, triggerId = null }: ToolsArrowsBlockProps) => {
    // const normalizedData = useNormalizedData(data)
    const controlledCurrent = triggerId
    
    return (
        <Block
            block={{
                ...block,
                blockName: 'tools_arrows',
                showLegend: false,
            }}
            data={data}
        >
            <ChartContainer fit>
                <ToolsArrowsChart data={data} current={controlledCurrent} activeCategory="all"/>
            </ChartContainer>
        </Block>
    )
}
