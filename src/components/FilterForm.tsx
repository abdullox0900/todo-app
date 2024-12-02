"use client"

import { getTracks } from '@/lib/api'
import { Track } from '@/lib/types'
import React, { useCallback, useEffect, useState } from 'react'

interface FilterFormProps {
    onFilter: (tracks: Track[]) => void
    tracks: Track[]
}

export function FilterForm({ onFilter, tracks }: FilterFormProps) {
    const [authors, setAuthors] = useState<string[]>([])
    const [selectedAuthors, setSelectedAuthors] = useState<Set<string>>(new Set())
    const [likeStatus, setLikeStatus] = useState<'all' | 'true' | 'false'>('all')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const uniqueAuthors = new Set<string>()
        tracks.forEach(track => {
            track.authors.forEach(author => {
                uniqueAuthors.add(author)
            })
        })
        setAuthors(Array.from(uniqueAuthors).sort())
        setIsLoading(false)
    }, [tracks])

    const handleAuthorChange = (author: string) => {
        const newSelected = new Set(selectedAuthors)
        if (newSelected.has(author)) {
            newSelected.delete(author)
        } else {
            newSelected.add(author)
        }
        setSelectedAuthors(newSelected)
    }

    const handleFilter = useCallback(async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const freshTracks = await getTracks()

            const filteredTracks = freshTracks.filter(track => {
                if (likeStatus !== 'all' && String(track.like) !== likeStatus) {
                    return false
                }

                if (selectedAuthors.size > 0) {
                    return track.authors.some(author => selectedAuthors.has(author))
                }

                return true
            })

            onFilter(filteredTracks)
        } catch (error) {
            console.error('Failed to fetch tracks:', error)
        }
    }, [likeStatus, selectedAuthors, onFilter])

    const handleReset = async (e: React.MouseEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            setSelectedAuthors(new Set())
            setLikeStatus('all')

            const freshTracks = await getTracks()
            onFilter(freshTracks)
        } catch (error) {
            console.error('Failed to reset filters:', error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return <div className="text-center p-4">Загрузка фильтров...</div>
    }

    return (
        <div className="bg-white dark:bg-[#282828] rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Фильтры</h2>
            <form className="space-y-6" onSubmit={handleFilter}>
                <div>
                    <label className="block text-sm font-medium mb-2">Статус</label>
                    <select
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        value={likeStatus}
                        onChange={(e) => setLikeStatus(e.target.value as 'all' | 'true' | 'false')}
                    >
                        <option value="all">Все</option>
                        <option value="true">Понравившиеся</option>
                        <option value="false">Не понравившиеся</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Авторы</label>
                    <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {authors.map(author => (
                            <label key={author} className="flex items-center p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={selectedAuthors.has(author)}
                                    onChange={() => handleAuthorChange(author)}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
                                />
                                <span className="ml-2 text-sm">{author}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Загрузка...' : 'Применить'}
                    </button>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Загрузка...' : 'Сбросить'}
                    </button>
                </div>
            </form>
        </div>
    )
} 