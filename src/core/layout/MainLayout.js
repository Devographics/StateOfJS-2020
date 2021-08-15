import React from 'react'
import styled, { css } from 'styled-components'
import Pagination from 'core/pages/Pagination'
import { Sidebar } from 'core/components/sidebar'
import { mq, spacing } from 'core/theme'
import classNames from 'classnames'
import Hamburger from 'core/components/Hamburger'

const MainLayout = ({
    context,
    showPagination,
    showSidebar,
    toggleSidebar,
    closeSidebar,
    props,
}) => {
    return (
        <>
            <Skip href="#page-main">Skip to content</Skip>
            <Page
                showSidebar={showSidebar}
                className={classNames(`Page--${context.id}`, {
                    capture: context.isCapturing,
                    nocapture: !context.isCapturing,
                })}
            >
                <div>
                  <MenuToggle 
                    onClick={toggleSidebar} 
                    aria-label="Open Menu"
                    aria-haspopup="sidebar"
                    aria-controls="sidebar"
                    aria-expanded={showSidebar}
                  >
                    <Hamburger />
                  </MenuToggle>
                  <Sidebar {...props} showSidebar={showSidebar} closeSidebar={closeSidebar} />
                </div>
                <PageContent className="PageContent">
                    <PaginationWrapper>
                        {showPagination && <Pagination position="top" />}   
                    </PaginationWrapper>
                    <PageMain id="page-main">
                        {/* <PageMetaDebug /> */}
                        {props.children}
                    </PageMain>
                </PageContent>
            </Page>
        </>
    )
}

const Skip = styled.a`
    display: block;
    padding: 1rem 1rem;

    position: absolute;
    top: -900px;
    left: -900px;

    &:focus {
      display: inline-block;
      position: static !important;
      top: 0 !important;
      left: 0 !important;
      border: 2px solid white;
    }
`;

const PaginationWrapper = styled.div`
    @media ${mq.smallMedium} {
        padding-left: 5rem;
        border-bottom: ${({theme}) => theme.separationBorder};
    }
`;

const MenuToggle = styled.button`
    display: block;
    background-color: transparent;
    outline: none;
    border: none;

    position: absolute;
    top: 0;
    left: 0;

    cursor: pointer;

    padding: 0.825rem 1rem 0.5rem 1rem;

    width: 5rem;
    height: 3.72rem;

    box-sizing: border-box;

    svg {
      width: 2rem;
      height: auto;
    }

    @media ${mq.large} {
      display: none;
    }

    &:focus {
      border: 2px solid white;
      outline: 5px auto -webkit-focus-ring-color;;
    }

    &:hover {
      background-color: rgba(255,255,255,0.075);
    }
`;

const PageContent = styled.div`
    display: flex;
    flex-direction: column;
`

const Page = styled.div`
    @media ${mq.large} {
      display: grid;
      grid-template-columns: ${({ theme }) => theme.dimensions.sidebar.width}px calc(100% - ${({ theme }) => theme.dimensions.sidebar.width}px);  
    }

    @media ${mq.smallMedium} {
      grid-template-columns: 5rem auto;
    }

    min-height: 100vh;
    position: relative;
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
