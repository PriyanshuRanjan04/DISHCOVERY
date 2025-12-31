'use client'

import { useState, useEffect } from 'react'
import { Lightbulb, Sparkles, Coffee, Utensils } from 'lucide-react'

const TRIVIA = [
    { icon: "🧠", text: "Did you know? Tomatoes were once considered poisonous and grown only for decoration." },
    { icon: "🌶️", text: "Spicy food boosts metabolism and can release endorphins that make you feel happy!" },
    { icon: "🍝", text: "Pasta cooks faster in wider pans because more surface area is exposed to heat." },
    { icon: "🍯", text: "Honey never spoils. Archaeologists found edible honey in 3,000-year-old Egyptian tombs!" },
    { icon: "🍫", text: "Chocolate was so highly valued by the Aztecs that they used cocoa beans as currency." },
    { icon: "🍓", text: "Strawberries are the only fruit with seeds on the outside. A single berry has about 200 seeds." },
    { icon: "🍎", text: "Apples float because 25% of their volume is actually air!" },
    { icon: "🥔", text: "The first vegetable ever grown in space was a potato, aboard the Space Shuttle Columbia in 1995." },
    { icon: "🍋", text: "Believe it or not, lemons contain more sugar than strawberries!" },
    { icon: "🍕", text: "The most expensive pizza in the world costs $12,000 and takes 72 hours to make." },
]

export default function LoadingTrivia() {
    const [index, setIndex] = useState(0)
    const [fade, setFade] = useState(true)

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false)
            setTimeout(() => {
                setIndex((prev) => (prev + 1) % TRIVIA.length)
                setFade(true)
            }, 500) // Half second for fade out
        }, 5000) // Change every 5 seconds

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="max-w-md w-full mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-primary/10 shadow-xl relative overflow-hidden group">
                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-accent/5 rounded-full blur-xl group-hover:bg-accent/10 transition-colors" />

                <div className="relative space-y-6">
                    <div className="flex items-center justify-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-xl">
                            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                        </div>
                        <h4 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent uppercase tracking-wider">
                            Fun Food Facts 🍕
                        </h4>
                    </div>

                    <div className={`transition-all duration-500 min-h-[80px] flex flex-col items-center justify-center text-center px-4 ${fade ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'}`}>
                        <span className="text-4xl mb-4 block animate-bounce-slow">
                            {TRIVIA[index].icon}
                        </span>
                        <p className="text-gray-700 dark:text-gray-300 text-lg font-medium leading-relaxed">
                            {TRIVIA[index].text}
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="pt-4">
                        <div className="h-1 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                key={index}
                                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-&lsqb;5000ms&rsqb; ease-linear"
                                style={{ width: fade ? '100%' : '0%' }}
                            />
                        </div>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 text-center uppercase font-bold tracking-widest">
                            Our AI chefs are working... Enjoy the facts!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
