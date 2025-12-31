'use client'

import { useState } from 'react'
import { Sparkles, Loader2, RefreshCw, X, Check } from 'lucide-react'
import { recipeAPI } from '@/lib/api'

interface Alternative {
    name: string
    ratio: string
    notes: string
}

interface SubstitutionHandlerProps {
    ingredients: any[]
    recipeContext: string
    onSubstitute: (oldIngredient: string, newIngredient: Alternative) => void
}

export default function SubstitutionHandler({ ingredients, recipeContext, onSubstitute }: SubstitutionHandlerProps) {
    const [selectedIngredient, setSelectedIngredient] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const [alternatives, setAlternatives] = useState<Alternative[]>([])
    const [error, setError] = useState('')

    const getAlternatives = async (ingredient: string) => {
        if (!ingredient) return
        setLoading(true)
        setError('')
        setAlternatives([])
        try {
            const data = await recipeAPI.getAlternatives(ingredient, recipeContext)

            if (data.success && data.alternatives && data.alternatives.length > 0) {
                setAlternatives(data.alternatives)
            } else {
                setError('Our AI chefs couldn\'t find a suitable substitute for this specific ingredient in this recipe.')
            }
        } catch (err) {
            setError('Failed to fetch alternatives. Please try again later.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mt-8 bg-orange-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-primary/20">
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h4 className="font-bold text-gray-900 dark:text-white">Smart Substitutions</h4>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Missing something? AI can find the perfect alternative.
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
                <select
                    value={selectedIngredient}
                    onChange={(e) => setSelectedIngredient(e.target.value)}
                    className="flex-grow p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none text-sm"
                >
                    <option value="">Select an ingredient to swap...</option>
                    {ingredients.map((ing, i) => (
                        <option key={i} value={ing.name}>{ing.name}</option>
                    ))}
                </select>
                <button
                    onClick={() => getAlternatives(selectedIngredient)}
                    disabled={!selectedIngredient || loading}
                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-primary/90 transition-all flex items-center gap-2"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    Find Alternatives
                </button>
            </div>

            {error && (
                <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg flex items-center gap-2">
                    <X className="w-4 h-4" />
                    {error}
                </div>
            )}

            {alternatives.length > 0 && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-xs font-bold text-primary uppercase tracking-wider">Suggested Swaps:</p>
                    {alternatives.map((alt, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm group">
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-grow">
                                    <h5 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        {alt.name}
                                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                            Ratio: {alt.ratio}
                                        </span>
                                    </h5>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 uppercase text-[10px] font-semibold">Impact on dish:</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{alt.notes}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        onSubstitute(selectedIngredient, alt)
                                        setAlternatives([])
                                        setSelectedIngredient('')
                                    }}
                                    className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 transition-colors flex items-center gap-1 shadow-sm shrink-0"
                                >
                                    <Check className="w-3 h-3" />
                                    Swap Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
