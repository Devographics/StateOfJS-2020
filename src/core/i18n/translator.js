import template from 'lodash/template'

/*

Returns the translation string object

*/
export const getStringTranslator = (locale = {}) => (key, { values } = {}, fallback) => {
    const { strings = [], ...rest } = locale
    // reverse strings so that strings added last take priority
    const s = strings
        .slice()
        .reverse()
        .find((t) => t.key === key)

    if (s && values) {
        try {
            s.t = template(s.t)(values)
        } catch (error) {
            console.error(error)
            s.t = `[${locale.id}][ERR] ${key}`
        }
    }

    return { ...s, locale: rest }
}

/*

Returns the translated string (legacy)

*/
export const getTranslator = (locale = {}) => (key, { values } = {}, fallback) => {
    const { id, strings = [] } = locale
    // reverse strings so that strings added last take priority
    const translation = strings
        .slice()
        .reverse()
        .find((t) => t.key === key)

    if (translation === undefined) {
        return typeof fallback === 'undefined' ? `[${id}] ${key}` : fallback
    }

    if (values === undefined) return translation.t

    try {
        return template(translation.t)(values)
    } catch (error) {
        // console.error(error)
        return `[${id}][ERR] ${key}`
    }
}

export const translateOrFallback = (translatedKey, fallback) =>
    translatedKey.match(/\[[a-z]{2}-[A-Z]{2}?\] [a-z_\-.]+/) ? fallback : translatedKey
