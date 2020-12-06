import React from 'react'
import styled from 'styled-components'
import Link from 'core/components/LocaleLink'
import sponsors from 'config/sponsors.yml'
import { useI18n } from 'core/i18n/i18nContext'
import { mq, spacing, fontSize } from 'core/theme'
import TextBlock from 'core/blocks/other/TextBlock'

const SponsorsBlock = () => {
    const { translate } = useI18n()

    return (
        <>
            <Container>
                <Header>{translate('partners.our_partners')}</Header>
                <SponsorList className="Sponsor__list">
                    {sponsors.map(({ name, image, url, id, description }) => (
                        <Sponsor className={`Sponsor Sponsor--${id}`} key={name}>
                            <SponsorLogo>
                                <a href={url} title={name}>
                                    <img src={`/images/sponsors/${image}`} alt={name} />
                                </a>
                            </SponsorLogo>
                            <SponsorDescription>
                                <TextBlock text={description} />
                            </SponsorDescription>
                        </Sponsor>
                    ))}
                </SponsorList>
            </Container>
            <Support className="Sponsors__Support">
                <Link to="/support">{translate('partners.become_partner')}</Link>
            </Support>
        </>
    )
}

const Container = styled.div`
    background: ${(props) => props.theme.colors.backgroundAlt};
    padding: ${spacing(1.5)};
    margin-top: ${spacing(2)};
`

const Header = styled.h3`
    text-align: center;
    margin-bottom: ${spacing()};
`

const SponsorList = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    @media ${mq.smallMedium} {
        flex-direction: column;
    }
`

const Sponsor = styled.div`
    @media ${mq.smallMedium} {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    @media ${mq.large} {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr);
        column-gap: ${spacing(2)};
    }
`

const SponsorLogo = styled.div`
    width: 150px;

    @media ${mq.smallMedium} {
        margin-bottom: ${spacing()};
    }

    @media ${mq.large} {
        /* margin-right: ${spacing(3)}; */
    }

    &:last-child {
        margin: 0;
    }

    a,
    svg,
    img {
        display: block;
        width: 100%;
    }
    &--designcode {
        width: 50px;
    }
`

const SponsorDescription = styled.div`
    @media ${mq.smallMedium} {
        text-align: center;
    }
`
const Support = styled.div`
    text-align: center;
    margin-top: ${spacing(0.5)};
    font-size: ${fontSize('smallish')};
`

export default SponsorsBlock
