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

    if (!track || !track.title) {
        return null
    }

    return (
        <Link
            href={`/track/${track.id}`}
            className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
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
                            onClick={(e) => {
                                e.preventDefault()
                                // Like functionality can be added here
                            }}
                            className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-gray-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </button>
                        <button
                            onClick={handleDelete}
                            className="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-gray-700 disabled:opacity-50"
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    )
} 