import { ApiTrack, Track } from './types'

const API_URL = 'https://665aad03003609eda45e7c6a.mockapi.io/service/todo-list'

// API dan kelgan ma'lumotlarni Track formatiga o'zgartirish
function adaptTrack(apiTrack: ApiTrack): Track {
	return {
		id: apiTrack.id,
		title: apiTrack.title,
		authors: apiTrack.authors
			? typeof apiTrack.authors === 'string'
				? apiTrack.authors.split(',').map(a => a.trim())
				: apiTrack.authors
			: [],
		like: apiTrack.completed,
		completed: apiTrack.completed,
		after: apiTrack.after,
	}
}

export async function getTracks(): Promise<Track[]> {
	const response = await fetch(API_URL)
	const data: ApiTrack[] = await response.json()
	return data.map(adaptTrack)
}

export async function createTrack(track: Omit<Track, 'id'>): Promise<Track> {
	const apiTrack = {
		title: track.title,
		completed: track.like,
		authors: track.authors.join(','),
	}

	const response = await fetch(API_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(apiTrack),
	})
	const data: ApiTrack = await response.json()
	return adaptTrack(data)
}

export async function updateTrack(track: Track): Promise<Track> {
	const apiTrack = {
		title: track.title,
		completed: track.like,
		authors: track.authors.join(','),
	}

	const response = await fetch(`${API_URL}/${track.id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(apiTrack),
	})
	const data: ApiTrack = await response.json()
	return adaptTrack(data)
}

export async function deleteTrack(id: number | string): Promise<void> {
	await fetch(`${API_URL}/${id}`, {
		method: 'DELETE',
	})
}

export async function getTrackById(id: string): Promise<Track | null> {
	try {
		const response = await fetch(`${API_URL}/${id}`)
		if (!response.ok) {
			return null
		}
		const data: ApiTrack = await response.json()
		return adaptTrack(data)
	} catch (error) {
		console.error('Failed to fetch track:', error)
		return null
	}
}
