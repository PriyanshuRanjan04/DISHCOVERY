import Link from 'next/link'
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { Search, ChefHat, BookOpen, History, Heart, Sparkles } from 'lucide-react'

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Navigation */}
            <nav className="border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <ChefHat className="w-8 h-8 text-primary" />
                            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                Recipe AI
                            </span>
                        </div>

                        <div className="hidden md:flex items-center space-x-6">
                            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
                                Home
                            </Link>
                            <Link href="/blog" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors flex items-center gap-1">
                                <BookOpen className="w-4 h-4" />
                                Blog
                            </Link>
                            <SignedIn>
                                <Link href="/history" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors flex items-center gap-1">
                                    <History className="w-4 h-4" />
                                    History
                                </Link>
                                <Link href="/saved" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors flex items-center gap-1">
                                    <Heart className="w-4 h-4" />
                                    Saved
                                </Link>
                            </SignedIn>
                        </div>

                        <div className="flex items-center space-x-4">
                            <SignedIn>
                                <UserButton afterSignOutUrl="/" />
                            </SignedIn>
                            <SignedOut>
                                <Link
                                    href="/sign-in"
                                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-accent text-white font-semibold hover:scale-105 transition-transform"
                                >
                                    Sign In
                                </Link>
                            </SignedOut>
                        </div>
                    </div>
                </div>
            </nav>

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
                        <div className="relative">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                            <input
                                type="text"
                                placeholder="What would you like to cook today? (e.g., 'Italian pasta for 4 people')"
                                className="w-full pl-16 pr-6 py-5 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all text-lg"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-xl hover:scale-105 transition-transform">
                                Search
                            </button>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
                    <FeatureCard
                        icon={<Sparkles className="w-8 h-8" />}
                        title="AI-Generated Recipes"
                        description="Get personalized recipes from any cuisine, tailored to your preferences"
                    />
                    <FeatureCard
                        icon={<Search className="w-8 h-8" />}
                        title="Smart Substitutions"
                        description="Missing an ingredient? Get intelligent alternatives that work"
                    />
                    <FeatureCard
                        icon={<ChefHat className="w-8 h-8" />}
                        title="Portion Control"
                        description="Adjust recipes for any number of servings with accurate measurements"
                    />
                </div>

                {/* Random Food Display Placeholder */}
                <div className="mt-24">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Popular Recipes
                        </h2>
                        <button className="text-primary hover:text-accent transition-colors font-semibold">
                            View All →
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <RecipeCardPlaceholder key={i} />
                        ))}
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

function RecipeCardPlaceholder() {
    return (
        <div className="glass rounded-2xl overflow-hidden card-hover cursor-pointer">
            <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <ChefHat className="w-16 h-16 text-primary/40" />
            </div>
            <div className="p-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Recipe Name</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Click search to discover recipes!</p>
            </div>
        </div>
    )
}
