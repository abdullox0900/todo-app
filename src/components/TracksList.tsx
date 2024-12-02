"use client"

import { AddTrackForm } from "@/components/AddTrackForm"
import { FilterForm } from "@/components/FilterForm"
import { TrackCard } from "@/components/TrackCard"
import { ZpotifyIcon } from '@/icons'
import { getTracks } from "@/lib/api"
import { Track } from "@/lib/types"
import { useEffect, useMemo, useState } from "react"

export function TracksList() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

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

  const handleTrackUpdate = (updatedTrack: Track) => {
    setTracks(tracks.map(track =>
      track.id === updatedTrack.id ? updatedTrack : track
    ))
  }

  const sortedTracks = useMemo(() => {
    return [...tracks].sort((a, b) => a.title.localeCompare(b.title))
  }, [tracks])

  if (!mounted) return null

  return (
    <div className="max-w-5xl mx-auto p-4 min-h-screen">
      <div className="flex items-center gap-[15px] mb-8 text-center">
        <ZpotifyIcon />
        <h1 className="text-[28px] font-bold dark:text-white">
          Zpotify
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px,1fr]">
        <div className="space-y-4">
          <FilterForm onFilter={handleFilter} tracks={tracks} />
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showAddForm ? 'Скрыть форму' : 'Добавить трек'}
          </button>
        </div>

        <div className="space-y-6">
          {showAddForm && (
            <div className="bg-white dark:bg-[#282828] rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Добавить новый трек</h2>
              <AddTrackForm
                onAdd={(track) => {
                  setTracks([...tracks, track])
                  setShowAddForm(false)
                }}
              />
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid gap-4">
              {tracks.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
                  <h5 className="text-xl text-gray-500 dark:text-gray-400">
                    Список треков пуст
                  </h5>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Добавить первый трек
                  </button>
                </div>
              ) : (
                sortedTracks.map((track: Track) => (
                  <TrackCard
                    key={track.id}
                    track={track}
                    onDelete={() => {
                      setTracks(tracks.filter(t => t.id !== track.id))
                    }}
                    onUpdate={handleTrackUpdate}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 