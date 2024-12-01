export interface Track {
    id: number | string
    title: string
    authors: string[]
    like: boolean
    completed?: boolean
    after?: string
}

export interface ApiTrack {
    id: string
    title: string
    completed: boolean
    after: string
    authors?: string | string[]
}