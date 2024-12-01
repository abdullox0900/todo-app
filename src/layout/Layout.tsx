"use client"

import { MoonIcon, SunIcon } from '@/icons'
import { useEffect, useState } from 'react'

interface LayoutProps {
    children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
    const [mounted, setMounted] = useState(false)
    const [theme, setTheme] = useState<'light' | 'dark'>('light')

    // Initial theme setup
    useEffect(() => {
        // Check localStorage and system preference
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark'
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        const initialTheme = savedTheme || systemTheme

        // Apply theme
        document.documentElement.classList.remove('light', 'dark')
        document.documentElement.classList.add(initialTheme)
        setTheme(initialTheme)
        setMounted(true)
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark'

        // Remove both themes first
        document.documentElement.classList.remove('light', 'dark')
        // Add new theme
        document.documentElement.classList.add(newTheme)

        // Update state and localStorage
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)
    }

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-white dark:bg-[#191414]">
            <div className="fixed top-4 right-4 z-50">
                <button
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-[#282828] dark:hover:bg-[#323232] transition-colors"
                    onClick={toggleTheme}
                >
                    {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                </button>
            </div>
            <main>{children}</main>
        </div>
    )
} 