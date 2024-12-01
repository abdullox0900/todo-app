import { HeartIcon, TrashIcon } from '@/icons'
import { deleteTrack, updateTrack } from '@/lib/api'
import { Track } from '@/lib/types'
import Link from 'next/link'
import { memo, useState } from 'react'

interface TrackCardProps {
    track: Track
    onDelete: () => void
    onUpdate: (updatedTrack: Track) => void
}

export const TrackCard = memo(function TrackCard({ track, onDelete, onUpdate }: TrackCardProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault()
        if (confirm('Вы уверены, что хотите удалить этот трек?')) {
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

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault()
        setIsUpdating(true)
        try {
            const updatedTrack = await updateTrack({
                ...track,
                like: !track.like
            })
            onUpdate(updatedTrack)
        } catch (error) {
            console.error('Failed to update track:', error)
        } finally {
            setIsUpdating(false)
        }
    }

    if (!track || !track.title) {
        return null
    }

    return (
        <Link
            href={`/track/${track.id}`}
            className="block bg-[#f9fafb] dark:bg-[#282828] rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <div className="flex-grow">
                        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                            {track.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            {track.authors?.length > 0 ? track.authors.join(', ') : 'Нет авторов'}
                        </p>
                    </div>
                    <div className={`flex gap-2 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                        <button
                            onClick={handleLike}
                            disabled={isUpdating}
                            className={`p-2 rounded-full hover:bg-green-50 dark:hover:bg-opacity-10 
                                ${track.like
                                    ? 'text-[#1ab349]'
                                    : 'text-gray-600 hover:text-[#1ab349] dark:text-gray-400 dark:hover:text-[#1ab349]'
                                }`}
                        >
                            <HeartIcon filled={track.like} />
                        </button>
                        <button
                            onClick={handleDelete}
                            className="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-opacity-10 disabled:opacity-50"
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <TrashIcon />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    )
}) 