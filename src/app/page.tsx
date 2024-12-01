"use client"

import { TracksList } from "@/components/TracksList"
import { Layout } from "@/layout/Layout"
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