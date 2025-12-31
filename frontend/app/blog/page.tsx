'use client'

import { useEffect, useState } from 'react'
import { blogAPI } from '@/lib/api'
import Link from 'next/link'
import { BookOpen, Calendar, User, ArrowLeft, Loader2 } from 'lucide-react'

export default function BlogPage() {
    const [posts, setPosts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await blogAPI.getPosts()
                if (data.success) {
                    setPosts(data.posts)
                }
            } catch (err) {
                console.error(err)
                setError('Failed to load blog posts')
            } finally {
                setLoading(false)
            }
        }
        fetchPosts()
    }, [])

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

                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <BookOpen className="w-8 h-8 text-primary" />
                        Dishcovery Stories
                    </h1>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 py-10">{error}</div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                        <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No posts yet</h3>
                        <p className="text-gray-500">Check back later for culinary tips and updates!</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <div key={post._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center p-6">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center line-clamp-3">
                                        {post.title}
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(post.created_at).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <User className="w-3 h-3" />
                                            {post.author_name}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                                        {post.content}
                                    </p>
                                    <button className="text-primary font-semibold text-sm hover:underline">
                                        Read More →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
