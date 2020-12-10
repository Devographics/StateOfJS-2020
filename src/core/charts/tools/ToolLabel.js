import React, { useState } from 'react'
import { useTheme } from 'styled-components'
import { useEntities } from 'core/entities/entitiesContext'
import styled from 'styled-components'
import { mq, spacing, fontSize } from 'core/theme'
import Button from 'core/components/Button'
import Modal from 'react-modal'
import { ToolExperienceBlock } from 'core/blocks/tools/ToolExperienceBlock'
import { usePageContext } from 'core/helpers/pageContext'
import get from 'lodash/get'

const ToolLabel = ({ id }) => {
    const theme = useTheme()
    const { getEntity } = useEntities()
    const [modalIsOpen, setIsOpen] = useState(false)

    const { name, homepage } = getEntity(id)

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
            width: 'calc(100% - 40px)',
            maxWidth: 900,
            maxHeight: 'calc(100vh - 40px)',
            overscrollBehavior: 'contain',
        },
    }

    const closeModal = () => {
        setIsOpen(false)
    }

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
                contentLabel={name}
            >
                <Content>
                    <ToolLabelModal id={id} />
                </Content>
            </Modal>
        </>
    )
}

const ToolLabelModal = ({ id }) => {
    const pageContext = usePageContext()
    const block = pageContext.blocks.find((block) => block.id === id)
    console.log(pageContext)
    console.log(id)
    console.log(block)
    const blockData = get(pageContext.pageData, block.dataPath)
    return <ToolExperienceBlock block={block} data={blockData} />
}


const LabelLink = styled(Button)`
    padding: 4px 12px;
    border-radius: 500px;
    display: inline-block;
    font-size: ${fontSize('smaller')};
    white-space: nowrap;
`

const Content = styled.div`
    @media ${mq.small} {
        padding: ${spacing()};
    }
    @media ${mq.mediumLarge} {
        padding: ${spacing(2)};
    }
    background: ${({ theme }) => theme.colors.background};
`

export default ToolLabel
