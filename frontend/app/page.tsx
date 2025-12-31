'use client'

import Link from 'next/link'
import { Search, ChefHat, Sparkles, BookOpen, Utensils, IceCream } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { recipeAPI } from '@/lib/api'

export default function HomePage() {
    const [query, setQuery] = useState('')
    const [popularRecipes, setPopularRecipes] = useState<any[]>([])
    const router = useRouter()

    useEffect(() => {
        const fetchPopular = async () => {
            try {
                const data = await recipeAPI.getPopular()
                if (data.success) {
                    setPopularRecipes(data.recipes)
                }
            } catch (e) {
                console.error("Failed to fetch popular recipes", e)
            }
        }
        fetchPopular()
    }, [])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center space-y-6 fade-in">
                    <div className="flex justify-center">
                        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary/20 to-accent/20 px-4 py-2 rounded-full border border-primary/30">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                AI-Powered Recipe Discovery
                            </span>
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white">
                        Discover Your Next
                        <br />
                        <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                            Favorite Recipe
                        </span>
                    </h1>

                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Get personalized recipes from around the world, find ingredient alternatives,
                        and adjust portions with the power of AI
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-3xl mx-auto mt-12">
                        <form onSubmit={handleSearch} className="relative">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="What would you like to cook today? (e.g., 'Italian pasta for 4 people')"
                                className="w-full pl-16 pr-32 py-5 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all text-lg"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-xl hover:scale-105 transition-transform"
                            >
                                Search
                            </button>
                        </form>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
                    <FeatureCard
                        icon={<BookOpen className="w-8 h-8" />}
                        title="Stories Behind Dishes"
                        description="Uncover the deep history and cultural secrets behind dishes from every corner of the globe."
                    />
                    <FeatureCard
                        icon={<Utensils className="w-8 h-8" />}
                        title="Everyday Meals"
                        description="Reduce daily decision fatigue with quick, repeatable, and comforting home-cooked favorites."
                    />
                    <FeatureCard
                        icon={<IceCream className="w-8 h-8" />}
                        title="Desserts & Indulgence"
                        description="Add joy to your table with traditional sweets, global treats, and festive delicacies."
                    />
                </div>

                {/* Popular Recipes Section */}
                <div className="mt-24">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Popular Recipes
                        </h2>
                        <Link href="/popular" className="text-primary hover:text-accent transition-colors font-semibold">
                            View All →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {popularRecipes.length > 0 ? (
                            popularRecipes.map((recipe, i) => (
                                <Link key={i} href={`/search?q=${encodeURIComponent(recipe.title)}&popularId=${recipe.id}`}>
                                    <RecipeCard recipe={recipe} />
                                </Link>
                            ))
                        ) : (
                            // Show placeholders while loading
                            [1, 2, 3, 4].map((i) => <RecipeCardPlaceholder key={i} />)
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="glass p-8 rounded-2xl card-hover">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white mb-4">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{description}</p>
        </div>
    )
}

function RecipeCard({ recipe }: { recipe: any }) {
    return (
        <div className="glass rounded-2xl overflow-hidden card-hover cursor-pointer group h-full flex flex-col">
            <div className="h-48 relative overflow-hidden shrink-0">
                <img
                    src={recipe.image_url || recipe.image || `https://source.unsplash.com/featured/800x600?food,${recipe.title},${recipe.cuisine}`}
                    alt={recipe.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-semibold text-gray-700">
                    {recipe.cooking_time} min
                </div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-gray-900 dark:text-white mb-1 truncate">{recipe.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 flex-grow">{recipe.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-auto">
                    <span className="capitalize px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">{recipe.cuisine}</span>
                    <span className="capitalize px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">{recipe.difficulty}</span>
                </div>
            </div>
        </div>
    )
}

function RecipeCardPlaceholder() {
    return (
        <div className="glass rounded-2xl overflow-hidden card-hover cursor-pointer animate-pulse">
            <div className="h-48 bg-gray-200 dark:bg-gray-700" />
            <div className="p-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>
        </div>
    )
}
