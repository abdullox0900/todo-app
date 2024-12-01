interface AfterData {
    // API dan keladigan after maydonining strukturasi
    // Masalan:
    timestamp?: string
    metadata?: Record<string, string>
    // ...
}

export interface Track {
    id: number | string
    title: string
    authors: string[]
    like: boolean
    completed?: boolean
    after?: AfterData
}

export interface ApiTrack {
    id: string
    title: string
    completed: boolean
    after: AfterData
    authors?: string | string[]
}