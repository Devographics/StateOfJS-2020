import React, { useState } from 'react'
// @ts-ignore
import Block from 'core/blocks/block/Block'
import { BlockContext } from 'core/blocks/types'
import { ToolsCardinalityByUserBucket } from 'core/survey_api/tools'

interface SectionToolsCardinalityByUserBlockProps {
    block: BlockContext<
        'sectionToolsCardinalityByUserTemplate',
        'SectionToolsCardinalityByUserBlock'
    >
    data: ToolsCardinalityByUserBucket[]
    units?: 'percentage' | 'count'
}

export const SectionToolsCardinalityByUserBlock = ({
    block,
    data,
    units: defaultUnits = 'percentage',
}: SectionToolsCardinalityByUserBlockProps) => {
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
            <div>SectionToolsCardinalityByUserBlock</div>
        </Block>
    )
}