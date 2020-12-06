import React, { PureComponent, useCallback, useEffect, useState } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import styled, { ThemeProvider, css } from 'styled-components'
import '../stylesheets/screen.scss'
import Pagination from './pages/Pagination'
import { Sidebar } from './components/sidebar'
import Head from './components/Head'
import { PageContextProvider } from './helpers/pageContext'
import { KeydownContextProvider } from './helpers/keydownContext'
import { mergePageContext } from './helpers/pageHelpers'
import { I18nContextProvider } from './i18n/i18nContext'
import { EntitiesContextProvider } from './entities/entitiesContext'
// import PageMetaDebug from './pages/PageMetaDebug'
import themes from './theme/themes'
import { GlobalStyle, mq, spacing } from './theme'

const themeIds = ['js', 'css', 'test']

const ThemedLayout = ({
    context,
    showPagination,
    showSidebar,
    toggleSidebar,
    closeSidebar,
    props,
}) => {
    const [themeId, setThemeId] = useState('css')

    const switchTheme = useCallback(
        (event) => {
            if (event.code === 'KeyX') {
                setThemeId((current) => {
                    const currentIndex = themeIds.findIndex((id) => id === current)
                    if (currentIndex < themeIds.length - 1) {
                        return themeIds[currentIndex + 1]
                    }

                    return themeIds[0]
                })
            }
        },
        [setThemeId]
    )

    useEffect(() => {
        document.addEventListener('keypress', switchTheme)

        return () => {
            document.removeEventListener('keypress', switchTheme)
        }
    }, [switchTheme])

    return (
        <ThemeProvider theme={themes[themeId]}>
            <EntitiesContextProvider>
                <GlobalStyle />
                <Head />
                <Page
                    showSidebar={showSidebar}
                    className={classNames(`Page--${context.id}`, {
                        capture: context.isCapturing,
                        nocapture: !context.isCapturing,
                    })}
                >
                    <Sidebar {...props} showSidebar={showSidebar} closeSidebar={closeSidebar} />
                    <PageContent>
                        {showPagination && (
                            <Pagination toggleSidebar={toggleSidebar} position="top" />
                        )}
                        <PageMain>
                            {/* <PageMetaDebug /> */}
                            {props.children}
                        </PageMain>
                    </PageContent>
                </Page>
            </EntitiesContextProvider>
        </ThemeProvider>
    )
}

const PageContent = styled.main`
    display: flex;
    flex-direction: column;
`

const Page = styled.div`
    min-height: 100vh;

    ${PageContent} {
        @media ${mq.large} {
            margin-left: ${({ theme }) => theme.dimensions.sidebar.width}px;
        }

        @media ${mq.smallMedium} {
            ${(props) => {
                if (props.showSidebar) {
                    return css`
                        overflow: hidden;
                        height: 100vh;
                    `
                }
            }}
        }
    }
`

const PageMain = styled.main`
    flex-grow: 1;
    overflow-x: hidden;
    overflow-y: visible;

    @media ${mq.smallMedium} {
        padding: ${spacing()};
    }

    @media ${mq.large} {
        padding: ${spacing(3)};
    }
`

export default class Layout extends PureComponent {
    static propTypes = {
        showPagination: propTypes.bool.isRequired,
    }

    static defaultProps = {
        showPagination: true,
    }

    constructor() {
        super()
        this.state = {
            showSidebar: false,
        }
    }

    componentDidMount() {
        this.updateWindowDimensions()
        window.addEventListener('resize', this.updateWindowDimensions)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions)
    }

    updateWindowDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight })
    }

    toggleSidebar = () => {
        this.setState({
            showSidebar: !this.state.showSidebar,
        })
    }

    closeSidebar = () => {
        this.setState({
            showSidebar: false,
        })
    }

    render() {
        const { showPagination, location, pageContext } = this.props
        const { showSidebar } = this.state
        const context = mergePageContext(pageContext, location, this.state)
        return (
            <KeydownContextProvider>
                <PageContextProvider value={context}>
                    <I18nContextProvider>
                        <ThemedLayout
                            context={context}
                            showPagination={showPagination}
                            showSidebar={showSidebar}
                            toggleSidebar={this.toggleSidebar}
                            closeSidebar={this.closeSidebar}
                            props={this.props}
                        />
                    </I18nContextProvider>
                </PageContextProvider>
            </KeydownContextProvider>
        )
    }
}
