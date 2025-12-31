'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { userAPI } from '@/lib/api'
import Link from 'next/link'
import { History, ArrowLeft, Loader2, Calendar, ChevronRight, Trash2 } from 'lucide-react'

export default function HistoryPage() {
    const { user, isLoaded } = useUser()
    const [history, setHistory] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchHistory = async () => {
        if (!user) return
        try {
            setLoading(true)
            const data = await userAPI.getHistory(user.id)
            if (data.success) {
                setHistory(data.history)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isLoaded) {
            if (!user) {
                setLoading(false)
            } else {
                fetchHistory()
            }
        }
    }, [user, isLoaded])

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.preventDefault() // Prevent link navigation
        e.stopPropagation()
        if (!user || !window.confirm("Are you sure you want to delete this memory? It can't be restored.")) return

        try {
            const res = await userAPI.deleteHistoryItem(user.id, id)
            if (res.success) {
                setHistory(history.filter(item => item.id !== id))
            }
        } catch (err) {
            alert("Failed to delete history item")
        }
    }

    const handleClearAll = async () => {
        if (!user || !window.confirm("Are you sure you want to clear your ENTIRE discovery history? This cannot be undone.")) return

        try {
            const res = await userAPI.clearHistory(user.id)
            if (res.success) {
                setHistory([])
            }
        } catch (err) {
            alert("Failed to clear history")
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/"
                    className="inline-flex items-center text-gray-600 hover:text-primary mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <History className="w-8 h-8 text-primary" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Discovery History
                        </h1>
                    </div>
                    {history.length > 0 && (
                        <button
                            onClick={handleClearAll}
                            className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all font-semibold text-sm border border-red-100 dark:border-red-900/30"
                        >
                            <Trash2 className="w-4 h-4" />
                            Clear All History
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : !user ? (
                    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                        <p className="text-gray-600 mb-4">Please sign in to view your history.</p>
                        <Link href="/sign-in" className="text-primary font-semibold hover:underline">
                            Sign In
                        </Link>
                    </div>
                ) : history.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                        <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No history yet</h3>
                        <p className="text-gray-500">Your generated recipes will appear here.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {history.map((item) => (
                            <Link
                                key={item.id}
                                href={`/search?q=${encodeURIComponent(item.query)}`}
                                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group relative"
                            >
                                <div className="flex-grow pr-8">
                                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(item.searched_at).toLocaleDateString()}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                        {item.recipe_generated.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        Search Query: "{item.query}"
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <button
                                        onClick={(e) => handleDelete(e, item.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                        title="Delete from history"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                    <div className="text-gray-400 group-hover:text-primary transition-colors">
                                        <ChevronRight className="w-6 h-6" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
