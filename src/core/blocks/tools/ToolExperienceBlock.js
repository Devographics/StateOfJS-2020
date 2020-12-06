import React, { useState } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import Block from 'core/blocks/block/Block'
import ChartContainer from 'core/charts/ChartContainer'
import { useBucketKeys } from 'core/helpers/useBucketKeys'
import GaugeBarChart from 'core/charts/generic/GaugeBarChart'
import { usePageContext } from 'core/helpers/pageContext'
import styled from 'styled-components'
import { spacing } from 'core/theme'

const ToolExperienceBlock = ({ block, data, units: defaultUnits = 'percentage' }) => {
    const context = usePageContext()
    const { locale } = context

    const [units, setUnits] = useState(defaultUnits)

    const title = get(data, 'entity.name')
    const titleLink = get(data, 'entity.homepage')
    const description = locale.id === 'en-US' && get(data, 'entity.description')

    const allYears = get(data, 'experience.all_years')

    const bucketKeys = useBucketKeys('tools')

    if (!allYears || isEmpty(allYears)) {
        return <div>no data</div>
    }

    const isLastYear = (year) =>
        allYears.findIndex((y) => y.year === year.year) === allYears.length - 1

    return (
        <Block
            units={units}
            setUnits={setUnits}
            block={{ ...block, title, titleLink, description, showDescription: !!description }}
            data={allYears}
        >
            {allYears.map((year) => (
                <Row key={year.year}>
                    <RowYear>{year.year}</RowYear>
                    <ChartContainer height={40} fit={true} className="ToolChart">
                        <GaugeBarChart
                            buckets={year.buckets}
                            colorMapping={bucketKeys}
                            units={units}
                            applyEmptyPatternTo="never_heard"
                            i18nNamespace="options.tools"
                            showProgression={isLastYear(year)}
                        />
                    </ChartContainer>
                </Row>
            ))}
        </Block>
    )
}

const Row = styled.div`
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: ${spacing()};
    align-items: center;
    margin-bottom: ${spacing()};
`

const RowYear = styled.h4`
    margin: 0;
`

ToolExperienceBlock.propTypes = {
    block: PropTypes.shape({
        id: PropTypes.string.isRequired,
        dataPath: PropTypes.string.isRequired,
    }).isRequired,
}

export default ToolExperienceBlock
