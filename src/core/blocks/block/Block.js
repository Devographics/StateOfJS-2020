import React, { memo } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { mq, spacing } from 'core/theme'
import BlockTitle from 'core/blocks/block/BlockTitle'
import BlockNote from 'core/blocks/block/BlockNote'
import ShareBlockDebug from 'core/share/ShareBlockDebug'
import BlockLegends from 'core/blocks/block/BlockLegends'

const Container = styled.div`
    @media ${mq.small} {
        margin-bottom: ${spacing(2)};
    }

    @media ${mq.mediumLarge} {
        margin-bottom: ${spacing(4)};
    }

    &:last-child {
        margin-bottom: 0;
    }
`

const Block = ({
    isShareable,
    className,
    children,
    units,
    setUnits,
    error,
    data,
    block = {},
    legendProps,
    titleProps,
    blockFooter = null,
}) => {
    const { id, showLegend, legendPosition = 'bottom' } = block

    return (
        <Container
            id={id}
            className={`Block Block--${id}${className !== undefined ? ` ${className}` : ''}`}
        >
            <BlockTitle
                isShareable={isShareable}
                units={units}
                setUnits={setUnits}
                data={data}
                block={block}
                {...titleProps}
            />
            {isShareable && <ShareBlockDebug block={block} />}
            {showLegend && legendPosition === 'top' && (
                <BlockLegends
                    block={block}
                    data={data}
                    units={units}
                    position={legendPosition}
                    {...legendProps}
                />
            )}
            <div className="Block__Contents">
                {error ? <div className="error">{error}</div> : children}
            </div>
            {showLegend && legendPosition === 'bottom' && (
                <BlockLegends
                    block={block}
                    data={data}
                    units={units}
                    position={legendPosition}
                    {...legendProps}
                />
            )}
            <BlockNote block={block} />
            {blockFooter}
        </Container>
    )
}

Block.propTypes = {
    block: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.node,
        description: PropTypes.node,
    }).isRequired,
    showDescription: PropTypes.bool.isRequired,
    isShareable: PropTypes.bool.isRequired,
    className: PropTypes.string,
    values: PropTypes.object,
}
Block.defaultProps = {
    showDescription: true,
    isShareable: true,
}

export default memo(Block)
