"use client"

import { MoonIcon, SunIcon } from '@/icons'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
    const [mounted, setMounted] = useState(false)
    const [theme, setTheme] = useState<'light' | 'dark'>('light')

    useEffect(() => {
        setMounted(true)
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' ||
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

        setTheme(savedTheme)
        document.body.classList.add(savedTheme)
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark'
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)
        document.body.classList.remove(theme)
        document.body.classList.add(newTheme)
    }

    if (!mounted) {
        return null
    }

    return (
        <div className="fixed top-4 right-4">
            <button
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                onClick={toggleTheme}
            >
                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
        </div>
    )
} 