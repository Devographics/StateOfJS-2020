import React, { useMemo, useState } from 'react'
// @ts-ignore
import Block from 'core/blocks/block/Block'
import { BlockContext } from 'core/blocks/types'
// @ts-ignore
import { toolsCategories } from 'config/variables.yml'
import { ToolsCityscapeChart } from './ToolsCityscapeChart'
import { ToolsExperienceToolData, ToolExperienceBucket } from 'core/survey_api/tools'
import { useTheme } from 'styled-components'
import { Entity } from 'core/types'
import sortBy from 'lodash/sortBy'
import groupBy from 'lodash/groupBy'
import shuffle from 'lodash/shuffle'
import { range } from 'lodash'

export const layerCount = 5

interface ToolsCityscapeBlockProps {
    block: BlockContext<
        'sectionToolsCardinalityByUserTemplate',
        'SectionToolsCardinalityByUserBlock'
    >
    data: ToolsExperienceToolData[]
    units?: 'percentage' | 'count'
}

export interface ToolsCityscapeToolData {
    id: string
    entity: Entity
    categoryId?: string
    color: string
    usage: number
    layer?: number
}

const getCategory = (id: string, theme: any) => {
    const categoryId = Object.keys(toolsCategories).find((categoryId) =>
        toolsCategories[categoryId].includes(id)
    )
    const color = categoryId ? theme.colors.ranges.toolSections[categoryId] : 'red'

    return { categoryId, color }
}

const findBucket = (buckets: ToolExperienceBucket[], id: string) =>
    buckets.find((b: ToolExperienceBucket) => b.id === id) || { count: 0, percentage: 0 }

const getChartData = (data: ToolsExperienceToolData[], theme: any): ToolsCityscapeToolData[] => {
    return data.map((tool) => {
        const { id, entity, experience } = tool
        const buckets = experience.year.buckets
        const { categoryId, color } = getCategory(id, theme)
        const usage =
            findBucket(buckets, 'would_not_use').count + findBucket(buckets, 'would_use').count
        return { id, entity, categoryId, color, usage }
    })
}

const addPositions = (data: ToolsCityscapeToolData[]) => {
    const sortedData = sortBy(data, 'usage')
    const totalCount = sortedData.length
    // subtract 1 here because index will be zero-based
    const itemsInLayer = Math.round(totalCount / (layerCount - 1))
    return sortedData.map((tool, index) => {
        const layer = Math.round(index / itemsInLayer)
        return {
            ...tool,
            layer,
        }
    })
}

const groupByZ = (data: ToolsCityscapeToolData[]) => {
    return range(layerCount).map((i) => ({
        layer: i,
        items: shuffle(data.filter((tool) => tool.layer === i)),
    }))
}

export const ToolsCityscapeBlock = ({
    block,
    data,
    units: defaultUnits = 'percentage',
}: ToolsCityscapeBlockProps) => {
    const theme = useTheme()

    const [units, setUnits] = useState(defaultUnits)
    console.log(data)

    const chartData = useMemo(() => groupByZ(addPositions(getChartData(data, theme))), [
        data,
        theme,
    ])

    console.log(chartData)

    return (
        <Block
            units={units}
            setUnits={setUnits}
            block={{
                ...block,
                blockName: 'all_sections_tools_cardinality_by_user',
                // title,
                // description,
                showLegend: false,
            }}
            data={data}
        >
            <ToolsCityscapeChart data={chartData} units={units} />
        </Block>
    )
}
