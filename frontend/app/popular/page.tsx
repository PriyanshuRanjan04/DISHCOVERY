'use client'

import { useEffect, useState } from 'react'
import { recipeAPI } from '@/lib/api'
import Link from 'next/link'
import { ChefHat, ArrowLeft, Loader2, Timer, Globe, Zap, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function PopularRecipesPage() {
    const [recipes, setRecipes] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const router = useRouter()

    useEffect(() => {
        const fetchAllPopular = async () => {
            try {
                // Fetching all 50 popular recipes
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/recipes/popular/all`)
                const data = await response.json()
                if (data.success) {
                    setRecipes(data.recipes)
                }
            } catch (err) {
                console.error('Failed to fetch popular recipes', err)
            } finally {
                setLoading(false)
            }
        }
        fetchAllPopular()
    }, [])

    const filteredRecipes = recipes.filter(r =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
                    <p className="text-gray-500 font-medium">Loading our global cookbook...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <Link
                    href="/"
                    className="inline-flex items-center text-gray-600 hover:text-primary mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>

                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                        World-Famous <span className="text-primary">Recipes</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        A curated collection of the 50 most iconic dishes from every corner of the globe.
                    </p>

                    <div className="max-w-lg mx-auto relative mt-8">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Filter by name or cuisine..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none focus:border-primary transition-all shadow-sm"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredRecipes.map((recipe) => (
                        <Link
                            key={recipe.id}
                            href={`/search?q=${encodeURIComponent(recipe.title)}&popularId=${recipe.id}`}
                            className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col"
                        >
                            <div className="h-56 relative overflow-hidden shrink-0">
                                <img
                                    src={recipe.image}
                                    alt={recipe.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-gray-700 shadow-sm flex items-center gap-1">
                                    <Timer className="w-3.5 h-3.5 text-primary" />
                                    {recipe.cooking_time} min
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                    <span className="text-white font-semibold text-sm">View Full Recipe →</span>
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider rounded-md">
                                        {recipe.cuisine}
                                    </span>
                                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${recipe.difficulty === 'easy' ? 'bg-green-100 text-green-600' :
                                            recipe.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                                                'bg-red-100 text-red-600'
                                        }`}>
                                        {recipe.difficulty}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                                    {recipe.title}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 flex-grow">
                                    {recipe.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredRecipes.length === 0 && (
                    <div className="text-center py-20">
                        <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No matching recipes found</h3>
                        <p className="text-gray-500">Try searching for a different cuisine or dish!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
