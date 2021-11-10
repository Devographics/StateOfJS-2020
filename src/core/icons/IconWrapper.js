import React from 'react'
import styled from 'styled-components'
import { useI18n } from 'core/i18n/i18nContext'
import Tooltip from 'core/components/Tooltip'

const Icon = styled.span`
    height: 24px;
    width: 24px;
    display: block;
    svg {
        height: 100%;
        width: 100%;
        display: block;
        path {
            fill: ${(props) => props.theme.colors.text};
        }
    }
`

const IconWrapper = ({ enableTooltip, labelId, label, children }) => {
    const { translate } = useI18n()
    const label_ = label || translate(labelId)
    const icon = (
        <Icon>
            {children}
            <span className="sr-only">{label_}</span>
        </Icon>
    )
    return enableTooltip ? <Tooltip trigger={icon} contents={<span>{label_}</span>} /> : icon
}

export default IconWrapper
