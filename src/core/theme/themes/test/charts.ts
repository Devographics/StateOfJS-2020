import { DefaultTheme } from 'styled-components'
import defaultsDeep from 'lodash/defaultsDeep'
import charts from '../../charts'
import colors from './colors'

const testThemeCharts: DefaultTheme['charts'] = defaultsDeep(
    {
        axis: {
            ticks: {
                line: {
                    fill: colors.text,
                },
                text: {
                    fill: colors.text,
                },
            },
            legend: {
                text: {
                    fill: colors.text,
                },
            },
        },
        streamTimelineAxis: {
            ticks: {
                line: {
                    stroke: colors.text,
                },
                text: {
                    fill: colors.text,
                },
            },
        },
        grid: {
            line: {
                stroke: '#6e778d',
            },
        },
        legends: {
            text: {
                fill: colors.text,
            },
        },
        labels: {
            text: {
                fill: '#ffffff',
            },
        },
    },
    charts
)

export default testThemeCharts
