export interface Entity {
    name: string
    homepage?: string
    github?: {
        url?: string
    }
}

export interface Completion {
    count: number
    percentage: number
}
