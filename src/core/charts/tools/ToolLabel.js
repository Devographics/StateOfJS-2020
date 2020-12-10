// @ts-ignore
import React, { useState } from 'react'
import { useTheme } from 'styled-components'
import { useEntities } from 'core/entities/entitiesContext'
import styled from 'styled-components'
import { mq, spacing, fontSize, color } from 'core/theme'
import Button from 'core/components/Button'
import Modal from 'react-modal'
import ToolExperienceBlock from 'core/blocks/tools/ToolExperienceBlock'
import { usePageContext } from 'core/helpers/pageContext'
import get from 'lodash/get'

const ToolLabel = ({ id }) => {
    const theme = useTheme()
    const { getEntity } = useEntities()
    const [modalIsOpen, setIsOpen] = useState(false)
    const pageContext = usePageContext()

    const { name, homepage } = getEntity(id)

    const block = pageContext.blocks.find((block) => block.id === id)
    const blockData = get(pageContext.pageData, block.dataPath)

    const customStyles = {
        overlay: {
            backgroundColor: `${theme.colors.backgroundInverted}bb`,
        },
        content: {
            borderWidth: 0,
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: 0,
        },
    }

    const closeModal = () => {
        setIsOpen(false)
    }

    // const text = (
    //     <text
    //         style={{
    //             fill: homepage ? theme.colors.link : theme.colors.text,
    //             fontFamily: theme.typography.fontFamily,
    //             fontSize: 14,
    //         }}
    //         dominantBaseline="central"
    //     >
    //         {id}
    //     </text>
    // )

    return (
        <>
            <span className="ToolLabel">
                <LabelLink
                    as="a"
                    href={homepage}
                    onClick={(e) => {
                        e.preventDefault()
                        setIsOpen(true)
                    }}
                >
                    {name}
                </LabelLink>
            </span>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <Content>
                    <h2>{name}</h2>
                    <ToolExperienceBlock block={block} data={blockData} />
                </Content>
            </Modal>
        </>
    )
}

const LabelLink = styled(Button)`
    padding: 4px 12px;
    border-radius: 500px;
    display: inline-block;
    font-size: ${fontSize('smaller')};
`

const Content = styled.div`
    padding: ${spacing()};
    background: ${({ theme }) => theme.colors.background};
`

export default ToolLabel
