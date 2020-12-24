import React, { useState, useMemo } from 'react'
import { BlockContext } from 'core/blocks/types'
// @ts-ignore
import Block from 'core/blocks/block/Block'
// @ts-ignore
import ChartContainer from 'core/charts/ChartContainer'
import { RankingChart, RankingChartSerie } from 'core/charts/generic/RankingChart'
// @ts-ignore
import { useI18n } from 'core/i18n/i18nContext'
// @ts-ignore
import ButtonGroup from 'core/components/ButtonGroup'
// @ts-ignore
import Button from 'core/components/Button'
import { Entity } from 'core/types'

type MetricId = 'satisfaction' | 'interest' | 'usage' | 'awareness'

const ALL_METRICS: MetricId[] = ['satisfaction', 'interest', 'usage', 'awareness']

interface SwitcherProps {
    setMetric: (metric: MetricId) => void
    metric: MetricId
}

const Switcher = ({ setMetric, metric }: SwitcherProps) => {
    const { translate } = useI18n()

    return (
        <ButtonGroup>
            {ALL_METRICS.map((key) => (
                <Button
                    key={key}
                    size="small"
                    className={`Button--${metric === key ? 'selected' : 'unselected'}`}
                    onClick={() => setMetric(key)}
                >
                    <span className="desktop">
                        {translate(`options.experience_ranking.${key}`)}
                    </span>
                    <span className="mobile">
                        {translate(`options.experience_ranking.${key}`)[0]}
                    </span>
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
    >,
    triggerId: MetricId,
    data: ToolData[],
    titleProps: any
}

export const ToolsExperienceRankingBlock = ({ block, data, triggerId }: ToolsExperienceRankingBlockProps) => {
    const [metric, setMetric] = useState<MetricId>('satisfaction')

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

    return (
        <Block
            block={block}
            titleProps={{ switcher: <Switcher setMetric={setMetric} metric={controlledMetric} /> }}
            data={data}
        >
            <ChartContainer height={data.length * 50 + 80}>
                <RankingChart data={chartData} />
            </ChartContainer>
        </Block>
    )
}
