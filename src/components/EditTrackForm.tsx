"use client"

import { updateTrack } from '@/lib/api'
import { Track } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface EditTrackFormProps {
    track: Track
}

export function EditTrackForm({ track }: EditTrackFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [title, setTitle] = useState(track.title)
    const [authors, setAuthors] = useState(track.authors?.join(', ') || '')
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            if (!title.trim()) {
                throw new Error('Title is required')
            }

            await updateTrack({
                ...track,
                title: title.trim(),
                authors: authors.split(',').map(a => a.trim()).filter(Boolean),
            })

            router.push('/')
            router.refresh()
        } catch (error) {
            console.error('Failed to update track:', error)
            setError(error instanceof Error ? error.message : 'Failed to update track')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Редактировать трек</h1>
                <button
                    onClick={() => router.push('/')}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    ← Назад
                </button>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error === 'Title is required' ? 'Название трека обязательно' : 'Ошибка при обновлении трека'}
                </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Название
                        <input
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-400"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </label>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Авторы
                        <input
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-400"
                            type="text"
                            value={authors}
                            onChange={(e) => setAuthors(e.target.value)}
                            placeholder="Авторы (через запятую)"
                            disabled={isLoading}
                        />
                    </label>
                </div>
                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                                Сохранение...
                            </span>
                        ) : (
                            'Сохранить'
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        disabled={isLoading}
                    >
                        Отмена
                    </button>
                </div>
            </form>
        </div>
    )
} 