import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from 'styled-components'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import { useI18n } from 'core/i18n/i18nContext'

const totalCountRounded = 9000

const labelPositions = {
    satisfaction: {
        Skeleton: [-30, -15],
        Tachyons: [-80, 0],
        'Spectre.css': [0, 5],
        Primer: [0, 5],
        'Ant Design': [0, 5],
        JSS: [0, 10],
        SMACSS: [0, -10],
        'Styled System': [-50, -20],
        'Tailwind CSS': [-50, -20],
        'Styled Components': [0, 10],
        Styletron: [0, 5],
        Fela: [0, 10],
        Stitches: [0, 5],
        Linaria: [0, -5],
        Bulma: [0, -5],
    },
    interest: {
        PureCSS: [-50, -20],
        Less: [-55, 0],
        JSS: [0, 10],
        SMACSS: [-70, 0],
        Radium: [-70, 0],
        Bulma: [0, 5],
        Styletron: [0, 5],
        Fela: [-55, 0],
        Linaria: [-80, 0],
        Stitches: [0, 5],
        'Spectre.css': [-50, -20],
    },
}

const margins = { top: 20, right: 90, bottom: 70, left: 90 }

const Nodes = (props) => {
    const { width, height, margin, nodes, current, metric } = props
    return (
        <g>
            {nodes.map((node, i) => (
                <Node
                    key={i}
                    {...node}
                    width={width}
                    height={height}
                    margin={margin}
                    current={current}
                    metric={metric}
                />
            ))}
        </g>
    )
}

const Crosshair = ({ x, y, label, cutoffX = 0, cutoffY = 0 }) => {
    const theme = useTheme()

    const width = label.length * 8 + 10
    const height = 22

    return (
        <g transform={`translate(${x},${y})`}>
            <g opacity={0.75}>
                <line
                    className="Scatterplot__Node__Crosshair__Line"
                    x1={0}
                    y1={0}
                    x2={-x - cutoffX}
                    y2={-y + cutoffY}
                    stroke={theme.colors.border}
                    strokeWidth={3}
                />
                <rect
                    x={-(width / 2)}
                    y={-height / 2}
                    width={width}
                    height={height}
                    fill={theme.colors.backgroundInverted}
                    rx={3}
                />
            </g>
            <text
                className="Scatterplot__Node__Crosshair__Label"
                fill={theme.colors.textInverted}
                textAnchor="middle"
                alignmentBaseline="middle"
            >
                {label}
            </text>
        </g>
    )
}
const Node = (props) => {
    const theme = useTheme()

    const { id, data, style, x, y, height, margin, current, metric } = props
    const { name, formattedX, formattedY } = data
    const yInverted = height - margin.top - margin.bottom - y
    const cutoff = 12 // cut off the lines a little before the node
    const translateLabel = labelPositions[metric][name] || [0, 0]
    const category = id.split('.')[0]
    const opacity = current !== null && current !== category ? 0.3 : 1

    return (
        <g className="Scatterplot__Node" transform={`translate(${x},${y})`}>
            <g className="Scatterplot__Node__Crosshairs">
                <circle
                    className="Scatterplot__Node__PointHover"
                    r={12}
                    strokeWidth={3}
                    stroke={theme.colors.border}
                />
                <Crosshair x={0} y={yInverted} label={`${formattedX}`} cutoffY={cutoff} />
                <Crosshair x={-x} y={0} label={`${formattedY}%`} cutoffX={cutoff} />
            </g>

            <circle className="Scatterplot__Node__PointHoverZone" r={16} fill="transparent" />
            <circle
                className="Scatterplot__Node__Point"
                r={6}
                fill={style.color}
                opacity={opacity}
            />

            <g
                className="Scatterplot__Node__Label"
                transform={`translate(${12 + translateLabel[0]},${1 + translateLabel[1]})`}
                opacity={opacity}
            >
                <rect
                    className="Scatterplot__Node__Label__Background"
                    x={-6}
                    y={-10}
                    width={name && name.length * 8 + 9}
                    height={20}
                    fill={theme.colors.backgroundInverted}
                    rx={3}
                />
                <text
                    className="Scatterplot__Node__Label__Text"
                    textAnchor="left"
                    alignmentBaseline="middle"
                    fill={theme.colors.text}
                >
                    {name}
                </text>
            </g>
        </g>
    )
}

