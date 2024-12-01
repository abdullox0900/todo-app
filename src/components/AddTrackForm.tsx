"use client"

import { createTrack } from '@/lib/api'
import { Track } from '@/lib/types'
import React, { useRef, useState } from 'react'

interface AddTrackFormProps {
    onAdd: (track: Track) => void
}

export function AddTrackForm({ onAdd }: AddTrackFormProps) {
    const formRef = useRef<HTMLFormElement>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = formRef.current
        if (!form) return

        const formData = new FormData(form)

        const title = formData.get('title') as string
        const authors = (formData.get('authors') as string).split(',').map(a => a.trim())

        if (title) {
            setIsLoading(true)
            try {
                const newTrack = await createTrack({
                    title,
                    authors,
                    like: false,
                })
                onAdd(newTrack)
                form.reset()
            } catch (error) {
                console.error('Failed to create track:', error)
            } finally {
                setIsLoading(false)
            }
        }
    }

    return (
        <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
            <input
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-400"
                type="text"
                name="title"
                placeholder="Название трека"
                required
                disabled={isLoading}
            />
            <div>
                <input
                    placeholder="Авторы через ','"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-400"
                    name="authors"
                    disabled={isLoading}
                />
            </div>
            <button
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50"
                type="submit"
                disabled={isLoading}
            >
                {isLoading ? 'Добавление...' : 'Добавить'}
            </button>
        </form>
    )
} 