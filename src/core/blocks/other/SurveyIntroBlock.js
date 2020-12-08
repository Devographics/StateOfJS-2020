import React from 'react'
import IntroductionFooter from 'core/pages/IntroductionFooter'
import T from 'core/i18n/T'
import variables from '../../../../config/variables.yml'
const { IntroLogo } = require(`surveys/${variables.surveyType}/logo/IntroLogo`)

const SurveyIntroBlock = () => (
    <>
        <IntroLogo />
        <div className="SurveyIntro">
            <div className="SurveyIntro__Content">
                <T k="sections.introduction.description" md={true} />
                <IntroductionFooter />
            </div>
        </div>
    </>
)

export default SurveyIntroBlock
