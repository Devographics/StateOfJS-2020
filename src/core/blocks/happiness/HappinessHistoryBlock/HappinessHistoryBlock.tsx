import React from 'react'
// @ts-ignore
import Block from 'core/blocks/block/Block'
import { BlockContext } from 'core/blocks/types'
import { HappinessYearMean } from 'core/survey_api/happiness'
import { HappinessHistoryChart } from './HappinessHistoryChart'

interface HappinessHistoryBlockProps {
    block: BlockContext<'happinessHistoryTemplate', 'HappinessHistoryBlock'>
    data: HappinessYearMean[]
}

export const HappinessHistoryBlock = ({ block, data }: HappinessHistoryBlockProps) => (
    <Block data={data} block={block}>
        <HappinessHistoryChart data={data} />
    </Block>
)
