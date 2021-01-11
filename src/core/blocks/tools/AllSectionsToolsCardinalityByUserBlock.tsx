import React, {useMemo, useState} from 'react'
import { maxBy, range } from 'lodash'
// @ts-ignore
import Block from 'core/blocks/block/Block'
import { BlockContext } from 'core/blocks/types'
import { ToolsCardinalityByUserBucket } from 'core/survey_api/tools'
// @ts-ignore
import { toolsCategories } from 'config/variables.yml'

interface AllSectionsToolsCardinalityByUserBlockProps {
    block: BlockContext<
        'sectionToolsCardinalityByUserTemplate',
        'SectionToolsCardinalityByUserBlock'
    >
    data: Record<string, ToolsCardinalityByUserBucket[]>
    units?: 'percentage' | 'count'
}

const computeChartData = (data: AllSectionsToolsCardinalityByUserBlockProps['data']) => {
    const normalizedData: {
        sectionId: string
        data: ToolsCardinalityByUserBucket[]
    }[] = []

    // we aggregate all buckets to be able
    // to extract max values.
    let allBuckets: ToolsCardinalityByUserBucket[] = []

    // As GraphQL queries get merged for a page, you can get
    // unwanted props, so we cannot just use object keys for
    // the data itself, hence the use of `toolsCategories`.
    Object.keys(toolsCategories).forEach(sectionId => {
        if (sectionId in data) {
            // exclude percentage below 1
            const filteredBuckets = data[sectionId].filter(bucket => bucket.percentage >= 1)
            normalizedData.push({
                sectionId,
                data: filteredBuckets,
            })
            allBuckets = [
                ...allBuckets,
                ...filteredBuckets,
            ]
        }
    })

    const maxCardinality = maxBy(allBuckets, 'cardinality')!.cardinality

    // A second run to fill missing cardinality buckets,
    // ensuring consistency.
    return normalizedData.map(section => {
        // We do not include 0 because it's hard to tell
        // if the question was just skipped.
        // Also note that the way the range is defined
        // is sorting by cardinality in descending order.
        const sectionBuckets = range(maxCardinality, 0).map(cardinality => {
            const matchingBucket = section.data.find(bucket => bucket.cardinality === cardinality)
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
            ...section,
            data: sectionBuckets,
        }
    })
}

export const AllSectionsToolsCardinalityByUserBlock = ({
    block,
    data,
    units: defaultUnits = 'percentage',
}: AllSectionsToolsCardinalityByUserBlockProps) => {
    const [units, setUnits] = useState(defaultUnits)

    const charData = useMemo(() => computeChartData(data), [data])

    return (
        <Block
            units={units}
            setUnits={setUnits}
            block={{
                ...block,
                showLegend: false,
            }}
            data={data}
        >
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: `40px repeat(${charData.length}, minmax(0, 1fr))`,
                    gridColumnGap: '12px',
                }}
            >
                <div>
                    YAY
                </div>
                {charData.map(section => (
                    <div key={section.sectionId}>
                        <h3>{section.sectionId}</h3>
                        {section.data.map(bucket => (
                            <div
                                key={bucket.cardinality}
                                style={{
                                    width: '100%',
                                    height: 20,
                                    background: 'rgba(0, 0, 0, .35)',
                                    marginTop: 3,
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}
                            >
                                <div
                                    style={{
                                        background: 'pink',
                                        width: `${bucket.percentage}%`,
                                        height: '100%'
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </Block>
    )
}