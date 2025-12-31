'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Wait for mount to avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse" />
        )
    }

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-sm border border-gray-200/50 dark:border-gray-700/50"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            <div className="relative w-6 h-6">
                <Sun className={`w-6 h-6 absolute inset-0 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0`} />
                <Moon className={`w-6 h-6 absolute inset-0 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100`} />
            </div>
        </button>
    )
}
