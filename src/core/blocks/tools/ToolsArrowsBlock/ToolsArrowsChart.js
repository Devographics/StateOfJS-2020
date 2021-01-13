import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { scaleLinear } from 'd3-scale'
import map from 'lodash/map'
import range from 'lodash/range'
import flatten from 'lodash/flatten'
import { extent, max, sum } from 'd3-array'
import { toolsCategories } from 'config/variables.yml'
import offsets from './toolsArrowsLabelOffsets.js'
import { useI18n } from 'core/i18n/i18nContext'
import './ToolsArrowsChart.scss'
import get from 'lodash/get'
import { useTheme } from 'styled-components'
import labelOffsets from './toolsArrowsLabelOffsets.js'
import { getVelocity, getVelocityColor, getVelocityColorScale } from './helpers.js'

// hide any item with less than n years of data
const minimumYearCount = 2

const gradientLineWidthScale = scaleLinear().domain([0, 30]).range([11, 7]).clamp(true)

export const ToolsArrowsChart = ({ data, activeCategory }) => {
    const theme = useTheme()

    const getColor = (id) => theme.colors.ranges.toolSections[id]

    let toolToCategoryMap = {}
    map(toolsCategories, (tools, category) => {
        tools.forEach((tool) => {
            toolToCategoryMap[tool] = category
        })
    })

    let categoryColorMap = {}
    let categoryColorScales = {}
    map(toolsCategories, (tools, category) => {
        const color = getColor(category)
        categoryColorMap[category] = color
        categoryColorScales[category] = scaleLinear()
            .domain([0, 30])
            .range([color, '#303652'])
            .clamp(true)
    })

    const { translate } = useI18n()

    const [hoveredTool, setHoveredTool] = useState(null)
    // const windowWidth = useWindowWidth()
    const windowHeight = useWindowHeight()

    const dms = useMemo(() => {
        // const width = windowWidth > 1300 ? 900 :
        //     windowWidth > 900 ? 700 :
        //     600

        const width = windowHeight > 1000 ? 1200 : windowHeight > 800 ? 1000 : 950

        const height = windowHeight > 1000 ? 850 : windowHeight > 800 ? 750 : 650

        return {
            width,
            height,
        }
    }, [/* windowWidth, */ windowHeight])

    var isFirefox =
        typeof navigator !== 'undefined' &&
        navigator.userAgent.toLowerCase().indexOf('firefox') > -1

    const tools = data.map((d) => d.id)
    let toolNames = {}
    data.forEach((tool) => {
        toolNames[tool.id] = tool.entity.name
    })

    const items = useMemo(
        () =>
            data.map((tool) =>
                get(tool, 'experience.all_years', []).map(({ year, buckets }) => {
                    const points = buckets.map(({ id, percentage }) =>
                        conditionDiffs[id].map((d) => d * percentage)
                    )
                    return [sum(points.map((d) => d[0])), sum(points.map((d) => d[1])), year]
                })
            ),
        [data]
    )

    const scales = useMemo(() => {
        const xExtent = extent(flatten(items).map((d) => d[0]))
        const maxAbsX = max(xExtent.map(Math.abs))
        const xScale = scaleLinear()
            .domain([-maxAbsX, maxAbsX])
            .range([20, dms.width - 20])

        const yExtent = extent(flatten(items).map((d) => d[1]))
        const maxAbsY = max(yExtent.map(Math.abs))
        const yScale = scaleLinear()
            .domain([-maxAbsY, maxAbsY])
            .range([dms.height - 30, 30])

        return {
            x: xScale,
            y: yScale,
        }
    }, [items, dms])

    // // label positioning on drag

    // const labelBeingDragged = useRef(null)
    // const dragStartPosition = useRef({})
    // const offsets = useRef(labelOffsets)
    // const [iteration, setIteration] = useState(0)
    // const iterationRef = useRef(0)
    // iterationRef.current = iteration

    // function onDrag(e) {
    //     if (!offsets.current) return
    //     offsets.current[labelBeingDragged.current] = {
    //         x: e.clientX - dragStartPosition.current.x,
    //         y: e.clientY - dragStartPosition.current.y,
    //     }
    //     setIteration(iterationRef.current + 1)
    // }

    // const onDragEnd = () => {
    //     labelBeingDragged.current = null
    //     window.removeEventListener('pointerup', onDragEnd)
    //     window.removeEventListener('pointermove', onDrag)
    //     setIteration(iteration + 1)
    //     console.log('%coffsets', 'color: #7083EC', offsets.current)
    // }

    // const onDragStartLocal = (label) => (e) => {
    //     labelBeingDragged.current = label
    //     dragStartPosition.current = {
    //         x: e.clientX,
    //         y: e.clientY,
    //     }
    //     window.addEventListener('pointerup', onDragEnd)
    //     window.addEventListener('pointermove', onDrag)
    // }

    return (
        <div className="ToolsArrowsChart">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                className="ToolsArrowsChart__svg"
                height={dms.height}
                width={dms.width}
            >
                <line
                    className="ToolsArrowsChart__axis"
                    x2={dms.width}
                    y1={dms.height / 2}
                    y2={dms.height / 2}
                />
                <line
                    className="ToolsArrowsChart__axis"
                    x1={dms.width / 2}
                    x2={dms.width / 2}
                    y2={dms.height}
                />
                <text className="ToolsArrowsChart__axis__label" y={dms.height / 2 - 10}>
                    {translate('charts.tools_arrows.negative_opinion')}
                </text>
                <text
                    className="ToolsArrowsChart__axis__label"
                    x={dms.width}
                    y={dms.height / 2 - 10}
                    style={{
                        textAnchor: 'end',
                    }}
                >
                    {translate('charts.tools_arrows.positive_opinion')}
                </text>
                <text
                    className="ToolsArrowsChart__axis__label"
                    x={dms.width / 2}
                    y={10}
                    style={{
                        textAnchor: 'middle',
                    }}
                >
                    {translate('charts.tools_arrows.have_used')}
                </text>
                <text
                    className="ToolsArrowsChart__axis__label"
                    x={dms.width / 2}
                    y={dms.height - 10}
                    style={{
                        textAnchor: 'middle',
                    }}
                >
                    {translate('charts.tools_arrows.have_not_used')}
                </text>

                {/* lines loop */}

                {items.map((points, i) => {
                    if (!points.length || points.length < minimumYearCount) return null

                    const tool = tools[i]
                    const category = toolToCategoryMap[tool]

                    if (!points.length) return null

                    const thisYearPoint = points.slice(-1)[0]

                    // firefox has issues with too many line segments
                    const numberOfPointsPerSegment = isFirefox ? 1 : 12

                    const circles = flatten(
                        points.map(([x, y], i) => {
                            const nextPoint = points[i + 1]
                            if (!nextPoint) return []
                            const xScale = scaleLinear()
                                .domain([0, numberOfPointsPerSegment])
                                .range([x, nextPoint[0]])
                            const yScale = scaleLinear()
                                .domain([0, numberOfPointsPerSegment])
                                .range([y, nextPoint[1]])
                            return range(0, numberOfPointsPerSegment + 1).map((i) => [
                                scales.x(xScale(i)),
                                scales.y(yScale(i)),
                            ])
                        })
                    )

                    // const backgroundPath = [
                    //     'M',
                    //     points.map(([x, y]) => [scales.x(x), scales.y(y)].join(',')).join('L ')
                    // ].join(' ')

                    const x = scales.x(thisYearPoint[0])
                    const y = scales.y(thisYearPoint[1])
                    // const color = categoryColorMap[category]
                    // const colorScale = categoryColorScales[category]

                    const velocity = getVelocity(points)
                    const color = getVelocityColor(velocity, theme)
                    const colorScale = getVelocityColorScale(velocity, theme)

                    return (
                        <g
                            key={i}
                            className={`ToolsArrowsChart__tool ToolsArrowsChart__tool--is-${
                                activeCategory !== 'all' && activeCategory !== category
                                    ? 'hidden'
                                    : activeCategory === category
                                    ? 'active'
                                    : !hoveredTool
                                    ? 'normal'
                                    : hoveredTool.tool === tool
                                    ? 'hovering'
                                    : 'hovering-other'
                            }`}
                        >
                            {circles.slice(0, -1).map(([x, y], i) => (
                                <line
                                    key={i}
                                    className={`ToolsArrowsChart__gradient-line ToolsArrowsChart__gradient-line--nth-${i}`}
                                    x1={x}
                                    y1={y}
                                    x2={(circles[i + 1] || [])[0]}
                                    y2={(circles[i + 1] || [])[1]}
                                    stroke={colorScale((circles.length - i) * (isFirefox ? 5 : 1))}
                                    style={{
                                        strokeWidth: gradientLineWidthScale(
                                            (circles.length - i) * (isFirefox ? 5 : 1)
                                        ),
                                    }}
                                />
                            ))}
                            <circle
                                className="ToolsArrowsChart__now"
                                cx={x}
                                cy={y}
                                fill={color}
                                r="6"
                                style={{
                                    fillOpacity: points.length < 2 ? 1 : 0.2,
                                }}
                            />
                        </g>
                    )
                })}

                {/* dots loop */}

                {items.map((points, i) => {
                    const tool = tools[i]
                    const toolName = toolNames[tool]
                    const category = toolToCategoryMap[tool]
                    if (!points.length || points.length < minimumYearCount) return null

                    const thisYearPoint = points.slice(-1)[0]

                    const x = scales.x(thisYearPoint[0])
                    const y = scales.y(thisYearPoint[1])
                    // const color = categoryColorMap[category]

                    const velocity = getVelocity(points)
                    const color = getVelocityColor(velocity, theme)

                    // if (y > dms.height - 200 && Math.abs(x - dms.width / 2) < 100) return null

                    return (
                        <g
                            key={i}
                            className={`ToolsArrowsChart__tool ToolsArrowsChart__tool--is-${
                                activeCategory !== 'all' && activeCategory !== category
                                    ? 'hidden'
                                    : activeCategory === category
                                    ? 'active'
                                    : !hoveredTool
                                    ? 'normal'
                                    : hoveredTool.tool === tool
                                    ? 'hovering'
                                    : 'hovering-other'
                            }`}
                        >
                            <text
                                className="ToolsArrowsChart__label-background"
                                x={x + ((offsets[tools[i]] || {}).x || 0)}
                                y={y + ((offsets[tools[i]] || {}).y || 0)}
                            >
                                {toolName}
                            </text>
                            <text
                                className="ToolsArrowsChart__label"
                                fill={color}
                                x={x + ((offsets[tools[i]] || {}).x || 0)}
                                y={y + ((offsets[tools[i]] || {}).y || 0)}
                                onMouseEnter={() => setHoveredTool({ tool, points })}
                                onMouseLeave={() => setHoveredTool(null)}
                            >
                                {toolName}
                            </text>

                            {/* <g
                                className="ToolsArrowsChart__label__box"
                                transform={`translate(${
                                    x + ((offsets.current[tools[i]] || {}).x || 0)
                                }, ${y + ((offsets.current[tools[i]] || {}).y || 0)})`}
                                onMouseDown={onDragStartLocal(tools[i])}
                            >
                                <rect
                                    y="-10"
                                    width="50"
                                    height="10"
                                    fill="white"
                                    fillOpacity="0.01"
                                />
                                <text className="ToolsArrowsChart__label" fill={color}>
                                    {toolName}
                                </text>
                            </g> */}
                            {points.map(([x, y, year], i) => {
                                const isFirstLabelToTheRight =
                                    scales.x(x) > dms.width * 0.9 ||
                                    labelsToTheRight.indexOf(tool) !== -1

                                // const showLabel = i === 0 || i === points.length - 1
                                const showLabel = true

                                return (
                                    <Fragment key={i}>
                                        {showLabel && (
                                            <text
                                                className="ToolsArrowsChart__year"
                                                x={
                                                    scales.x(x) +
                                                    10 * (isFirstLabelToTheRight ? -1 : 1)
                                                }
                                                y={scales.y(y) + 5}
                                                style={{
                                                    textAnchor: isFirstLabelToTheRight
                                                        ? 'end'
                                                        : 'start',
                                                }}
                                            >
                                                {year}
                                            </text>
                                        )}
                                        <circle
                                            className="ToolsArrowsChart__year"
                                            cx={scales.x(x)}
                                            cy={scales.y(y)}
                                            r="4"
                                            fill="white"
                                        />
                                    </Fragment>
                                )
                            })}
                        </g>
                    )
                })}
            </svg>
        </div>
    )
}

