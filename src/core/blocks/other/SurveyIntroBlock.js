import React from 'react'
import { useI18n } from 'core/i18n/i18nContext'
import TextBlock from 'core/blocks/other/TextBlock'
import Logo from 'core/components/Logo'
import IntroductionFooter from 'core/pages/IntroductionFooter'
import T from 'core/i18n/T'

const SurveyIntroBlock = () => {
    const { translate } = useI18n()
    return (
        <>
            <Logo size="l" />
            <div className="SurveyIntro">
                <div className="SurveyIntro__Content">
                    <T k="sections.introduction.description" md={true} />
                    {/* <TextBlock text={translate('sections.introduction.description')} /> */}
                    <IntroductionFooter />
                </div>
            </div>
        </>
    )
}

export default SurveyIntroBlock
