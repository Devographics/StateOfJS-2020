import React, { Fragment, useMemo, memo } from 'react'
import styled, { css } from 'styled-components'
// @ts-ignore
import { format } from 'd3-format'
import { ToolsCardinalityByUserBucket } from 'core/survey_api/tools'
// @ts-ignore
import { fontSize, fontWeight, spacing, mq } from 'core/theme'
// @ts-ignore
import { useI18n } from 'core/i18n/i18nContext'
import range from 'lodash/range'

export const SectionItem = memo(
    ({
        sectionId,
        data,
        units,
    }: {
        sectionId: string
        data: ToolsCardinalityByUserBucket[]
        units: 'percentage' | 'count'
    }) => {
        const { translate } = useI18n()
        const getValue = useMemo(() => {
            const formatter = units === 'count' ? format('>-.2s') : format('>-.1f')

            return (bucket: ToolsCardinalityByUserBucket) => {
                return units === 'count'
                    ? formatter(bucket.count)
                    : `${formatter(bucket.percentage)}%`
            }
        }, [units])

        return (
            <SectionContainer>
                <Grid>
                    {range(1, 11).map((i) => {
                        const bucket = data.find((b) => b.cardinality === i)
                        return bucket ? (
                            <Row key={bucket.cardinality}>
                                <Metric>x{bucket.cardinality}</Metric>
                                <Bar>
                                    <InnerBar
                                        style={{
                                            width: `${bucket.percentage}%`,
                                        }}
                                    />
                                </Bar>
                                <Metric>{getValue(bucket)}</Metric>
                            </Row>
                        ) : (
                            <Row isPlaceholder={true} key={i}>
                                <div />
                                <Bar isPlaceholder={true} />
                                <div />
                            </Row>
                        )
                    })}
                </Grid>
                <SectionTitle>{translate(`sections.${sectionId}.title`)}</SectionTitle>
            </SectionContainer>
        )
    }
)

const SectionTitle = styled.div`
    width: 100%;
    text-align: center;
    font-size: ${fontSize('small')};
    font-weight: ${fontWeight('bold')};
    margin-bottom: ${spacing(0.5)};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: ${spacing(0.25)};
`

const Grid = styled.div`
    display: flex;
    flex-direction: column-reverse;
`

const Row = styled.div`
    display: grid;
    grid-template-columns: 36px auto 36px;
    column-gap: 6px;
    align-items: center;
    margin-bottom: 3px;
`

const Bar = styled.div`
    display: flex;
    background: ${(props) => props.theme.colors.backgroundAlt};
    justify-content: center;
    height: 18px;
`

const InnerBar = styled.div`
    /* background-color: ${(props) => props.theme.colors.ranges.tools.would_use}; */
    background-color: ${(props) => props.theme.colors.barChart.primary};
    height: 100%;
`

const Metric = styled.span`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: ${fontSize('smaller')};
`

const SectionContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    ${Bar}, ${Metric} {
        height: 16px;

        @media ${mq.small} {
            height: 14px;
            font-size: ${fontSize('smaller')};
        }
    }
`
