import React, { useState, useMemo } from 'react'
import { BlockContext } from 'core/blocks/types'
// @ts-ignore
import Block from 'core/blocks/block/Block'
// @ts-ignore
import ChartContainer from 'core/charts/ChartContainer'
import { RankingChart, RankingChartSerie } from 'core/charts/generic/RankingChart'
// @ts-ignore
import ButtonGroup from 'core/components/ButtonGroup'
// @ts-ignore
import Button from 'core/components/Button'
import { Entity } from 'core/types'
// @ts-ignore
import T from 'core/i18n/T'
// @ts-ignore
import { useI18n } from 'core/i18n/i18nContext'

type MetricId = 'satisfaction' | 'interest' | 'usage' | 'awareness'
type ViewId = 'viz' | 'data'

const ALL_METRICS: MetricId[] = ['satisfaction', 'interest', 'usage', 'awareness']

interface SwitcherProps {
    setMetric: (metric: MetricId) => void
    metric: MetricId
}

const Switcher = ({ setMetric, metric }: SwitcherProps) => {
    return (
        <ButtonGroup>
            {ALL_METRICS.map((key) => (
                <Button
                    key={key}
                    size="small"
                    className={`Button--${metric === key ? 'selected' : 'unselected'}`}
                    onClick={() => setMetric(key)}
                >
                    <T k={`options.experience_ranking.${key}`} />
                </Button>
            ))}
        </ButtonGroup>
    )
}

interface MetricBucket {
    year: number
    rank: number
    percentage: number
}

interface ToolData extends Record<MetricId, MetricBucket[]> {
    id: string
    entity: Entity
}

interface ToolsExperienceRankingBlockProps {
    block: BlockContext<
        'toolsExperienceRankingTemplate',
        'ToolsExperienceRankingBlock',
        { toolIds: string },
        any
    >
    triggerId: MetricId
    data: ToolData[]
    titleProps: any
}

export const ToolsExperienceRankingBlock = ({
    block,
    data,
    triggerId,
}: ToolsExperienceRankingBlockProps) => {
    const [metric, setMetric] = useState<MetricId>('satisfaction')
    const { translate } = useI18n()

    const controlledMetric = triggerId || metric

    const chartData: RankingChartSerie[] = useMemo(
        () =>
            data.map((tool) => {
                return {
                    id: tool.id,
                    name: tool.entity.name,
                    data: tool[controlledMetric].map((bucket) => {
                        return {
                            x: bucket.year,
                            y: bucket.rank,
                            percentage: bucket.percentage,
                        }
                    }),
                }
            }),
        [data, controlledMetric]
    )

    const [view, setView] = useState<ViewId>('viz');

    const sections = [
      {id: 'satisfaction', label: translate('options.experience_ranking.satisfaction')},
      {id: 'interest', label: translate('options.experience_ranking.interest')},
      {id: 'usage', label: translate('options.experience_ranking.usage')},
      {id: 'awareness', label: translate('options.experience_ranking.awareness')},
    ]

    const getRows = (data, section) => {
      const rows = [];
      data.forEach((row) => {
        const newRow = [{ id: 'label', label: row.entity.name }];
        row[section].forEach((cell) => {
          newRow.push({
            id: `y_${cell.year}`,
            label: cell.percentage ? `${cell.percentage}% (#${cell.rank})` : '-'
          })
        });
        rows.push(newRow);
      });
      return rows;
    };

    let headings = [{id: 'label', label: translate('tools.technology')}];
    headings = headings.concat(data[0].awareness.map(row => ({id: `y_${row.year}`, label: row.year})));
    const tables = [];
    sections.forEach((section) => {
      tables.push({
        id: section.id,
        title: section.label,
        headings: headings,
        rows: getRows(data, section.id),
      })
    });
    
    return (
        <Block
            view={view}
            setView={setView}
            block={block}
            titleProps={{ switcher: <Switcher setMetric={setMetric} metric={controlledMetric} /> }}
            data={data}
            tables={tables}
        >
            <ChartContainer height={data.length * 50 + 80}>
                <RankingChart data={chartData} />
            </ChartContainer>
        </Block>
    )
}
