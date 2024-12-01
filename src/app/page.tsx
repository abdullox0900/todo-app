"use client"

import { ThemeToggle } from "@/components/ThemeToggle"
import { TracksList } from "@/components/TracksList"
import { initEvents } from "@/lib/events"
import { useEffect } from "react"

export default function Home() {
  useEffect(() => {
    initEvents()
  }, [])

  return (
    <>
      <ThemeToggle />
      <TracksList />
    </>
  )
} 