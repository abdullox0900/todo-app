import { deleteTrack } from '@/lib/api'
import { Track } from '@/lib/types'
import Link from 'next/link'
import { useState } from 'react'

interface TrackCardProps {
    track: Track
    onDelete: () => void
}

export function TrackCard({ track, onDelete }: TrackCardProps) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault()
        if (confirm('Are you sure you want to delete this track?')) {
            setIsDeleting(true)
            try {
                await deleteTrack(track.id)
                onDelete()
            } catch (error) {
                console.error('Failed to delete track:', error)
            } finally {
                setIsDeleting(false)
            }
        }
    }

    if (!track || !track.title) {
        return null
    }

    return (
        <Link href={`/track/${track.id}`}
            className="block p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors dark:border-gray-700 dark:hover:border-gray-600">
            <div className="flex flex-col">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-semibold mb-1">{track.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {track.authors?.length > 0 ? track.authors.join(', ') : 'No authors'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleDelete}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg dark:hover:bg-red-900 disabled:opacity-50"
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Удаление...' : 'Удалить'}
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    )
} 