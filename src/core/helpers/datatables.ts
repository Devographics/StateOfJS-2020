import { BlockUnits, BlockLegend, BucketItem } from 'core/types'
import { isPercentage } from 'core/helpers/units'

interface TableParams {
    data: BucketItem[]
    legends?: BlockLegend[]
    valueKeys: BlockUnits[]
}

interface TableData {
    headings: TableDataHeading[]
    rows: TableDataRow[]
}

interface TableDataHeading {
    id: string
    labelId: string
}

type TableDataRow = TableDataCell[]

interface TableDataCell {
    id: string | number
    label?: string | number
    value?: string | number
    isPercentage?: boolean
}

const getLabel = (id: string | number, legends?: BlockLegend[]) => {
    const legend = legends && legends.find((key) => key.id === id)
    return legend ? legend.shortLabel || legend.label : id
}

const getValue = (value: number, units: BlockUnits) => (isPercentage(units) ? `${value}%` : value)

export const getTableData = (params: TableParams): TableData => {
    const { data, legends, valueKeys } = params
    const headings = [{ id: 'label', labelId: 'table.label' }]

    valueKeys.forEach((k) => {
        headings.push({ id: k, labelId: `table.${k}` })
    })

    const rows = data.map((row) => {
        const firstColumn: TableDataCell = {
            id: 'label',
            label: getLabel(row.id, legends),
        }
        const columns: TableDataCell[] = []

        valueKeys.forEach((k) => {
            columns.push({ id: k, value: getValue(row[k], k) })
        })

        return [firstColumn, ...columns]
    })

    return { headings, rows }
}
