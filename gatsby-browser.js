import React from 'react'
import * as ReactGA from 'react-ga'
import LayoutWrapper from 'core/layout/LayoutWrapper'
import { gaUAid } from 'config/config.yml'

ReactGA.initialize(gaUAid)

export const onRouteUpdate = ({ location }) => {
    ReactGA.pageview(location.pathname)
}

export const wrapPageElement = ({ element, props }) => {
    const { pageContext, ...rest } = props

    return (
        <LayoutWrapper {...rest} pageContext={pageContext}>
            {element}
        </LayoutWrapper>
    )
}
