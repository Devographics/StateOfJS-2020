import React from 'react'
import styled, { css } from 'styled-components'
import Pagination from 'core/pages/Pagination'
import { Sidebar } from 'core/components/sidebar'
import { mq, spacing } from 'core/theme'
import classNames from 'classnames'

const MainLayout = ({
    context,
    showPagination,
    showSidebar,
    toggleSidebar,
    closeSidebar,
    props,
}) => {
    return (
        <Page
            showSidebar={showSidebar}
            className={classNames(`Page--${context.id}`, {
                capture: context.isCapturing,
                nocapture: !context.isCapturing,
            })}
        >
            <Sidebar {...props} showSidebar={showSidebar} closeSidebar={closeSidebar} />
            <PageContent className="PageContent">
                {showPagination && <Pagination toggleSidebar={toggleSidebar} position="top" />}
                <PageMain>
                    {/* <PageMetaDebug /> */}
                    {props.children}
                </PageMain>
            </PageContent>
        </Page>
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

export default MainLayout
