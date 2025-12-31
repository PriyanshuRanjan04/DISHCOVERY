'use client'

import { useState, useEffect } from 'react'
import { explorerAPI } from '@/lib/api'
import Link from 'next/link'
import { Globe, Calendar, User, ArrowLeft, Loader2, Search, Map, Sparkles, X, ChevronRight, Bookmark } from 'lucide-react'
import { PdfExport } from '@/components/PdfExport'
import { ShareButtons } from '@/components/ShareButtons'
import ExplorerLoader from '@/components/ExplorerLoader'

import LoadingTrivia from '@/components/LoadingTrivia'

const TASTE_CHIPS = [
    { label: "🌶️ Spicy", value: "spicy" },
    { label: "🍬 Sweet", value: "sweet" },
    { label: "🧂 Savory", value: "savory" },
    { label: "🥥 Coconut", value: "coconut" },
    { label: "🧀 Cheesy", value: "cheesy" },
    { label: "🥗 Healthy", value: "healthy" }
]

const SUGGESTED_COUNTRIES = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
    "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
    "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
    "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica",
    "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
    "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon",
    "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guyana", "Haiti",
    "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
    "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo", "Kuwait",
    "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
    "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico",
    "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru",
    "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan",
    "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania",
    "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal",
    "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan",
    "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania",
    "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda",
    "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
    "Yemen", "Zambia", "Zimbabwe"
]

const SUGGESTED_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
]

const SUGGESTED_FESTIVALS = [
    "Diwali", "Eid al-Fitr", "Eid al-Adha", "Holi", "Christmas", "Hanukkah", "Lunar New Year", "Thanksgiving", "Ramadan", "Easter",
    "Ganesh Chaturthi", "Durga Puja", "Navratri", "Pongal", "Onam", "Baisakhi", "Bihu", "Makar Sankranti", "Raksha Bandhan", "Janmashtami",
    "Oktoberfest", "Carnival", "Dia de los Muertos", "Saint Patrick's Day", "Basni", "Mardi Gras", "Songkran", "Loy Krathong", "Vesak", "Diwali",
    "Gothic Festival", "Dragon Boat Festival", "Mid-Autumn Festival", "Sechseläuten", "Fasching", "La Tomatina", "Burning Man", "Coachella", "Glastonbury", "Inti Raymi",
    "Up Helly Aa", "Hogmanay", "Grito de Dolores", "Kwanzaa", "Winter Solstice", "Summer Solstice", "Beltane", "Samhain", "Lughnasadh", "Imbolc"
]

