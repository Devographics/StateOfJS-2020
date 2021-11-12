import React from 'react'
import styled from 'styled-components'
import { spacing, fontSize } from 'core/theme'
import { useI18n } from 'core/i18n/i18nContext'
import T from 'core/i18n/T'

const Footer = styled.div`
    margin-top: ${spacing(2)};
    font-size: ${fontSize('small')};
    text-align: center;
    color: ${(props) => props.theme.colors.textAlt};
`

const BlockFooter = ({ block }) => (
    <Footer>Data out of 999 respondents (XX% of YY total respondents) (TODO)</Footer>
)

export default BlockFooter
