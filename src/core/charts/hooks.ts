import { useMemo } from 'react'
import ceil from 'lodash/ceil'
// @ts-ignore
import { useI18n } from 'core/i18n/i18nContext'

export const useBarChart = ({
    buckets,
    total,
    mode,
    units,
    i18nNamespace,
    shouldTranslate,
}: {
    buckets: {
        count: number
        percentage: number
    }[]
    total: number
    mode: 'relative' | 'absolute'
    units: 'count' | 'percentage'
    i18nNamespace: string
    shouldTranslate?: boolean
}) => {
    const { translate } = useI18n()

    const formatTick = useMemo(() => {
        if (shouldTranslate !== true) {
            return (value: string | number) => `${value}`
        }

        // automatically pick from `options` using
        // the provided namespace.
        return (value: string | number) => translate(`options.${i18nNamespace}.${value}.short`)
    }, [translate, shouldTranslate, i18nNamespace])

    const formatValue = useMemo(() => {
        if (units === 'percentage') {
            return (value: string | number) => `${value}%`
        }

        return '.2s'
    }, [units])

    const maxValue = useMemo(() => {
        if (units === 'percentage') {
            if (mode === 'absolute') {
                return 100
            }

            const maxBucketPercentage = Math.max(...buckets.map((b) => b.percentage))

            return ceil(maxBucketPercentage, -1)
        }

        if (mode === 'absolute') {
            return ceil(total, -3)
        }

        const maxBucketCount = Math.max(...buckets.map((b) => b.count))
        const precision = `${maxBucketCount}`.length - 1

        return ceil(maxBucketCount, -precision)
    }, [buckets, total, mode, units])

    const tickCount = 6

    const ticks = Array.from({ length: tickCount }, (_, i) =>
        Math.round((i * maxValue) / tickCount)
    )

    return { formatTick, formatValue, maxValue, tickCount, ticks }
}
