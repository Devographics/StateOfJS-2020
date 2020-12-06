import { DefaultTheme } from 'styled-components'
import colors from './colors'
import dimensions from './dimensions'
import typography from './typography'
import charts from './charts'

const cssTheme: DefaultTheme = {
    dimensions,
    typography,
    colors,
    charts,
    separationBorder: `1px dashed ${colors.border}`,
    blockShadow: `0px 16px 24px rgba(0, 0, 0, 0.4), 0px 2px 6px rgba(0, 0, 0, 0.3)`,
}

export default cssTheme
