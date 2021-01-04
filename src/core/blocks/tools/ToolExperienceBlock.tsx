import React, { useMemo, useState } from 'react'
import keyBy from 'lodash/keyBy'
import { BlockContext } from 'core/blocks/types'
import { ToolAllYearsExperience, ToolExperienceBucket } from 'core/survey_api/tools'
// @ts-ignore
import Block from 'core/blocks/block/Block'
// @ts-ignore
import ChartContainer from 'core/charts/ChartContainer'
// @ts-ignore
import { useBucketKeys } from 'core/helpers/useBucketKeys'
// @ts-ignore
import { usePageContext } from 'core/helpers/pageContext'
import { ExperienceByYearBarChart } from 'core/charts/generic/ExperienceByYearBarChart'

const BAR_THICKNESS = 28
const BAR_SPACING = 16

interface ToolExperienceBlockProps {
    block: BlockContext<'toolExperienceTemplate', 'ToolExperienceBlock', { toolIds: string }>
    data: ToolAllYearsExperience
    units?: 'percentage' | 'count'
}

export const ToolExperienceBlock = ({
    block,
    data,
    units: defaultUnits = 'percentage',
}: ToolExperienceBlockProps) => {
    const context = usePageContext()
    const { locale } = context

    const [units, setUnits] = useState(defaultUnits)

    const title = data.entity.name
    const titleLink = data.entity.homepage
    // as descriptions are extracted from best of js/github...
    // we only have english available.
    const description = locale.id === 'en-US' && data.entity.description!

    const bucketKeys = useBucketKeys('tools')
    const allYears = data.experience.all_years
    const normalizedData = useMemo(
        () =>
            allYears.map((yearExperience, index) => {
                const yearData: ToolExperienceBucket[] = bucketKeys.map((key: { id: string }) => {
                    const matchingBucket = yearExperience.buckets.find(
                        (bucket) => bucket.id === key.id
                    )
                    return (
                        matchingBucket || {
                            id: key.id,
                            count: 0,
                            percentage: 0,
                        }
                    )
                })

                const isLastYear = index === allYears.length - 1

                return {
                    year: yearExperience.year,
                    ...keyBy(yearData, 'id'),
                    thickness: isLastYear ? 2 : 1,
                }
            }),
        [data, bucketKeys]
    )

    if (allYears.length === 0) {
        return <div>no data</div>
    }

    const chartHeight = (allYears.length - 1) * (BAR_THICKNESS + BAR_SPACING) + BAR_THICKNESS * 2

    return (
        <Block
            units={units}
            setUnits={setUnits}
            block={{ ...block, title, titleLink, description, showDescription: !!description }}
            data={allYears}
        >
            <ChartContainer height={chartHeight} fit>
                <ExperienceByYearBarChart
                    data={normalizedData}
                    bucketKeys={bucketKeys}
                    units={units}
                    spacing={BAR_SPACING}
                />
            </ChartContainer>
        </Block>
    )
}

export default ToolExperienceBlock