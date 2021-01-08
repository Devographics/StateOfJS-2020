import React, { useState } from 'react'
import { useTheme } from 'styled-components'
import styled from 'styled-components'
import { mq, spacing, fontSize, color } from 'core/theme'
import Button from 'core/components/Button'
import Modal from 'react-modal'

const ModalTrigger = ({ label, trigger, children }) => {
    const theme = useTheme()
    const [modalIsOpen, setIsOpen] = useState(false)

    const openModal = (e) => {
        e.preventDefault()
        setIsOpen(true)
    }

    const closeModal = (e) => {
        e.preventDefault()
        setIsOpen(false)
    }

    const triggerComponent = trigger ? (
        React.cloneElement(trigger, { onClick: openModal })
    ) : (
        <TriggerDefaultComponent className="PopoverToggle" onClick={openModal}>
            {label}
        </TriggerDefaultComponent>
    )

    const customStyles = {
        overlay: {
            backgroundColor: `${theme.colors.background}99`,
            backdropFilter: 'blur(5px)',
        },
        content: {
            // borderWidth: 0,
            // top: '50%',
            // left: '50%',
            // right: 'auto',
            // bottom: 'auto',
            // marginRight: '-50%',
            // transform: 'translate(-50%, -50%)',
            // padding: 0,
            // width: 'calc(100% - 40px)',
            // maxWidth: 950,
            // maxHeight: 'calc(100vh - 40px)',
            // overscrollBehavior: 'contain',
            // borderRadius: '10px',
            // background: theme.colors.backgroundAlt,
            // boxShadow: `0px 8px 16px rgba(0,0,0,0.75)`,
            // animation: css`
            //     ${pop} 1100ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0ms 1 forwards
            // `,
        },
    }

    return (
        <>
            {triggerComponent}

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel={label}
                className="ModalContent"
                // overlayClassName="ModalOverlay"
            >
                <Content>{children}</Content>
            </Modal>
        </>
    )
}

const Content = styled.div`
    position: absolute;
    right: auto;
    bottom: auto;

    border-width: 0;
    /* padding: 0; */
    overscroll-behavior: contain;
    border-radius: 10px;
    background: ${color('backgroundAlt')};
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.75);

    @media ${mq.small} {
        padding: ${spacing(0.75)};
        width: calc(100% - 60px);
        height: calc(100% - 60px);
        top: ${spacing(1.5)};
        left: ${spacing(1.5)};
    }
    @media ${mq.mediumLarge} {
        padding: ${spacing(2)};
        width: calc(100% - 40px);
        max-width: 950px;
        max-height: calc(100vh - 40px);

        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

    }
`

const TriggerDefaultComponent = styled(Button)``

export default ModalTrigger
