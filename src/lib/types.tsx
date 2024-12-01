export interface Track {
    id: number | string
    title: string
    authors: string[]
    like: boolean
    completed?: boolean
    after?: any
}

export interface ApiTrack {
    id: string
    title: string
    completed: boolean
    after: any
    authors?: string | string[]
} 