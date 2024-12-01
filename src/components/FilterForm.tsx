"use client"

import { getTracks } from '@/lib/api'
import { Track } from '@/lib/types'
import React, { useEffect, useState } from 'react'

interface FilterFormProps {
    onFilter: (tracks: Track[]) => void
}

export function FilterForm({ onFilter }: FilterFormProps) {
    const [authors, setAuthors] = useState<string[]>([])
    const [selectedAuthors, setSelectedAuthors] = useState<Set<string>>(new Set())
    const [likeStatus, setLikeStatus] = useState<'all' | 'true' | 'false'>('all')
    const [isLoading, setIsLoading] = useState(true)

    // Barcha authorlarni APIdan olish
    useEffect(() => {
        loadAuthors()
    }, [])

    const loadAuthors = async () => {
        try {
            const tracks = await getTracks()
            const uniqueAuthors = new Set<string>()
            tracks.forEach(track => {
                track.authors.forEach(author => {
                    uniqueAuthors.add(author)
                })
            })
            setAuthors(Array.from(uniqueAuthors).sort())
        } catch (error) {
            console.error('Failed to load authors:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAuthorChange = (author: string) => {
        const newSelected = new Set(selectedAuthors)
        if (newSelected.has(author)) {
            newSelected.delete(author)
        } else {
            newSelected.add(author)
        }
        setSelectedAuthors(newSelected)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const tracks = await getTracks()
            const filteredTracks = tracks.filter(track => {
                // Like status filter
                if (likeStatus !== 'all' && String(track.like) !== likeStatus) {
                    return false
                }

                // Authors filter
                if (selectedAuthors.size > 0) {
                    return track.authors.some(author => selectedAuthors.has(author))
                }

                return true
            })

            onFilter(filteredTracks)
        } catch (error) {
            console.error('Failed to filter tracks:', error)
        }
    }

    const handleReset = async () => {
        setSelectedAuthors(new Set())
        setLikeStatus('all')
        const tracks = await getTracks()
        onFilter(tracks)
    }

    if (isLoading) {
        return <div className="text-center p-4">Loading filters...</div>
    }

    return (
        <form className="space-y-6 p-4 rounded-lg border border-gray-200 dark:border-gray-700" onSubmit={handleSubmit}>
            <label className="block">
                <span className="text-sm font-medium mb-2 block">Статус</span>
                <select
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    value={likeStatus}
                    onChange={(e) => setLikeStatus(e.target.value as 'all' | 'true' | 'false')}
                >
                    <option value="all">Все</option>
                    <option value="true">Понравившиеся</option>
                    <option value="false">Не понравившиеся</option>
                </select>
            </label>
            <div>
                <span className="text-sm font-medium mb-2 block">Авторы</span>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {authors.map(author => (
                        <label key={author} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={selectedAuthors.has(author)}
                                onChange={() => handleAuthorChange(author)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
                            />
                            <span className="text-sm">{author}</span>
                        </label>
                    ))}
                </div>
            </div>
            <div className="flex gap-4">
                <button
                    type="submit"
                    className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                    Применить
                </button>
                <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                    Сбросить
                </button>
            </div>
        </form>
    )
} 