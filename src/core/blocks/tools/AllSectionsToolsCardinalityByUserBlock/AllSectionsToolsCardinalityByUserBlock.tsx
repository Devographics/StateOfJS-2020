import React, { useMemo, useState } from 'react'
import { range } from 'lodash'
// @ts-ignore
import Block from 'core/blocks/block/Block'
import { BlockContext } from 'core/blocks/types'
// @ts-ignore
import { useI18n } from 'core/i18n/i18nContext'
import { ToolsCardinalityByUserBucket } from 'core/survey_api/tools'
// @ts-ignore
import { toolsCategories } from 'config/variables.yml'
import { AllSectionsToolsCardinalityByUserChart } from './AllSectionsToolsCardinalityByUserChart'

interface AllSectionsToolsCardinalityByUserBlockProps {
    block: BlockContext<
        'sectionToolsCardinalityByUserTemplate',
        'SectionToolsCardinalityByUserBlock'
    >
    data: Record<string, ToolsCardinalityByUserBucket[]>
    units?: 'percentage' | 'count'
}

const getChartData = (data: AllSectionsToolsCardinalityByUserBlockProps['data']) => {
    // As GraphQL queries get merged for a page, you can get
    // unwanted props, so we cannot just use object keys for
    // the data itself, hence the use of `toolsCategories`.
    return Object.entries<string[]>(toolsCategories).map(([sectionId, toolIds]) => {
        if (sectionId in data) {
            const sectionBuckets = data[sectionId]

            const normalizedBuckets = range(toolIds.length, 0).map((cardinality) => {
                const matchingBucket = sectionBuckets.find(
                    (bucket) => bucket.cardinality === cardinality
                )
                if (matchingBucket) {
                    return matchingBucket
                }

                return {
                    cardinality,
                    count: 0,
                    percentage: 0,
                }
            })

            return {
                sectionId,
                data: normalizedBuckets,
            }
        } else {
            return {
                sectionId,
                data: [],
            }
        }
    }) as {
        sectionId: string
        data: ToolsCardinalityByUserBucket[]
    }[]
}

export const AllSectionsToolsCardinalityByUserBlock = ({
    block,
    data,
    units: defaultUnits = 'percentage',
}: AllSectionsToolsCardinalityByUserBlockProps) => {
    const { translate } = useI18n()
    const [units, setUnits] = useState(defaultUnits)

    const title = translate(`block.title.all_sections_tools_cardinality_by_user`)
    const description = translate(`block.description.all_sections_tools_cardinality_by_user`)

    const charData = useMemo(() => getChartData(data), [data])

    return (
        <Block
            units={units}
            setUnits={setUnits}
            block={{
                ...block,
                title,
                description,
                showLegend: false,
            }}
            data={data}
        >
            <AllSectionsToolsCardinalityByUserChart data={charData} units={units} />
        </Block>
    )
}
