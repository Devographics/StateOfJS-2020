import React, { useState } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import styled from 'styled-components'
import Block from 'core/blocks/block/Block'
import ChartContainer from 'core/charts/ChartContainer'
import GaugeBarChart from 'core/charts/generic/GaugeBarChart'
import { usePageContext } from 'core/helpers/pageContext'
import { useBucketKeys } from 'core/helpers/useBucketKeys'
import { spacing } from 'core/theme'

// convert relative links into absolute MDN links
const parseMDNLinks = (content) =>
    content.replace(new RegExp(`href="/`, 'g'), `href="https://developer.mozilla.org/`)

const FeatureExperienceBlock = ({ block, data, units: defaultUnits = 'percentage' }) => {
    const [units, setUnits] = useState(defaultUnits)
    const [view, setView] = useState('viz')

    const context = usePageContext()
    const { locale } = context
    const { name, mdn } = data

    const allYears = get(data, 'experience.all_years', [])

    const bucketKeys = useBucketKeys('features')

    const mdnLink = mdn && `https://developer.mozilla.org${mdn.url}`
    // only show descriptions for english version
    const description = locale.id === 'en-US' && mdn && parseMDNLinks(mdn.summary)

    const isLastYear = (year) =>
        allYears.findIndex((y) => y.year === year.year) === allYears.length - 1
  
    let headings = [{id: 'label', label: 'Year', value: 'year'}];
    headings = headings.concat(bucketKeys.map((key) => {
      key.value = key.id;
      return key;
    }));

    const generateRows = (data) => {
      const rows = [];
      data.forEach(row => {
        const newRow = [];
        newRow.push({id: 'label', label: row.year});
        row.buckets.forEach(bucket => newRow.push({id: bucket.id, label: `${bucket.percentage}% (${bucket.count})`}));
        rows.push(newRow);
      });
      return rows;
    }

    const tables = [{
      headings: headings,
      rows: generateRows(allYears),
    }];


    return (
        <Block
            tables={tables}
            headings={headings}
            view={view}
            setView={setView}
            title={name}
            units={units}
            setUnits={setUnits}
            data={allYears}
            block={{ ...block, title: name, titleLink: mdnLink, description, enableDescriptionMarkdown: false }}
        >
            {allYears.map((year) => (
                <Row key={year.year}>
                    <RowYear>{year.year}</RowYear>
                    <ChartContainer
                        height={isLastYear(year) ? 40 : 40}
                        fit={true}
                        className="FeatureChart"
                    >
                        <GaugeBarChart
                            buckets={year.buckets}
                            colorMapping={bucketKeys}
                            units={units}
                            applyEmptyPatternTo="never_heard"
                            i18nNamespace="options.features"
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

FeatureExperienceBlock.propTypes = {
    block: PropTypes.shape({
        id: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired,
    }).isRequired,
    data: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        experience: PropTypes.shape({
            all_years: PropTypes.arrayOf(
                PropTypes.shape({
                    year: PropTypes.number.isRequired,
                    completion: PropTypes.shape({
                        count: PropTypes.number.isRequired,
                        percentage: PropTypes.number.isRequired,
                    }).isRequired,
                    buckets: PropTypes.arrayOf(
                        PropTypes.shape({
                            id: PropTypes.string.isRequired,
                            usage: PropTypes.shape({
                                total: PropTypes.number.isRequired,
                                buckets: PropTypes.arrayOf(
                                    PropTypes.shape({
                                        id: PropTypes.string.isRequired,
                                        count: PropTypes.number.isRequired,
                                        percentage: PropTypes.number.isRequired,
                                    })
                                ).isRequired,
                            }),
                        })
                    ).isRequired,
                })
            ).isRequired,
        }).isRequired,
    }).isRequired,
}

export default FeatureExperienceBlock
