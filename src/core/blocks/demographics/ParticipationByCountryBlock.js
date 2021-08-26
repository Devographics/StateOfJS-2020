import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import Block from 'core/blocks/block/Block'
import ChartContainer from 'core/charts/ChartContainer'
import ParticipationByCountryChart from 'core/charts/demographics/ParticipationByCountryChart'
import countries from 'data/geo/world_countries'

const ParticipationByCountryBlock = ({
    block,
    data,
    triggerId,
    units: defaultUnits = 'percentage',
}) => {
    const [units, setUnits] = useState(defaultUnits)
    const [view, setView] = useState('viz')

    const chartClassName = triggerId ? `ParticipationByCountryChart--${triggerId}` : ''

    const { height = 500 } = block

    const labelledData = data?.buckets?.map((row) => {
      row.label = countries.features.find((country) => country.id === row.id)?.properties.name;
      return row;
    });

    return (
        <Block labelledData={labelledData} view={view} setView={setView} units={units} setUnits={setUnits} data={data} block={block}>
            <ChartContainer height={600}>
                <div
                    style={{ height: '100%' }}
                    className={`ParticipationByCountryChart ${chartClassName}`}
                >
                    <ParticipationByCountryChart units={units} data={data.buckets} />
                </div>
            </ChartContainer>
        </Block>
    )
}

ParticipationByCountryBlock.propTypes = {
    block: PropTypes.shape({
        id: PropTypes.string.isRequired,
    }).isRequired,
    data: PropTypes.shape({
        completion: PropTypes.shape({
            count: PropTypes.number.isRequired,
            percentage: PropTypes.number.isRequired,
        }).isRequired,
        buckets: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                count: PropTypes.number.isRequired,
                percentage: PropTypes.number.isRequired,
            })
        ).isRequired,
    }).isRequired,
}

export default memo(ParticipationByCountryBlock)
