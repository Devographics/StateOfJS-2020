import React from 'react'
import * as ReactGA from 'react-ga'
import LayoutWrapper from 'core/layout/LayoutWrapper'

ReactGA.initialize('UA-83022212-8')

// eslint-disable-next-line no-unused-vars
const ascii = `STATE OF JS`

export const onClientEntry = () => {
    // console.log(ascii)
}

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
