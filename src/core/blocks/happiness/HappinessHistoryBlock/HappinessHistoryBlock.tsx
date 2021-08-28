import React, { useState } from 'react'
// @ts-ignore
import Block from 'core/blocks/block/Block'
import { BlockContext } from 'core/blocks/types'
import { HappinessYearMean } from 'core/survey_api/happiness'
import { HappinessHistoryChart } from './HappinessHistoryChart'

interface HappinessHistoryBlockProps {
    block: BlockContext<'happinessHistoryTemplate', 'HappinessHistoryBlock'>
    data: HappinessYearMean[]
}

export const HappinessHistoryBlock = ({ block, data }: HappinessHistoryBlockProps) => {
  const [view, setView] = useState('viz');

  const headings = [{id: 'year', label: 'year'}, {id: 'mean', label: 'mean'}];
  const rows = [];
  data.forEach((row) => {
    rows.push([{id: 'year', label: row.year}, {id: 'mean', label: `${row.mean}/5`}]);
  });

  const tables = [{headings: headings, rows: rows}];

  return  <Block data={data} block={block} view={view} setView={setView} tables={tables}>
        <HappinessHistoryChart data={data} />
    </Block>
}
