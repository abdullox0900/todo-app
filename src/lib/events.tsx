import { Track } from "./types"

export function initEvents(): void {
    if (typeof window === 'undefined') return

    window.addEventListener('storage', (event: StorageEvent) => {
        if (event.key === 'tracks') {
            window.location.reload()
        }
    })
}

export function dispatchStorageEvent(tracks: Track[]): void {
    if (typeof window === 'undefined') return

    const event = new StorageEvent('storage', {
        key: 'tracks',
        newValue: JSON.stringify(tracks)
    })

    window.dispatchEvent(event)
} 