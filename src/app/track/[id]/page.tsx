"use client"

import { EditTrackForm } from "@/components/EditTrackForm"
import { getTrackById } from "@/lib/api"
import { Track } from "@/lib/types"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function EditTrack() {
    const params = useParams()
    const router = useRouter()
    const [track, setTrack] = useState<Track | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (params.id) {
            loadTrack(params.id as string)
        }
    }, [params.id])

    const loadTrack = async (id: string) => {
        try {
            const trackData = await getTrackById(id)
            if (!trackData) {
                router.push('/') // Redirect to home if track not found
                return
            }
            setTrack(trackData)
        } catch (error) {
            console.error('Failed to load track:', error)
            router.push('/') // Redirect to home on error
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        )
    }

    if (!track) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">Track not found</h1>
                    <button
                        onClick={() => router.push('/')}
                        className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                        Go Back Home
                    </button>
                </div>
            </div>
        )
    }

    return <EditTrackForm track={track} />
} 