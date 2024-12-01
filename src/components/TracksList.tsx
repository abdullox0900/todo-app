"use client"

import { AddTrackForm } from "@/components/AddTrackForm"
import { FilterForm } from "@/components/FilterForm"
import { TrackCard } from "@/components/TrackCard"
import { getTracks } from "@/lib/api"
import { Track } from "@/lib/types"
import { useEffect, useState } from "react"

export function TracksList() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadTracks()
  }, [])

  const loadTracks = async () => {
    try {
      const data = await getTracks()
      setTracks(data)
    } catch (error) {
      console.error('Failed to load tracks:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilter = (filteredTracks: Track[]) => {
    setTracks(filteredTracks)
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold">Zpotify</h1>
      </div>

      <div className="mb-8">
        <FilterForm onFilter={handleFilter} />
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="grid gap-4">
            {tracks.length === 0 ? (
              <h5 className="text-center text-gray-500">Список треков пуст.</h5>
            ) : (
              tracks.map((track: Track) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  onDelete={() => {
                    setTracks(tracks.filter(t => t.id !== track.id))
                  }}
                />
              ))
            )}
          </div>
        )}
        <AddTrackForm onAdd={(track) => {
          setTracks([...tracks, track])
        }} />
      </div>
    </div>
  )
} 