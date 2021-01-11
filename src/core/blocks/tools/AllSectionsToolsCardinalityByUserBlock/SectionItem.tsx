import React, { Fragment, useMemo, memo } from 'react'
import styled from 'styled-components'
// @ts-ignore
import { format } from 'd3-format'
import { ToolsCardinalityByUserBucket } from 'core/survey_api/tools'
// @ts-ignore
import { fontSize, fontWeight, spacing, mq } from 'core/theme'
// @ts-ignore
import { useI18n } from 'core/i18n/i18nContext'

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
                <SectionTitle>{translate(`sections.${sectionId}.title`)}</SectionTitle>
                <Grid>
                    {data.map((bucket) => (
                        <Fragment key={bucket.cardinality}>
                            <Metric>x{bucket.cardinality}</Metric>
                            <Bar>
                                <InnerBar
                                    style={{
                                        width: `${bucket.percentage}%`,
                                    }}
                                />
                            </Bar>
                            <Metric>{getValue(bucket)}</Metric>
                        </Fragment>
                    ))}
                </Grid>
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
`

const Grid = styled.div`
    display: grid;
    grid-template-columns: 36px auto 36px;
    column-gap: 6px;
    row-gap: 3px;
    align-items: center;
`

const Bar = styled.div`
    display: flex;
    background: ${(props) => props.theme.colors.backgroundBackground};
    justify-content: center;
    height: 18px;
`

const InnerBar = styled.div`
    background-color: ${(props) => props.theme.colors.ranges.tools.would_use};
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
