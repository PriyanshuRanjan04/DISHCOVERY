'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { recipeAPI } from '@/lib/api'
import Link from 'next/link'
import { Timer, Users, ChefHat, ArrowLeft, Loader2 } from 'lucide-react'

export default function SearchPage() {
    const searchParams = useSearchParams()
    const query = searchParams.get('q')
    const [loading, setLoading] = useState(true)
    const [recipe, setRecipe] = useState<any>(null)
    const [error, setError] = useState('')
    const [statusMessage, setStatusMessage] = useState('Checking our cookbook...')

    useEffect(() => {
        let isStopped = false
        let pollTimer: NodeJS.Timeout

        const fetchRecipe = async () => {
            if (!query) return
            try {
                setLoading(true)
                const initialRes = await recipeAPI.search(query)

                if (initialRes.status === 'completed') {
                    setRecipe(initialRes.recipe)
                    setLoading(false)
                } else {
                    if (initialRes.message) setStatusMessage(initialRes.message)
                    // Start polling
                    const poll = async () => {
                        if (isStopped) return
                        try {
                            const statusRes = await recipeAPI.getStatus(query)
                            if (statusRes.status === 'completed') {
                                setRecipe(statusRes.recipe)
                                setLoading(false)
                            } else if (statusRes.status === 'error') {
                                setError(statusRes.error || 'Failed to generate recipe')
                                setLoading(false)
                            } else {
                                if (statusRes.status === 'processing') {
                                    setStatusMessage('Generative AI is crafting your recipe...')
                                }
                                // Continue polling
                                pollTimer = setTimeout(poll, 2000)
                            }
                        } catch (err) {
                            setError('Lost connection while cooking...')
                            setLoading(false)
                        }
                    }
                    poll()
                }
            } catch (err: any) {
                console.error("Search error:", err)
                setError(err.response?.data?.detail || err.message || 'Something went wrong.')
                setLoading(false)
            }
        }

        fetchRecipe()

        return () => {
            isStopped = true
            clearTimeout(pollTimer)
        }
    }, [query])

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                    {statusMessage}
                </h2>
                <p className="text-gray-500 mt-2 text-center max-w-sm px-4">
                    Our AI chef is crafting every detail. This usually takes 10-20 seconds.
                </p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="text-center space-y-4 max-w-lg">
                    <h2 className="text-2xl font-bold text-red-500">Oops!</h2>
                    <div className="bg-red-50 p-4 rounded-lg text-left">
                        <p className="text-red-800 font-mono text-sm break-all">{error}</p>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Please try again or check the console for more details.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                </div>
            </div>
        )
    }

    if (!recipe) return null

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/"
                    className="inline-flex items-center text-gray-600 hover:text-primary mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Search
                </Link>

                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
                    <div className="h-64 bg-gradient-to-r from-primary to-accent relative flex items-center justify-center">
                        <ChefHat className="w-24 h-24 text-white/20" />
                        <div className="absolute inset-0 bg-black/10" />
                        <h1 className="absolute bottom-6 left-8 text-4xl font-bold text-white shadow-sm">
                            {recipe.title}
                        </h1>
                    </div>

                    <div className="p-8">
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 italic">
                            {recipe.description}
                        </p>

                        <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-gray-100 dark:border-gray-700">
                            <div className="flex items-center text-gray-700 dark:text-gray-300">
                                <Timer className="w-5 h-5 mr-2 text-primary" />
                                <span className="font-semibold">{recipe.cooking_time} mins</span>
                            </div>
                            <div className="flex items-center text-gray-700 dark:text-gray-300">
                                <Users className="w-5 h-5 mr-2 text-primary" />
                                <span className="font-semibold">{recipe.servings} Servings</span>
                            </div>
                            {recipe.difficulty && (
                                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium capitalize">
                                    {recipe.difficulty}
                                </div>
                            )}
                            {recipe.cuisine && (
                                <div className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium capitalize">
                                    {recipe.cuisine}
                                </div>
                            )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-12">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                                    Ingredients
                                </h3>
                                <ul className="space-y-3">
                                    {recipe.ingredients.map((ing: any, i: number) => (
                                        <li key={i} className="flex items-start">
                                            <span className="w-2 h-2 mt-2 bg-primary rounded-full mr-3 shrink-0" />
                                            <span className="text-gray-700 dark:text-gray-300">
                                                <span className="font-semibold">{ing.quantity} {ing.unit}</span> {ing.name}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                    Instructions
                                </h3>
                                <ol className="space-y-6">
                                    {recipe.instructions.map((step: string, i: number) => (
                                        <li key={i} className="flex">
                                            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold mr-4">
                                                {i + 1}
                                            </span>
                                            <p className="text-gray-700 dark:text-gray-300 mt-1">
                                                {step}
                                            </p>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>

                        {recipe.tips && recipe.tips.length > 0 && (
                            <div className="mt-12 bg-yellow-50 dark:bg-yellow-900/10 p-6 rounded-xl border border-yellow-100 dark:border-yellow-900/30">
                                <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-500 mb-3">
                                    Chef's Tips
                                </h3>
                                <ul className="space-y-2">
                                    {recipe.tips.map((tip: string, i: number) => (
                                        <li key={i} className="flex items-start text-yellow-700 dark:text-yellow-400">
                                            <span className="mr-2">•</span>
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