const quadrantLabels = {
    satisfaction: ['assess', 'adopt', 'avoid', 'analyze'],
    interest: ['mainstream', 'next_big_thing', 'unknown', 'low_interest'],
}

const Quadrants = ({ width, height, margin, metric = 'satisfaction' }) => {
    const { translate } = useI18n()
    const theme = useTheme()

    const qWidth = (width - margin.right - margin.left) / 2
    const qHeight = (height - margin.top - margin.bottom) / 2

    const quadrants = [
        {
            x: 0,
            y: 0,
            color: theme.colors.background,
            label: translate(`options.quadrant.${quadrantLabels[metric][0]}`),
        },
        {
            x: qWidth,
            y: 0,
            color: theme.colors.backgroundForeground,
            label: translate(`options.quadrant.${quadrantLabels[metric][1]}`),
        },
        {
            x: 0,
            y: qHeight,
            color: theme.colors.backgroundBackground,
            label: translate(`options.quadrant.${quadrantLabels[metric][2]}`),
        },
        {
            x: qWidth,
            y: qHeight,
            color: theme.colors.background,
            label: translate(`options.quadrant.${quadrantLabels[metric][3]}`),
        },
    ]

    return (
        <g className="Quadrant__Background">
            {quadrants.map(({ x, y, color, label }) => (
                <g key={label}>
                    <rect x={x} y={y} width={qWidth} height={qHeight} fill={color} />
                    {metric === 'satisfaction' && (
                        <text
                            className="Quadrant__Label"
                            x={x + qWidth / 2}
                            y={y + qHeight / 2}
                            textAnchor="middle"
                            alignmentBaseline="central"
                        >
                            {label}
                        </text>
                    )}
                </g>
            ))}
        </g>
    )
}

const ToolsScatterplotChart = ({ data, metric = 'satisfaction', current }) => {
    const theme = useTheme()
    const { translate } = useI18n()

    const quadrants = [
        (props) => <Quadrants {...props} metric={metric} />,
        'grid',
        'axes',
        (props) => <Nodes {...props} current={current} metric={metric} />,
        /*'nodes', */ 'markers',
        'mesh',
        'legends',
    ]

    return (
        <div style={{ height: 600 }}>
            <ResponsiveScatterPlot
                data={data}
                margin={margins}
                xScale={{ type: 'linear', min: 0, max: totalCountRounded }}
                yScale={{ type: 'linear', min: 0, max: 100 }}
                symbolSize={16}
                theme={theme.charts}
                axisTop={null}
                axisRight={null}
                useMesh={false}
                axisBottom={{
                    orient: 'bottom',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: translate('charts.axis_legends.users_count'),
                    legendPosition: 'middle',
                    legendOffset: 46,
                }}
                axisLeft={{
                    orient: 'left',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: translate(`charts.axis_legends.${metric}_percentage`),
                    legendPosition: 'middle',
                    legendOffset: -60,
                    format: (s) => `${s}%`,
                }}
                layers={quadrants}
                colors={(dot) => theme.colors.ranges.toolSections[dot.serieId]}
                animate={false}
                tooltip={({ node }) => {
                    const { data, x, y } = node
                    return (
                        <span>
                            <strong>
                                {data.name} ({data.serieId})
                            </strong>
                            : {`${x} ${translate('users')},  ${y}${translate(`percent_${metric}`)}`}
                        </span>
                    )
                }}
                renderNode={Node}
            />
        </div>
    )
}

ToolsScatterplotChart.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            data: PropTypes.arrayOf(
                PropTypes.shape({
                    id: PropTypes.string.isRequired,
                    x: PropTypes.number.isRequired,
                    y: PropTypes.number.isRequired,
                })
            ),
        }).isRequired
    ),
}

export default memo(ToolsScatterplotChart)
