import { Completion } from 'core/types'

export interface OpinionBucket {
    id: 0 | 1 | 2 | 3 | 4
    count: number
    percentage: number
}

export interface OpinionYearData {
    year: number
    total: number
    completion: Completion
    buckets: OpinionBucket[]
}

export type OpinionAllYearsData = OpinionYearData[]