export default function CuisineExplorerPage() {
    // Featured Posts state
    const [posts, setPosts] = useState<any[]>([])
    const [loadingFeatured, setLoadingFeatured] = useState(true)
    const [selectedPost, setSelectedPost] = useState<any>(null)

    // Exploration state
    const [isExploring, setIsExploring] = useState(false)
    const [searchResults, setSearchResults] = useState<any[] | null>(null)
    const [error, setError] = useState('')

    // Filter state
    const [country, setCountry] = useState('')
    const [indianState, setIndianState] = useState('')
    const [festival, setFestival] = useState('')
    const [selectedTastes, setSelectedTastes] = useState<string[]>([])
    const [freeQuery, setFreeQuery] = useState('')
    const [diet, setDiet] = useState<'Veg' | 'Non-Veg' | ''>('')

    useEffect(() => {
        fetchFeaturedPosts()
    }, [])

    const fetchFeaturedPosts = async () => {
        try {
            setLoadingFeatured(true)
            const data = await explorerAPI.getPosts()
            if (data.success) {
                setPosts(data.posts)
            }
        } catch (err) {
            console.error("Failed to fetch posts:", err)
            setError('Failed to load featured stories')
        } finally {
            setLoadingFeatured(false)
        }
    }

    const toggleTaste = (taste: string) => {
        setSelectedTastes(prev =>
            prev.includes(taste)
                ? prev.filter(t => t !== taste)
                : [...prev, taste]
        )
    }

    const handleExplore = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()

        // Ensure at least one filter is set
        if (!country && !indianState && !festival && selectedTastes.length === 0 && !freeQuery && !diet) {
            return
        }

        try {
            setIsExploring(true)
            setError('')

            const params = {
                country: country || undefined,
                state: indianState || undefined,
                festival: festival || undefined,
                taste: selectedTastes.join(', ') || undefined,
                query: freeQuery || undefined,
                diet: diet || undefined
            }

            const data = await explorerAPI.explore(params)
            if (data.success) {
                setSearchResults(data.results)
            }
        } catch (err: any) {
            console.error("Exploration error:", err)
            setError(err.response?.data?.detail || 'Discovery failed. Please try again.')
        } finally {
            setIsExploring(false)
        }
    }

    const clearFilters = () => {
        setCountry('')
        setIndianState('')
        setFestival('')
        setSelectedTastes([])
        setFreeQuery('')
        setDiet('')
        setSearchResults(null)
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
            {/* Header / Hero */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 pt-12 pb-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1.5" />
                        Back to Home
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-2.5 rounded-2xl">
                                    <Globe className="w-8 h-8 text-primary" />
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
                                    Cuisine <span className="text-primary">Explorer</span>
                                </h1>
                            </div>
                            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-4xl leading-relaxed font-medium">
                                Discover what the world cooks country by country, state by state, and festival by festival.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Smart Dashboard */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
                <form onSubmit={handleExplore} className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 lg:p-8 border border-gray-100 dark:border-gray-700/50 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Geography */}
                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                <Map className="w-4 h-4 text-primary" />
                                Geography
                            </label>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    list="country-list"
                                    placeholder="Enter Country (e.g. Italy, Japan)"
                                    className="w-full bg-gray-50 dark:bg-gray-900/50 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary transition-all"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                />
                                <datalist id="country-list">
                                    {SUGGESTED_COUNTRIES.map(c => <option key={c} value={c} />)}
                                </datalist>

                                <input
                                    type="text"
                                    list="state-list"
                                    placeholder="Enter Indian State (e.g. Kerala)"
                                    className="w-full bg-gray-50 dark:bg-gray-900/50 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary transition-all"
                                    value={indianState}
                                    onChange={(e) => setIndianState(e.target.value)}
                                />
                                <datalist id="state-list">
                                    {SUGGESTED_STATES.map(s => <option key={s} value={s} />)}
                                </datalist>
                            </div>
                        </div>

                        {/* Culture & Festivals */}
                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                <Calendar className="w-4 h-4 text-primary" />
                                Occasion
                            </label>
                            <input
                                type="text"
                                list="festival-list"
                                placeholder="Festival (e.g. Diwali, Holi)"
                                className="w-full bg-gray-50 dark:bg-gray-900/50 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary transition-all"
                                value={festival}
                                onChange={(e) => setFestival(e.target.value)}
                            />
                            <datalist id="festival-list">
                                {SUGGESTED_FESTIVALS.map(f => <option key={f} value={f} />)}
                            </datalist>
                            <p className="text-xs text-gray-400 italic">Example: Eid, Christmas, Pongal, Lunar New Year</p>
                        </div>

                        {/* Free Text Search */}
                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                <Sparkles className="w-4 h-4 text-primary" />
                                AI Insight
                            </label>
                            <textarea
                                placeholder="Describe anything (e.g. Healthy breakfast with eggs)"
                                rows={2}
                                className="w-full bg-gray-50 dark:bg-gray-900/50 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary transition-all resize-none"
                                value={freeQuery}
                                onChange={(e) => setFreeQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Filters Layout: Taste Profile (Left) & Dietary Preference (Right) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                        {/* Taste Profile (Left) */}
                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                Explore by Taste
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {TASTE_CHIPS.map((chip) => (
                                    <button
                                        key={chip.value}
                                        type="button"
                                        onClick={() => toggleTaste(chip.value)}
                                        className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${selectedTastes.includes(chip.value)
                                            ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                                            : 'bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                            }`}
                                    >
                                        {chip.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Dietary Preference (Right) */}
                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                Dietary Preference
                            </label>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setDiet(diet === 'Veg' ? '' : 'Veg')}
                                    className={`relative flex items-center justify-center gap-2 max-w-[140px] w-full py-3 rounded-2xl text-xs font-black transition-all duration-300 border-2 ${diet === 'Veg'
                                        ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/20 scale-105'
                                        : 'bg-gray-50 dark:bg-gray-900/50 border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <span className={`w-2 h-2 rounded-full ${diet === 'Veg' ? 'bg-white' : 'bg-green-500'}`} />
                                    VEG
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDiet(diet === 'Non-Veg' ? '' : 'Non-Veg')}
                                    className={`relative flex items-center justify-center gap-2 max-w-[140px] w-full py-3 rounded-2xl text-xs font-black transition-all duration-300 border-2 ${diet === 'Non-Veg'
                                        ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20 scale-105'
                                        : 'bg-gray-50 dark:bg-gray-900/50 border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <span className={`w-2 h-2 rounded-full ${diet === 'Non-Veg' ? 'bg-white' : 'bg-red-500'}`} />
                                    NON-VEG
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={isExploring}
                            className="flex-1 bg-gradient-to-r from-primary to-accent text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isExploring ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    <Search className="w-6 h-6" />
                                    START SMART EXPLORATION
                                </>
                            )}
                        </button>
                        {(country || indianState || festival || selectedTastes.length > 0 || freeQuery || searchResults) && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="px-8 py-4 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                            >
                                <X className="w-5 h-5" />
                                CLEAR
                            </button>
                        )}
                    </div>
                </form>

                {/* Loading Trivia Section */}
                {!isExploring && !searchResults && (
                    <div className="flex justify-center mt-12 px-4">
                        <div className="max-w-2xl w-full text-center space-y-4">
                            <h3 className="text-gray-400 dark:text-gray-500 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                Pro Tip: Pick from our smart lists or type your own!
                            </h3>
                            <LoadingTrivia />
                        </div>
                    </div>
                )}
            </div>

            {/* Results Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                {isExploring ? (
                    <ExplorerLoader />
                ) : error ? (
                    <div className="text-center py-20">
                        <div className="inline-flex p-4 bg-red-50 dark:bg-red-900/10 rounded-full mb-4">
                            <X className="w-12 h-12 text-red-500" />
                        </div>
                        <p className="text-xl font-bold text-red-500">{error}</p>
                        <button onClick={handleExplore} className="mt-4 text-primary font-bold underline">Try Again</button>
                    </div>
                ) : searchResults ? (
                    <div className="space-y-12 animate-in fade-in duration-700">
                        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-6">
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                                <Sparkles className="w-8 h-8 text-primary" />
                                AI Discovery Results
                            </h2>
                            <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest">
                                {searchResults.length} Dishes Found
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {searchResults.map((result, i) => (
                                <div key={i} className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700/50 shadow-lg hover:shadow-2xl transition-all group flex flex-col h-full">
                                    <div className="h-56 relative overflow-hidden">
                                        <img
                                            src={result.image_url}
                                            alt={result.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-primary">
                                            {result.region}
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-4 flex-1 flex flex-col">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                            {result.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 italic">
                                            {result.taste_profile}
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">
                                            {result.cultural_context}
                                        </p>

                                        <div className="pt-4 mt-auto">
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {result.highlights?.map((tag: string, j: number) => (
                                                    <span key={j} className="text-[10px] font-bold uppercase tracking-tight bg-gray-50 dark:bg-gray-900 px-2 py-1 rounded-md text-gray-500">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            <Link
                                                href={`/search?q=${encodeURIComponent(result.title.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '').trim())}`}
                                                className="w-full py-3 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all group/btn"
                                            >
                                                Get Recipe
                                                <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-12">
                        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-6">
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                                <Bookmark className="w-8 h-8 text-primary" />
                                Featured Discoveries
                            </h2>
                        </div>
                        {loadingFeatured ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-96 rounded-3xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
                                ))}
                            </div>
                        ) : posts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {posts.map((post) => (
                                    <div
                                        key={post._id}
                                        onClick={() => setSelectedPost(post)}
                                        className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700/50 shadow-lg hover:shadow-2xl transition-all cursor-pointer group"
                                    >
                                        <div className="h-64 relative overflow-hidden">
                                            <img
                                                src={post.image_url}
                                                alt={post.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                                <span className="text-[10px] font-bold uppercase bg-primary px-2 py-0.5 rounded mr-2">
                                                    {post.region}
                                                </span>
                                                <h3 className="text-xl font-bold mt-2 font-serif">{post.title}</h3>
                                            </div>
                                        </div>
                                        <div className="p-6 space-y-3">
                                            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                                                {post.intro}
                                            </p>
                                            <div className="flex items-center text-xs text-gray-400 gap-4 pt-2">
                                                <span className="flex items-center gap-1">
                                                    <User className="w-3 h-3" />
                                                    {post.author_name}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                                <Globe className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No regional dishes yet</h3>
                                <p className="text-gray-500 text-lg">Start an exploration above!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Detailed Story Modal (Legacy Support for Featured Posts) */}
            {selectedPost && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div id="explorer-content" className="bg-white dark:bg-gray-900 w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-y-auto shadow-2xl relative">
                        <button
                            onClick={() => setSelectedPost(null)}
                            className="absolute top-6 right-6 z-10 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-md no-export"
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
                            <div className="flex flex-wrap items-center justify-between gap-6 no-export border-b border-gray-100 dark:border-gray-800 pb-8">
                                <ShareButtons title={selectedPost.title} />
                                <PdfExport
                                    recipe={{
                                        title: selectedPost.title,
                                        description: selectedPost.intro,
                                        ingredients: selectedPost.recipe_ingredients,
                                        instructions: selectedPost.recipe_instructions
                                    }}
                                    elementId="explorer-content"
                                />
                            </div>

                            <section>
                                <p className="text-2xl text-gray-600 dark:text-gray-300 italic font-medium leading-relaxed border-l-4 border-primary pl-6">
                                    {selectedPost.intro}
                                </p>
                            </section>

                            <section className="space-y-6">
                                <h4 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                    <span className="w-8 h-1 bg-primary rounded-full" />
                                    Why it Matters
                                </h4>
                                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {selectedPost.why_it_matters}
                                </p>
                            </section>

                            <section className="space-y-6">
                                <h4 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                    <span className="w-8 h-1 bg-primary rounded-full" />
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
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
