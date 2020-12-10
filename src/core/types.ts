export interface Entity {
    name: string
    description?: string
    homepage?: string
    github?: {
        url?: string
    }
}

export interface Completion {
    count: number
    percentage: number
}
