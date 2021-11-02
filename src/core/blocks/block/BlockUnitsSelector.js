import React, { memo } from 'react'
import PropTypes from 'prop-types'
import ButtonGroup from 'core/components/ButtonGroup'
import Button from 'core/components/Button'
import T from 'core/i18n/T'

const BlockUnitsSelector = ({ units, onChange }) => {
    return (
        <ButtonGroup>
            <Button
                size="small"
                className={`Button--${units === 'percentage' ? 'selected' : 'unselected'}`}
                onClick={() => onChange('percentage')}
                aria-pressed={units === 'percentage'}
            >
                <T k="chart_units.percentage" />
            </Button>
            <Button
                size="small"
                className={`Button--${units === 'count' ? 'selected' : 'unselected'}`}
                onClick={() => onChange('count')}
                aria-pressed={units === 'count'}
            >
                <T k="chart_units.count" />
            </Button>
        </ButtonGroup>
    )
}

BlockUnitsSelector.propTypes = {
    units: PropTypes.oneOf(['percentage', 'count']).isRequired,
    onChange: PropTypes.func.isRequired,
}

export default memo(BlockUnitsSelector)
