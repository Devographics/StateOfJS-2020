import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Block from 'core/blocks/block/Block'
import ChartContainer from 'core/charts/ChartContainer'
import StreamChart from 'core/charts/generic/StreamChart'
import { useBucketKeys } from 'core/helpers/useBucketKeys'

const OpinionBlock = ({ block, data, units: defaultUnits = 'percentage' }) => {
    const { id, bucketKeysName = id } = block
    const [units, setUnits] = useState(defaultUnits)
    const [current, setCurrent] = useState(null)
    const bucketKeys = useBucketKeys('opinions')

    return (
        <Block
            units={units}
            setUnits={setUnits}
            block={{
                ...block,
                showLegend: true,
                bucketKeysName: 'opinions',
            }}
            data={data}
            legendProps={{
                onMouseEnter: ({ id }) => {
                    setCurrent(id)
                },
                onMouseLeave: () => {
                    setCurrent(null)
                },
            }}
        >
            <ChartContainer height={300} fit={true}>
                <StreamChart
                    colorScale={bucketKeys.map((k) => k.color)}
                    current={current}
                    // for opinions only having one year of data, we duplicate the year's data
                    // to be able to use the stream chart.
                    data={data.length === 1 ? [data[0], data[0]] : data}
                    bucketKeys={bucketKeys}
                    keys={bucketKeys.map((key) => key.id)}
                    units={units}
                    applyEmptyPatternTo={2}
                    namespace={bucketKeysName}
                />
            </ChartContainer>
        </Block>
    )
}

OpinionBlock.propTypes = {
    block: PropTypes.shape({
        id: PropTypes.string.isRequired,
        dataPath: PropTypes.string.isRequired,
    }).isRequired,
    // data: PropTypes.shape({
    //     buckets: PropTypes.arrayOf(
    //         PropTypes.shape({
    //             id: PropTypes.string.isRequired,
    //             opinion: PropTypes.shape({
    //                 total: PropTypes.number.isRequired,
    //                 buckets: PropTypes.arrayOf(
    //                     PropTypes.shape({
    //                         id: PropTypes.string.isRequired,
    //                         count: PropTypes.number.isRequired,
    //                         percentage: PropTypes.number.isRequired
    //                     })
    //                 ).isRequired
    //             })
    //         })
    //     )
    // }).isRequired
}

export default OpinionBlock
