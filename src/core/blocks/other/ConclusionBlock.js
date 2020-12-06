import React from 'react'
import { useI18n } from 'core/i18n/i18nContext'
import TextBlock from 'core/blocks/other/TextBlock'

const ConclusionBlock = () => {
    const { translate } = useI18n()
    return (
        <div className="Conclusion">
            <TextBlock text={translate('sections.conclusion.description')} />
        </div>
    )
}

export default ConclusionBlock