ToolsArrowsChart.propTypes = {
    // ...
}

export default ToolsArrowsChart

// each response has an associated value for the [x, y] axes
const conditionDiffs = {
    never_heard: [0, -1],
    not_interested: [-1, -1],
    interested: [1, -1],
    would_not_use: [-1, 1],
    would_use: [1, 1],
}

/*
function useWindowWidth() {
    const [windowWidth, setWindowWidth] = useState(
        (typeof window !== 'undefined' && window.innerWidth) || 1000
    )

    function handleResize() {
        setWindowWidth((typeof window !== 'undefined' && window.innerWidth) || 1000)
    }

    useEffect(() => {
        if (typeof window === 'undefined') return
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return windowWidth
}
*/

function useWindowHeight() {
    const [windowHeight, setWindowHeight] = useState(
        (typeof window !== 'undefined' && window.innerHeight) || 1000
    )

    function handleResize() {
        setWindowHeight((typeof window !== 'undefined' && window.innerHeight) || 1000)
    }

    useEffect(() => {
        if (typeof window === 'undefined') return
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return windowHeight
}

const labelsToTheRight = [
    'mobx',
    'relay',
    'nuxt',
    'svelte',
    'ava',
    'electron',
    'nextjs',
    'vuejs',
    'cypress',
]
