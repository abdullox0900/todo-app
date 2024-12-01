import { getTrackById, getTracksList, saveTracks } from "./data"

type EventCallback = (detail: any) => void

const events = {
    toggleTrackStatus: "toggle-track-status",
    removeTrack: "remove-track",
}

function initDispatchEvents() {
    function dispatchEvent(eventName: string, detail: Record<string, any> = {}) {
        const event = new CustomEvent(eventName, { detail })
        document.dispatchEvent(event)
    }
    (window as any).dispatch = dispatchEvent
}

function addEvent(eventName: string, callback: EventCallback) {
    document.addEventListener(eventName, (event) => {
        if (event instanceof CustomEvent) {
            callback(event.detail)
        }
    })
}

export function handleToggleTrackStatus(trackId: number) {
    const track = getTrackById(trackId)
    if (!track) return
    track.like = !track.like
    saveTracks()
}

export function handleRemoveTrack(trackId: number) {
    const track = getTrackById(trackId)
    const trackList = getTracksList()
    if (!track) return
    const index = trackList.indexOf(track)
    trackList.splice(index, 1)
    saveTracks()
}

export function initEvents() {
    initDispatchEvents()
    addEvent(events.toggleTrackStatus, handleToggleTrackStatus)
    addEvent(events.removeTrack, handleRemoveTrack)
}

export function dispatchToggleTrackStatus(trackId: number) {
    return `window.dispatch?.call(null, '${events.toggleTrackStatus}', ${JSON.stringify({ trackId })})`
}

export function dispatchRemoveTrack(trackId: number) {
    return `window.dispatch?.call(null, '${events.removeTrack}', ${JSON.stringify({ trackId })})`
} 