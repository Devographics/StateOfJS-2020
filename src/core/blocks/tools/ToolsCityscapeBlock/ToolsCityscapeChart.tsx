import React from 'react'
import styled, { css } from 'styled-components'
import { layerCount, ToolsCityscapeToolData } from './ToolsCityscapeBlock'
// @ts-ignore
import { spacing, mq, fontSize } from 'core/theme'
import random from 'lodash/random'
// import { SectionItem } from './SectionItem'

export interface ToolsCityscapeLayerData {
    layer: number
    items: ToolsCityscapeToolData[]
}

export const ToolsCityscapeChart = ({ data }: { data: ToolsCityscapeLayerData[] }) => {
    return (
        <Container>
            {data.map((layer) => (
                <ToolLayer {...layer} key={layer.layer} />
            ))}
        </Container>
    )
}

const ToolLayer = ({ layer, items }: ToolsCityscapeLayerData) => (
    <ToolGroup layer={layer}>
        {items.map((tool, i) => (
            <ToolItem tool={tool} x={i} key={tool.id} />
        ))}
    </ToolGroup>
)

const ToolItem = ({ tool, x }: { tool: ToolsCityscapeToolData; x: number }) => (
    <ToolBar {...tool} x={x}>
        <ToolLabel>{tool.entity.name}</ToolLabel>
    </ToolBar>
)

const Container = styled.div`
    position: relative;
    height: 600px;
    border-bottom: 5px solid #ffffff33;
    padding: 0 60px;
`

const ToolGroup = styled.div`
    position: absolute;
    bottom: 0;
    width: 100%;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    overflow: hidden;
`

const ToolBar = styled.div`
    ${({ x, layer = 0, color, usage }: ToolsCityscapeToolData) => css`
        /* position: absolute; */
        /* left: ${random(0, 10) + x * 70}px; */
        /* bottom: 0px; */
        margin-right: 15px;
        z-index: ${layerCount - layer};
        height: ${Math.round(usage / 50)}px;
        width: ${40 + random(0, 20)}px;
        transform: translateX(${10 - random(0, 20)}px);
        background: linear-gradient(${color}, ${color}33);
    `}
    box-shadow: 3px 3px 2px rgba(0,0,0,0.4);
    overflow: hidden;
`

const ToolLabel = styled.div`
    transform: translateY(30px) rotateZ(90deg);
    text-align: right;
    font-size: ${fontSize('small')};
    text-shadow: 1px 1px 2px #000000aa;
    font-weight: bold;
    /* background: #00000066;
    padding: 5px; */
`
