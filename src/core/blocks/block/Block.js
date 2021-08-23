import React, { memo } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { mq, spacing } from 'core/theme'
import BlockTitleOriginal from 'core/blocks/block/BlockTitle'
import BlockNote from 'core/blocks/block/BlockNote'
import ShareBlockDebug from 'core/share/ShareBlockDebug'
import BlockLegends from 'core/blocks/block/BlockLegends'
import T from 'core/i18n/T'

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
    const {
        id,
        showLegend,
        legendPosition = 'bottom',
        showTitle = true,
        showNote = true,
        overrides = {},
    } = block

    const BlockTitle = overrides.BlockTitle || BlockTitleOriginal

    return (
        <Container
            id={id}
            className={`Block Block--${id}${className !== undefined ? ` ${className}` : ''}`}
        >
            {showTitle && (
                <BlockTitle
                    isShareable={isShareable}
                    units={units}
                    setUnits={setUnits}
                    data={data}
                    block={block}
                    {...titleProps}
                />
            )}
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
            {showNote && <BlockNote block={block} />}
            {blockFooter}
            <button>Table</button> <button>Graph</button>
            <p>{data?.year}. {data?.completion?.percentage}% answered ({data?.completion?.count})</p>
            <DataTable>
              <thead>
                <tr>
                  <th>Label</th>
                  <th>Count</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {data?.buckets?.sort((a, b) => b?.percentage - a?.percentage).map((bucket) => bucket && <tr>
                  <td>{bucket.id && <T k={bucket?.id} />}</td>
                  <td>{bucket?.count}</td>
                  <td>{bucket?.percentage}%</td>
                </tr>)}
              </tbody>
            </DataTable>
        </Container>
    )
}

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    text-align: left;
  }

  td, th {
    padding: 0.75rem 0.45rem;
    border: 1px solid white;
    margin: 0;
  }
`;

Block.propTypes = {
    block: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.node,
        description: PropTypes.node,
    }).isRequired,
    isShareable: PropTypes.bool.isRequired,
    className: PropTypes.string,
    values: PropTypes.object,
}
Block.defaultProps = {
    showDescription: true,
    isShareable: true,
}

export default memo(Block)
