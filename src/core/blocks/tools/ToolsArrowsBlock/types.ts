import { Entity } from '../../../types'

export interface ToolExperienceBucket {
    id: string
    count: number
    percentage: number
}

export interface ToolsExperienceToolData {
    id: string
    entity: Entity
    experience: {
        year: {
            total: number
            buckets: ToolExperienceBucket[]
        }
    }
}

export interface ToolsArrowsToolData {
}
