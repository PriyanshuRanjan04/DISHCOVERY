'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { userAPI } from '@/lib/api'
import Link from 'next/link'
import { History, ArrowLeft, Loader2, Calendar, ChevronRight } from 'lucide-react'

export default function HistoryPage() {
    const { user, isLoaded } = useUser()
    const [history, setHistory] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user) return
            try {
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

        if (isLoaded) {
            if (!user) {
                setLoading(false) // Show message to sign in
            } else {
                fetchHistory()
            }
        }
    }, [user, isLoaded])

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

                <div className="flex items-center gap-3 mb-8">
                    <History className="w-8 h-8 text-primary" />
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Discovery History
                    </h1>
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
                            <div key={item._id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
                                <div>
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
                                <div className="text-gray-400 group-hover:text-primary transition-colors">
                                    <ChevronRight className="w-6 h-6" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
