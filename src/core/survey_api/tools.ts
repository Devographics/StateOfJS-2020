import { Entity } from 'core/types'

export interface ToolExperienceBucket {
    id: string
    count: number
    percentage: number
}

export interface ToolYearExperience {
    year: number
    total: number
    buckets: ToolExperienceBucket[]
}

export interface ToolAllYearsExperience {
    id: string
    entity: Entity
    experience: {
        all_years: ToolYearExperience[]
    }
}
