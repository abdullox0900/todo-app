import { Track } from "@/lib/types"

let tracksStorage: Track[] = []

export function getTracksList(): Track[] {
    const baseTracksList: Track[] = [
        {
            id: 0,
            title: "Эхо",
            authors: ["OZMA", "AVENAX"],
            like: true,
        },
        {
            id: 1,
            title: "Восход",
            authors: ["AUM RAA"],
            like: true,
        },
        {
            id: 2,
            title: "Цунами",
            authors: ["Nyusha", "AUM RAA"],
            like: true,
        },
        {
            id: 3,
            title: "Воспоминание",
            authors: ["Nyusha"],
            like: false,
        },
    ]

    if (tracksStorage.length > 0) return tracksStorage

    if (typeof window !== 'undefined') {
        const tracksInLocalStorage = localStorage.getItem("tracks")
        if (tracksInLocalStorage) {
            try {
                tracksStorage = JSON.parse(tracksInLocalStorage)
                return tracksStorage
            } catch {
                localStorage.removeItem("tracks")
            }
        }
    }

    tracksStorage = baseTracksList
    if (typeof window !== 'undefined') {
        localStorage.setItem("tracks", JSON.stringify(tracksStorage))
    }

    return tracksStorage
}

export function getTrackById(id: number): Track | undefined {
    const tracks = getTracksList()
    return tracks.find((track) => track.id === id)
}

export function saveTracks(): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem("tracks", JSON.stringify(tracksStorage))
    }
}

export function getAllAuthors(): string[] {
    const authors = new Set<string>()
    const tracks = getTracksList()

    tracks.forEach((track) => {
        track.authors.forEach((author) => {
            authors.add(author)
        })
    })

    return Array.from(authors).sort()
} 