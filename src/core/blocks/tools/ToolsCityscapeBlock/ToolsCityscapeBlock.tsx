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
import sum from 'lodash/sum'
import range from 'lodash/range'

export const layerCount = 6

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

/*

Get a staggered layer distribution

x x x
 x x
x x x

Returns an array of the form [12, 11, 12, 11, 12, 2]

*/
const getLayerDistribution = (totalCount: number): number[] => {
    let distribution = []
    let i = 0,
        j = 0
    // remove 1 to account for staggering
    const baseItemsInLayer = Math.floor(totalCount / (layerCount-1))

    while (i < totalCount && j < 100) {
        j++
        const itemsInLayer: number =
            distribution.length % 2 === 0 ? baseItemsInLayer : baseItemsInLayer - 1
        const remainingItems = totalCount - sum(distribution)
        if (itemsInLayer < remainingItems) {
            // if we haven't added all items, keep going
            distribution.push(itemsInLayer)
            i += itemsInLayer
        } else {
            // else add remaining difference to last layer and break
            distribution.push(remainingItems)
            break
        }
    }

    return distribution
}

/*

Return the items in a layer according to a distribution

*/
const getLayerItems = (
    data: ToolsCityscapeToolData[],
    distribution: number[],
    index: number
): ToolsCityscapeToolData[] => {
    const lowerBound = sum(distribution.slice(0, index))
    const higherBound = sum(distribution.slice(0, index + 1))
    return shuffle(data.slice(lowerBound, higherBound))
}

const computeLayer = (data: ToolsCityscapeToolData[]) => {
    const sortedData = sortBy(data, 'usage')
    const totalCount = sortedData.length
    let layerDistribution = getLayerDistribution(totalCount)
    return range(layerDistribution.length).map((i) => ({
        layer: i,
        items: getLayerItems(sortedData, layerDistribution, i),
    }))
}

export const ToolsCityscapeBlock = ({
    block,
    data,
    units: defaultUnits = 'percentage',
}: ToolsCityscapeBlockProps) => {
    const theme = useTheme()

    const [units, setUnits] = useState(defaultUnits)

    const chartData = useMemo(() => computeLayer(getChartData(data, theme)), [data, theme])

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
