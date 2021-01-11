import { DefaultTheme } from 'styled-components'
import colors from './colors'
import dimensions from './dimensions'
import typography from './typography'
import charts from './charts'
import zIndexes from './zIndexes'

export const testTheme: DefaultTheme = {
    dimensions,
    typography,
    colors,
    charts,
    zIndexes,
    separationBorder: `1px dashed ${colors.border}`,
    blockShadow: `0px 12px 16px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.05)`,
}
