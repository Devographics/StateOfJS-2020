import React, { useState } from 'react'
// @ts-ignore
import Block from 'core/blocks/block/Block'
import { BlockContext } from 'core/blocks/types'
import { ToolsCardinalityByUserBucket } from 'core/survey_api/tools'

interface AllSectionsToolsCardinalityByUserBlockProps {
    block: BlockContext<
        'sectionToolsCardinalityByUserTemplate',
        'SectionToolsCardinalityByUserBlock'
    >
    data: ToolsCardinalityByUserBucket[]
    units?: 'percentage' | 'count'
}

export const AllSectionsToolsCardinalityByUserBlock = ({
    block,
    data,
    units: defaultUnits = 'percentage',
}: AllSectionsToolsCardinalityByUserBlockProps) => {
    const [units, setUnits] = useState(defaultUnits)

    console.log(block, data)

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
            <div>AllSectionsToolsCardinalityByUserBlock</div>
        </Block>
    )
}