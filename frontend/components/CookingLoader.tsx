'use client'

import { useState, useEffect } from 'react'
import { Flame, Utensils, Wind, Sparkles } from 'lucide-react'

const STAGES = [
    {
        icon: <Flame className="w-12 h-12 text-orange-500" />,
        text: "Heating the pan...",
        subtext: "Getting the perfect temperature for your dish",
        emoji: "🔥"
    },
    {
        icon: <Utensils className="w-12 h-12 text-primary" />,
        text: "Adding ingredients...",
        subtext: "Selecting the freshest spices and components",
        emoji: "🧄🍅"
    },
    {
        icon: <Wind className="w-12 h-12 text-blue-400" />,
        text: "Letting flavors blend...",
        subtext: "Simmering and perfecting the taste profile",
        emoji: "🥄☁️"
    }
]

export default function CookingLoader() {
    const [stage, setStage] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setStage((prev) => (prev + 1) % STAGES.length)
        }, 3000) // Change stage every 3 seconds

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="flex flex-col items-center justify-center space-y-8 py-10">
            <div className="relative">
                {/* Main Animation Container */}
                <div className="w-32 h-32 bg-white dark:bg-gray-800 rounded-full shadow-2xl flex items-center justify-center relative z-10 border-4 border-primary/20">
                    <div className="animate-bounce-slow">
                        {STAGES[stage].icon}
                    </div>

                    {/* Emojis floating around */}
                    <div className="absolute -top-2 -right-2 text-2xl animate-pulse">
                        {STAGES[stage].emoji.split('')[0]}
                    </div>
                </div>

                {/* Decorative Rings */}
                <div className="absolute inset-0 w-32 h-32 rounded-full border-4 border-dashed border-primary/30 animate-spin-slow" />
                <div className="absolute inset-0 w-32 h-32 rounded-full border-2 border-accent/20 animate-ping-slow" />
            </div>

            <div className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                    {STAGES[stage].text}
                    <span className="inline-block animate-bounce">.</span>
                    <span className="inline-block animate-bounce [animation-delay:0.2s]">.</span>
                    <span className="inline-block animate-bounce [animation-delay:0.4s]">.</span>
                </h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium italic">
                    {STAGES[stage].subtext}
                </p>
            </div>

            <style jsx>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }
                @keyframes ping-slow {
                    75%, 100% {
                        transform: scale(1.5);
                        opacity: 0;
                    }
                }
                .animate-ping-slow {
                    animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
            `}</style>
        </div>
    )
}
