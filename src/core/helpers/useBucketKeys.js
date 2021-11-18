import { useMemo } from 'react'
import { useTheme } from 'styled-components'
import { keys } from 'core/bucket_keys'
import { useI18n } from 'core/i18n/i18nContext'

export const useBucketKeys = (bucketKeysId) => {
    const theme = useTheme()
    const { translate, getString } = useI18n()
    const keysConfig = keys[bucketKeysId]
    if (!keysConfig) {
        throw new Error(`Could not find bucket keys config for: "${bucketKeysId}"`)
    }

    return useMemo(() => {
        let colorRange
        if (keysConfig.colorRange) {
            colorRange = theme.colors.ranges[keysConfig.colorRange]
        }

        return keysConfig.keys.map((key) => {
            const label = translate(key.label)
            const shortLabelObject = getString(key.shortLabel)
            const shortLabel = shortLabelObject.missing ? undefined : shortLabelObject.t
            return {
                id: key.id,
                label,
                shortLabel,
                color: colorRange ? colorRange[key.id] : undefined,
            }
        })
    }, [keysConfig, theme, translate])
}

export const getBucketKeys = (block, data) => {
    const keys = data.map(({ id }) => ({
        id,
        labelKey: `options.${block.id}.${id}`,
        shortLabelKey: `options.${block.id}.${id}.short`,
    }))
    return keys
}

export const useLegends = (block, buckets = []) => {
    const theme = useTheme()
    const { translate, getString } = useI18n()

    const colorRange = theme.colors.ranges[block.id]
    const keys = getBucketKeys(block, buckets)
    const legends = keys.map(({ id, labelKey, shortLabelKey }) => {
        const label = translate(labelKey)
        const shortLabelObject = getString(shortLabelKey)
        const shortLabel = shortLabelObject.missing ? undefined : shortLabelObject.t
        const legend = {
            id,
            label,
            shortLabel,
        }
        if (colorRange) {
            legend.color = colorRange[id]
        }
        return legend
    })
    return legends
}
