"use client"

import { Layout } from "@/components/Layout"
import { TracksList } from "@/components/TracksList"
import { initEvents } from "@/lib/events"
import { useEffect } from "react"

export default function Home() {
  useEffect(() => {
    initEvents()
  }, [])

  return (
    <Layout>
      <TracksList />
    </Layout>
  )
} 