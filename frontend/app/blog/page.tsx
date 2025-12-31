'use client'

import { useEffect, useState } from 'react'
import { explorerAPI } from '@/lib/api'
import Link from 'next/link'
import { Globe, Calendar, User, ArrowLeft, Loader2 } from 'lucide-react'

export default function BlogPage() {
    const [posts, setPosts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [selectedPost, setSelectedPost] = useState<any>(null)

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await explorerAPI.getPosts()
                if (data.success) {
                    setPosts(data.posts)
                }
            } catch (err) {
                console.error(err)
                setError('Failed to load blog stories')
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

                <div className="flex flex-col gap-2 mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
                        <Globe className="w-10 h-10 text-primary" />
                        Cuisine Explorer
                    </h1>
                    <p className="text-gray-500 text-lg">Discover dishes by Country, Indian States 🔥, and Festivals.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 py-10">{error}</div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                        <Globe className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No regional dishes yet</h3>
                        <p className="text-gray-500">Check back in a moment as our AI chefs curate today's regional highlights.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <div
                                key={post._id}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all group cursor-pointer border border-gray-100 dark:border-gray-700 flex flex-col"
                                onClick={() => setSelectedPost(post)}
                            >
                                <div className="h-56 overflow-hidden relative">
                                    <img
                                        src={post.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80'}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                                            {post.region}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 flex-grow flex flex-col">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm italic mb-4 line-clamp-2">
                                        "{post.intro || 'A fascinating journey into culinary history.'}"
                                    </p>
                                    <div className="mt-auto pt-4 border-t border-gray-50 dark:border-gray-700 flex items-center justify-between">
                                        <span className="text-xs font-semibold text-primary">READ FULL STORY →</span>
                                        <div className="flex gap-1">
                                            {post.tags?.slice(0, 2).map((tag: string) => (
                                                <span key={tag} className="text-[10px] bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-500">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Detailed Story Modal */}
                {selectedPost && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white dark:bg-gray-900 w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-y-auto shadow-2xl relative">
                            <button
                                onClick={() => setSelectedPost(null)}
                                className="absolute top-6 right-6 z-10 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-md"
                            >
                                <ArrowLeft className="w-6 h-6 rotate-90" />
                            </button>

                            <div className="h-80 relative">
                                <img
                                    src={selectedPost.image_url}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                                    <span className="text-primary-foreground/90 text-sm font-bold uppercase mb-2">
                                        {selectedPost.region} • {selectedPost.author_name}
                                    </span>
                                    <h2 className="text-4xl font-extrabold text-white">
                                        {selectedPost.title}
                                    </h2>
                                </div>
                            </div>

                            <div className="p-8 lg:p-12 space-y-12">
                                {/* Structure based on user template */}
                                <section>
                                    <p className="text-2xl text-gray-600 dark:text-gray-300 italic font-medium leading-relaxed border-l-4 border-primary pl-6">
                                        {selectedPost.intro}
                                    </p>
                                </section>

                                <section>
                                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-widest text-primary">
                                        Why This Matters
                                    </h4>
                                    <p className="text-gray-700 dark:text-gray-300 leading-loose text-lg">
                                        {selectedPost.why_it_matters}
                                    </p>
                                </section>

                                <section>
                                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-widest text-primary">
                                        The History
                                    </h4>
                                    <div className="text-gray-700 dark:text-gray-300 leading-loose text-lg space-y-4">
                                        {selectedPost.history_content.split('\n').map((para: string, i: number) => (
                                            <p key={i}>{para}</p>
                                        ))}
                                    </div>
                                </section>

                                <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 lg:p-10 border border-gray-100 dark:border-gray-700">
                                    <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center justify-between">
                                        <span>Making The Dish</span>
                                        <span className="text-sm font-normal text-gray-500">Serves 4 People</span>
                                    </h4>

                                    <div className="grid md:grid-cols-2 gap-12">
                                        <div>
                                            <h5 className="font-bold mb-4 text-primary">Ingredients</h5>
                                            <ul className="space-y-3">
                                                {selectedPost.recipe_ingredients?.map((ing: any, i: number) => (
                                                    <li key={i} className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-700 dark:text-gray-300">
                                                        <span>{ing.name}</span>
                                                        <span className="font-semibold">{ing.quantity} {ing.unit}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 className="font-bold mb-4 text-primary">Instructions</h5>
                                            <ol className="space-y-4">
                                                {selectedPost.recipe_instructions?.map((step: string, i: number) => (
                                                    <li key={i} className="flex gap-4 text-gray-700 dark:text-gray-300">
                                                        <span className="font-bold text-primary">{i + 1}.</span>
                                                        <span>{step}</span>
                                                    </li>
                                                ))}
                                            </ol>
                                        </div>
                                    </div>
                                </div>

                                <section>
                                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-widest text-primary">
                                        Tips & Variations
                                    </h4>
                                    <ul className="grid md:grid-cols-2 gap-4">
                                        {selectedPost.tips_variations?.map((tip: string, i: number) => (
                                            <li key={i} className="bg-primary/5 p-4 rounded-xl text-gray-700 dark:text-gray-300 text-sm">
                                                • {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </section>

                                <section className="text-center pt-10 border-t border-gray-100 dark:border-gray-700">
                                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 italic">
                                        {selectedPost.conclusion}
                                    </p>
                                    <div className="space-y-4">
                                        <h3 className="text-2xl font-bold">Try this recipe on Dishcovery</h3>
                                        <button
                                            onClick={() => setSelectedPost(null)}
                                            className="bg-primary text-white px-10 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-xl"
                                        >
                                            Explore More Flavors
                                        </button>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
