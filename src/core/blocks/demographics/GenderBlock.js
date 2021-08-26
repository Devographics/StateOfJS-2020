import React, { memo, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from 'styled-components'
import { keys } from 'core/bucket_keys'
import Block from 'core/blocks/block/Block'
import GaugeBarChart from 'core/charts/generic/GaugeBarChart'
import ChartContainer from 'core/charts/ChartContainer'
import { useI18n } from 'core/i18n/i18nContext'

const GenderBlock = ({ block, data }) => {
    const { units: defaultUnits = 'percentage' } = block
    const [units, setUnits] = useState(defaultUnits)
    const [view, setView] = useState('viz')
    const theme = useTheme()

    const colorMapping = useMemo(
        () =>
            keys.gender.keys.map((item) => ({
                ...item,
                color: theme.colors.ranges.gender[item.id],
            })),
        [theme]
    )

    const { translate } = useI18n()

    return (
        <Block 
          view={view}
          setView={setView}
          units={units}
          setUnits={setUnits}
          data={data.buckets}
          block={block}
          labelledData={data.buckets.map((bucket) => {
            bucket.label = translate(keys.gender.keys.find((key) => key.id === bucket.id).label);
            return bucket;
          })}
        >
            <ChartContainer height={200} fit={true}>
                <GaugeBarChart
                    units={units}
                    buckets={data.buckets}
                    colorMapping={colorMapping}
                    i18nNamespace="options.gender"
                />
            </ChartContainer>
        </Block>
    )
}

GenderBlock.propTypes = {
    block: PropTypes.shape({
        id: PropTypes.string.isRequired,
    }).isRequired,
    data: PropTypes.shape({
        buckets: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
            })
        ).isRequired,
    }).isRequired,
}

export default memo(GenderBlock)
