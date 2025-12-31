'use client'

import { Loader2, Search, Map, Calendar, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'

const MESSAGES = [
    "Exploring regional flavors...",
    "Discovering traditional dishes...",
    "Mapping cuisines to your taste...",
    "Sourcing authentic histories...",
    "Consulting local AI chefs...",
    "Peeking into festive kitchens..."
]

export default function ExplorerLoader() {
    const [msgIndex, setMsgIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setMsgIndex((prev) => (prev + 1) % MESSAGES.length)
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="relative mb-8">
                <div className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                Searching the World...
            </h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium transition-all duration-500">
                {MESSAGES[msgIndex]}
            </p>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 opacity-30">
                <div className="flex flex-col items-center gap-2">
                    <Map className="w-6 h-6" />
                    <div className="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Calendar className="w-6 h-6" />
                    <div className="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Search className="w-6 h-6" />
                    <div className="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Sparkles className="w-6 h-6" />
                    <div className="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
            </div>
        </div>
    )
}
