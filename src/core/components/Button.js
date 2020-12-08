import styled, { css } from 'styled-components'
import { mq, fontSize, fontWeight, spacing, color } from 'core/theme'
import ButtonGroup from './ButtonGroup'

const Button = styled.div.attrs(({ className, size = 'medium', variant = 'default', ...props }) => {
    return {
        className: `Button${className ? ` ${className}` : ''}`,
    }
})`
    background: none;
    cursor: pointer;
    display: block;
    text-align: center;
    font-weight: ${fontWeight('bold')};
    border: 1px dashed;
    box-shadow: 0 0 0 rgba(0, 0, 0, 0);
    transition: all 300ms ease-out;

    &,
    &:link,
    &:visited {
        text-decoration: none;
    }

    // sizing
    ${(props) => {
        if (props.size === 'small') {
            return css`
                font-size: ${fontSize('small')};
                padding: ${spacing(0.2)} ${spacing(0.5)};
            `
        }

        if (props.size === 'large') {
            return css`
                @media ${mq.small} {
                    font-size: ${fontSize('large')};
                    padding: ${spacing(0.75)};
                }

                @media ${mq.mediumLarge} {
                    font-size: ${fontSize('larger')};
                    padding: ${spacing(1)};
                }
            `
        }

        return css`
            padding: ${spacing(0.5)} ${spacing(1)};

            @media ${mq.small} {
                font-size: ${fontSize('small')};
            }

            @media ${mq.mediumLarge} {
                font-size: ${fontSize('medium')};
            }
        `
    }}

    // variants
    ${(props) => {
        // default
        return css`
            &,
            &:link,
            &:visited {
                border-color: ${color('text')};
                color: ${color('text')};
            }

            &:hover {
                border-style: solid;
                border-color: ${color('link')};
                color: ${color('link')};
            }
        `
    }}

    &:hover {
        text-decoration: none;
        box-shadow: 0 3px 0 rgba(0, 0, 0, 0.3);
        background: ${color('backgroundAlt')};
    }

    &.Button--selected {
        background: ${color('backgroundAlt')};
        cursor: default;
        pointer-events: none;
        border-style: solid;
    }

    ${ButtonGroup} & {
        border-left-width: 0;
        &:first-child {
            border-left-width: 1px;
        }

        &:hover {
            border-left-color: $border-color;
            border-right-color: $border-color;

            &:first-child {
                border-left-color: $hover-color;
            }
            &:last-child {
                border-right-color: $hover-color;
            }
        }
    }

    ${ButtonGroup} {
        & {
            &--active {
                cursor: default;
                pointer-events: none;
            }
        }
    }
`

export default Button
