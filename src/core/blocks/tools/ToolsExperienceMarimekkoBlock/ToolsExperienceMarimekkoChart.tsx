// @ts-ignore
import React, { useMemo } from 'react'
import { useTheme } from 'styled-components'
import { DataFormatter } from '@nivo/core'
import { keyBy } from 'lodash'
import { ResponsiveMarimekko, CustomLayerProps } from '@nivo/marimekko'
import { keys } from 'core/bucket_keys'
// @ts-ignore
import { useI18n } from 'core/i18n/i18nContext'
import { ToolsExperienceMarimekkoToolData } from './types'
import { ToolsExperienceMarimekkoLegend } from './ToolsExperienceMarimekkoLegend'

export const MARGIN = {
    top: 30,
    right: 10,
    bottom: 120,
    left: 160,
}
export const ROW_HEIGHT = 40

/**
 * Create a map of tool experience keys for easier access.
 */
const experienceKeys = keyBy(keys.tools.keys, 'id')

/**
 * In order to create a diverging chart (<– negative | positive –>),
 * we have to use negative and positive values, that's why we're using
 * this formatter, also to add a `%` sign to values.
 */
const valueFormatter = ((value: number) => `${Math.abs(Math.round(value))}%`) as DataFormatter

/**
 * Add a shadow behind each tool bars.
 */
const ShadowsLayer = ({ data }: CustomLayerProps<ToolsExperienceMarimekkoToolData>) => {
    return (
        <g>
            {data.map((datum) => (
                <rect
                    key={datum.id}
                    x={datum.x - 4}
                    y={datum.y + 7}
                    width={datum.width}
                    height={datum.height}
                    fill="rgba(0, 0, 0, .5)"
                />
            ))}
        </g>
    )
}

/**
 * Extra layer to add tool names.
 */
const ToolsLabels = ({ data }: CustomLayerProps<ToolsExperienceMarimekkoToolData>) => {
    const theme = useTheme()

    return (
        <g>
            {data.map((datum) => {
                const link = datum.data.tool.homepage

                const text = (
                    <text
                        style={{
                            fill: link ? theme.colors.link : theme.colors.text,
                            fontFamily: theme.typography.fontFamily,
                            fontSize: 14,
                        }}
                        dominantBaseline="central"
                    >
                        {datum.id}
                    </text>
                )

                return (
                    <g key={datum.id} transform={`translate(-160, ${datum.y + datum.height / 2})`}>
                        {link && <a href={datum.data.tool.homepage}>{text}</a>}
                        {!link && text}
                    </g>
                )
            })}
        </g>
    )
}

interface ToolsExperienceMarimekkoChartProps {
    data: ToolsExperienceMarimekkoToolData[]
}

export const ToolsExperienceMarimekkoChart = (props: ToolsExperienceMarimekkoChartProps) => {
    const { translate } = useI18n()

    // `id` is the label while `value` is the accessor
    // for a given dimension.
    const dimensions = useMemo(
        () => [
            {
                id: translate(experienceKeys.not_interested.label),
                value: experienceKeys.not_interested.id,
            },
            {
                id: translate(experienceKeys.would_not_use.label),
                value: experienceKeys.would_not_use.id,
            },
            {
                id: translate(experienceKeys.would_use.label),
                value: experienceKeys.would_use.id,
            },
            {
                id: translate(experienceKeys.interested.label),
                value: experienceKeys.interested.id,
            },
        ],
        [translate]
    )

    const theme = useTheme()

    // colors should match the order defined in `dimensions`.
    const colors = useMemo(
        () => dimensions.map((dimension) => theme.colors.ranges.tools[dimension.value]),
        [dimensions, theme]
    )

    return (
        <ResponsiveMarimekko<ToolsExperienceMarimekkoToolData>
            margin={MARGIN}
            axisTop={{
                format: valueFormatter,
            }}
            axisBottom={{
                format: valueFormatter,
            }}
            id="tool.name"
            value="awareness"
            valueFormat={valueFormatter}
            data={props.data}
            dimensions={dimensions}
            theme={theme.charts}
            colors={colors}
            enableGridX
            enableGridY={false}
            offset="diverging"
            layout="horizontal"
            animate={false}
            innerPadding={3}
            outerPadding={7}
            layers={[
                ({ bars }) => (
                    <g
                        transform={`translate(${bars[2].x}, ${
                            bars[bars.length - 1].y + bars[bars.length - 1].height + 60
                        })`}
                    >
                        <ToolsExperienceMarimekkoLegend colors={theme.colors.ranges.tools} />
                    </g>
                ),
                'grid',
                'axes',
                // ShadowsLayer,
                ToolsLabels,
                'bars',
            ]}
        />
    )
}
