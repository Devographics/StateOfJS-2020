import removeMarkdown from 'remove-markdown'
import { getTranslationValuesFromContext, getPageLabel } from '../helpers/pageHelpers'
import get from 'lodash/get'
import config from 'config/config.yml'

export const getBlockTitleKey = (block, page) => {
    const { blockName, titleId } = block
    if (titleId) {
        return titleId
    } else if (blockName) {
        return `blocks.${blockName}.title`
    } else {
        const pageId = page.i18nNamespace || page.id
        const blockId = block.id.replace('_others', '.others')
        return `${pageId}.${blockId}`
    }
}

export const getBlockDescriptionKey = (block, page) => {
    const { blockName } = block
    if (blockName) {
        return `blocks.${blockName}.description`
    } else {
        const pageId = page.i18nNamespace || page.id
        const blockId = block.id.replace('_others', '.others')
        return `${pageId}.${blockId}.description`
    }
}

export const getBlockTitle = (block, page, translate) => {
    return block.title || translate(getBlockTitleKey(block, page))
}

export const getBlockDescription = (block, page, translate) => {
    return block.description || translate(`${getBlockDescriptionKey(block, page)}.description`)
}

export const getBlockImage = (block, context) => {
    return `${config.capturesUrl}${get(context, 'locale.path')}/${block.id}.png`
}

export const getBlockMeta = (block, context, translate, title) => {
    const { id } = block
    const link = `${context.host}${context.currentPath}${id}`
    const trackingId = `${context.currentPath}${id}`.replace(/^\//, '')

    title = title || getBlockTitle(block, context, translate)

    const imageUrl = getBlockImage(block, context, translate)

    const twitterText = translate('share.block.twitter_text', {
        values: {
            title,
            link,
        },
    })

    const emailSubject = translate('share.block.subject')
    const emailBody = translate('share.block.body', {
        values: {
            title,
            link,
        },
    })

    return {
        link,
        trackingId,
        title,
        twitterText,
        emailSubject,
        emailBody,
        imageUrl,
    }
}
