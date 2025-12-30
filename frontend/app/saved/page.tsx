'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { userAPI } from '@/lib/api'
import Link from 'next/link'
import { Heart, ArrowLeft, Loader2, Trash2, Timer, Users, ChefHat } from 'lucide-react'

export default function SavedPage() {
    const { user, isLoaded } = useUser()
    const [savedRecipes, setSavedRecipes] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSaved = async () => {
            if (!user) return
            try {
                const data = await userAPI.getSavedRecipes(user.id)
                if (data.success) {
                    setSavedRecipes(data.recipes)
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        if (isLoaded) {
            if (!user) {
                setLoading(false) // Show message to sign in
            } else {
                fetchSaved()
            }
        }
    }, [user, isLoaded])

    const handleDelete = async (recipeId: string, e: React.MouseEvent) => {
        e.preventDefault() // Prevent navigation if card is clickable
        if (!user || !confirm('Are you sure you want to remove this recipe?')) return

        try {
            await userAPI.deleteSavedRecipe(user.id, recipeId)
            setSavedRecipes(prev => prev.filter(r => r._id !== recipeId))
        } catch (err) {
            console.error('Failed to delete', err)
            alert('Failed to delete recipe')
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <Link
                    href="/"
                    className="inline-flex items-center text-gray-600 hover:text-primary mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>

                <div className="flex items-center gap-3 mb-8">
                    <Heart className="w-8 h-8 text-primary fill-primary" />
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Saved Recipes
                    </h1>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : !user ? (
                    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                        <p className="text-gray-600 mb-4">Please sign in to view your saved recipes.</p>
                        <Link href="/sign-in" className="text-primary font-semibold hover:underline">
                            Sign In
                        </Link>
                    </div>
                ) : savedRecipes.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                        <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No saved recipes yet</h3>
                        <p className="text-gray-500">Save recipes you like to cook them later!</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedRecipes.map((item) => {
                            const recipe = item.recipe_data;
                            return (
                                <div key={item._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group relative">
                                    <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative">
                                        <ChefHat className="w-16 h-16 text-primary/40" />
                                        <button
                                            onClick={(e) => handleDelete(item._id, e)}
                                            className="absolute top-3 right-3 p-2 bg-white/90 rounded-full text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                                            title="Remove"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                                            {recipe.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                                            {recipe.description || 'Delicious AI generated recipe.'}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Timer className="w-3 h-3" />
                                                {recipe.cooking_time}m
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Users className="w-3 h-3" />
                                                {recipe.servings} ppl
                                            </span>
                                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full capitalize">
                                                {recipe.difficulty}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
