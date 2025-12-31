'use client'

import Link from 'next/link'
import { Search, ChefHat, Sparkles, BookOpen, Utensils, IceCream, X, ExternalLink, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { recipeAPI } from '@/lib/api'

interface CollectionItem {
    title: string;
    tag: string;
    content: string;
    image: string;
    cultural_note?: string;
    recipe?: {
        time: string;
        ingredients: string[];
        steps: string[];
    };
}

const FEATURE_COLLECTIONS: Record<string, { title: string; description: string; items: CollectionItem[] }> = {
    stories: {
        title: "Stories Behind Dishes",
        description: "Uncover the deep history and cultural secrets behind dishes.",
        items: [
            // INDIA (1-5)
            {
                title: "Hyderabadi Biryani",
                tag: "India: Royal Heritage",
                content: "A regal blend of Mughlai and Iranian flavors, born in the kitchens of the Nizams. It's not just a dish; it's a slow-cooking art called 'Dum'.",
                image: "https://loremflickr.com/800/600/biryani,hyderabad/all",
                cultural_note: "Traditionally served at royal weddings, representing the pinnacle of Deccani cuisine."
            },
            {
                title: "Butter Chicken",
                tag: "India: Culinary Icon",
                content: "Accidentally created in Delhi's Moti Mahal, this dish was a way to use leftover tandoori chicken by simmering it in a rich tomato and butter gravy.",
                image: "https://loremflickr.com/800/600/butter,chicken,indian/all",
                cultural_note: "It's the dish that introduced Indian flavors to the global palate!"
            },
            {
                title: "Masala Dosa",
                tag: "India: Ancient Staple",
                content: "Originating in the temple kitchens of South India over 1,500 years ago. The crisp fermented crepe is a masterpiece of biology and heat.",
                image: "https://loremflickr.com/800/600/dosa,southindian/all",
                cultural_note: "Historically, it was a breakfast for travelers and pilgrims across Karnataka and Tamil Nadu."
            },
            {
                title: "Rogan Josh",
                tag: "India: Persian Roots",
                content: "A signature dish of Kashmiri cuisine, brought by the Mughals. Its deep red color comes from 'Ratan Jot' (Alkanet root) and Kashmiri chilies.",
                image: "https://loremflickr.com/800/600/lamb,curry,kashmir/all",
                cultural_note: "The name means 'Ghee Heat', reflecting the intense flavor development in slow-cooked mutton."
            },
            {
                title: "Mishti Doi",
                tag: "India: Sweet Bengal",
                content: "Bengali 'sweet yogurt' thickened through slow evaporation of milk and sweetened with palm jaggery, traditionally set in clay pots.",
                image: "https://loremflickr.com/800/600/yogurt,dessert,bengal/all",
                cultural_note: "The clay pot absorbs excess moisture, giving the yogurt its uniquely thick, creamy texture."
            },
            // ITALY (6-7)
            {
                title: "Pizza Margherita",
                tag: "Italy: Patriotic Dish",
                content: "Created by Raffaele Esposito in 1889 to honor Queen Margherita of Italy. Its colors represent the Italian flag: red, white, and green.",
                image: "https://loremflickr.com/800/600/pizza,margherita/all",
                cultural_note: "Authentic Neapolitan pizza must follow strict rules, including the type of tomatoes and oven used."
            },
            {
                title: "Lasagna",
                tag: "Italy: Ancient layers",
                content: "One of the oldest types of pasta, Lasagna dates back to ancient Rome. The modern layered version emerged in Naples during the Middle Ages.",
                image: "https://loremflickr.com/800/600/lasagna/all",
                cultural_note: "In Italy, lasagna is a Sunday family tradition, often prepared with a ragu that simmers for 6 hours."
            },
            // CHINA (8-10)
            {
                title: "Peking Duck",
                tag: "China: Imperial Feast",
                content: "A prestigious dish from Beijing that has been prepared since the Imperial era. Known for its thin, crisp skin and tender meat.",
                image: "https://loremflickr.com/800/600/peking,duck/all",
                cultural_note: "The duck is traditionally served in three stages: skin with sugar, meat with pancakes, and bones in a soup."
            },
            {
                title: "Mapo Tofu",
                tag: "China: Sichuan Heat",
                content: "Created by a pockmarked old woman ('Ma Po') in Chengdu during the 19th century. It defines the 'Ma-La' (Numb & Spicy) flavor profile.",
                image: "https://loremflickr.com/800/600/tofu,spicy,sichuan/all",
                cultural_note: "The numbing sensation comes from Sichuan peppercorns, which aren't actually peppers but berry husks."
            },
            {
                title: "Dim Sum",
                tag: "China: Tea Tradition",
                content: "Translated as 'Touch the heart', Dim Sum originated with travelers on the Silk Road who needed a snack following their tea ('Yum Cha').",
                image: "https://loremflickr.com/800/600/dimsum/all",
                cultural_note: "The rhythmic tapping of three fingers on the table is a traditional 'thank you' to the tea pourer."
            }
        ]
    },
    everyday: {
        title: "Everyday Meals",
        description: "Quick, repeatable, and comforting home-cooked favorites.",
        items: [
            // INDIA (1-5)
            {
                title: "Classic Dal Chawal",
                tag: "India: Soul Food",
                content: "The ultimate soul food. Tempered lentils served over fluffy white rice with a dollop of ghee.",
                image: "https://loremflickr.com/800/600/dal,rice/all",
                recipe: {
                    time: "20 min",
                    ingredients: ["Yellow Lentils", "Turmeric", "Cumin Seeds", "Garlic", "Ghee"],
                    steps: ["Boil lentils with turmeric", "Sauté cumin and garlic in ghee", "Pour tadka over dal"]
                }
            },
            {
                title: "Aloo Paratha",
                tag: "India: Hearty Breakfast",
                content: "Whole wheat flatbread stuffed with a spicy mashed potato filling. Perfect with curd and pickle.",
                image: "https://loremflickr.com/800/600/paratha,indian/all",
                recipe: {
                    time: "25 min",
                    ingredients: ["Wheat Flour", "Boiled Potatoes", "Green Chilies", "Coriander", "Butter"],
                    steps: ["Mash potatoes with spices", "Stuff in dough ball and roll", "Cook on tawa with ghee/butter"]
                }
            },
            {
                title: "Poha",
                tag: "India: Light & Zesty",
                content: "Flattened rice sautéed with onions, peanuts, and turmeric. A favorite light breakfast across Western India.",
                image: "https://loremflickr.com/800/600/poha,breakfast/all",
                recipe: {
                    time: "15 min",
                    ingredients: ["Flattened Rice", "Peanuts", "Onions", "Curry Leaves", "Lemon"],
                    steps: ["Wash poha and drain", "Sauté peanuts and onions", "Mix poha with turmeric and salt"]
                }
            },
            {
                title: "Kadhi Chawal",
                tag: "India: Tangy Comfort",
                content: "A thick yogurt-based gravy with gram flour fritters (pakoras), served with steaming rice.",
                image: "https://loremflickr.com/800/600/kadhi,rice/all",
                recipe: {
                    time: "35 min",
                    ingredients: ["Yogurt", "Gram Flour", "Ginger-Garlic", "Fenugreek Seeds", "Chilies"],
                    steps: ["Whisk yogurt and flour", "Cook on low heat until thick", "Add fried pakoras and tadka"]
                }
            },
            {
                title: "Bhindi Masala",
                tag: "India: Quick Stir-Fry",
                content: "Okra sautéed with onions and spices. A nutritious and quick meal for any working day.",
                image: "https://loremflickr.com/800/600/okra,curry/all",
                recipe: {
                    time: "20 min",
                    ingredients: ["Okra", "Onions", "Tomato", "Cumin", "Amchur Powder"],
                    steps: ["Dice okra and onions", "Sauté cumin and onions", "Toss okra with spices until crisp"]
                }
            },
            // MEXICO (6-7)
            {
                title: "Tacos al Pastor",
                tag: "Mexico: Street Classic",
                content: "Spit-roasted pork marinated in dried chilies and spices, served on small corn tortillas.",
                image: "https://loremflickr.com/800/600/tacos/all",
                recipe: {
                    time: "30 min",
                    ingredients: ["Thin Sliced Pork", "Achiote Paste", "Pineapple", "Cilantro", "Tortillas"],
                    steps: ["Marinate pork", "Sear in a hot pan", "Serve with diced pineapple and cilantro"]
                }
            },
            {
                title: "Guacamole & Chips",
                tag: "Mexico: Fresh Side",
                content: "Creamy avocado mash with lime, cilantro, and onions. The quintessential Mexican everyday snack.",
                image: "https://loremflickr.com/800/600/guacamole/all",
                recipe: {
                    time: "10 min",
                    ingredients: ["Ripe Avocados", "Lime", "Salt", "Cilantro", "Jalapeno"],
                    steps: ["Mash avocados roughly", "Fold in lime juice and salt", "Add finely chopped cilantro and onions"]
                }
            },
            // THAILAND (8-10)
            {
                title: "Pad Thai",
                tag: "Thailand: Stir-Fry Fun",
                content: "The national dish of Thailand. Rice noodles stir-fried with eggs, tofu, and a tangy tamarind sauce.",
                image: "https://loremflickr.com/800/600/padthai/all",
                recipe: {
                    time: "20 min",
                    ingredients: ["Rice Noodles", "Shrimp/Tofu", "Tamarind Paste", "Peanuts", "Bean Sprouts"],
                    steps: ["Soak noodles", "Sauté protein", "Toss noodles with tamarind and peanuts"]
                }
            },
            {
                title: "Green Curry",
                tag: "Thailand: Herbaceous",
                content: "A fragrant curry made with green chili paste, coconut milk, and basil. Spicy and creamy.",
                image: "https://loremflickr.com/800/600/green,curry/all",
                recipe: {
                    time: "25 min",
                    ingredients: ["Green Curry Paste", "Coconut Milk", "Bamboo Shoots", "Chicken/Tofu", "Basil"],
                    steps: ["Fry curry paste in oil", "Add coconut milk and protein", "Simmer with bamboo shoots and basil"]
                }
            },
            {
                title: "Tom Yum Soup",
                tag: "Thailand: Sour & Spicy",
                content: "A hot and sour clear soup flavored with lemongrass, galangal, and kaffir lime leaves.",
                image: "https://loremflickr.com/800/600/tom-yum,soup/all",
                recipe: {
                    time: "15 min",
                    ingredients: ["Shrimp/Mushrooms", "Lemongrass", "Lime Juice", "Fish Sauce", "Chilies"],
                    steps: ["Boil water with herbs", "Add protein/mushrooms", "Season with lime and fish sauce"]
                }
            }
        ]
    },
    desserts: {
        title: "Desserts",
        description: "Tradition sweets and global treats for moments of joy.",
        items: [
            // INDIA (1-5)
            {
                title: "Gulab Jamun",
                tag: "India: Festive Sweet",
                content: "Soft, golden-brown milk solids deep-fried and soaked in a fragrant saffron and cardamom syrup.",
                image: "https://loremflickr.com/800/600/gulabjamun,dessert/all",
                recipe: {
                    time: "40 min",
                    ingredients: ["Khoya (Milk Solids)", "All-purpose flour", "Sugar", "Cardamom", "Rose water"],
                    steps: ["Make a soft dough", "Fry small balls until golden", "Soak in hot syrup for 2 hours"]
                }
            },
            {
                title: "Rasgulla",
                tag: "India: Bengali Delight",
                content: "Spongy, white balls of chhena (cottage cheese) cooked in a clear sugar syrup until light and airy.",
                image: "https://loremflickr.com/800/600/rasgulla/all",
                recipe: {
                    time: "45 min",
                    ingredients: ["Cheena (Cottage Cheese)", "Sugar", "Water", "Cardamom"],
                    steps: ["Knead cheese until smooth", "Form small balls", "Boil in sugar syrup for 15 mins"]
                }
            },
            {
                title: "Jalebi",
                tag: "India: Crispy Rings",
                content: "Fermented batter deep-fried in pretzel-like shapes, then soaked directly in sugar syrup. Perfect with Rabri.",
                image: "https://loremflickr.com/800/600/jalebi,sweet/all",
                recipe: {
                    time: "30 min",
                    ingredients: ["Maida (Flour)", "Yogurt", "Sugar", "Saffron", "Oil"],
                    steps: ["Ferment batter", "Fry thin coils in hot oil", "Soak in saffron sugar syrup"]
                }
            },
            {
                title: "Gajar Ka Halwa",
                tag: "India: Winter Warmth",
                content: "A slow-cooked carrot pudding made with milk, sugar, and nuts. A winter staple in North India.",
                image: "https://loremflickr.com/800/600/carrot,halwa,indian/all",
                recipe: {
                    time: "50 min",
                    ingredients: ["Carrots", "Full cream milk", "Sugar", "Ghee", "Nuts"],
                    steps: ["Grate carrots", "Sauté in ghee", "Slow cook with milk until dry"]
                }
            },
            {
                title: "Kheer",
                tag: "India: Ancient Pudding",
                content: "A creamy rice pudding flavored with cardamom and garnished with almonds and pistachios.",
                image: "https://loremflickr.com/800/600/rice,pudding,indian/all",
                recipe: {
                    time: "40 min",
                    ingredients: ["Basmati Rice", "Milk", "Sugar", "Saffron", "Dry Fruits"],
                    steps: ["Boil rice in milk", "Slow cook until thickened", "Sweeten and add nuts"]
                }
            },
            // FRANCE (6-7)
            {
                title: "Macarons",
                tag: "France: Delicate Pastry",
                content: "Light, almond-based meringue cookies with a soft ganache or jam filling. A symbol of French elegance.",
                image: "https://loremflickr.com/800/600/macaron/all",
                recipe: {
                    time: "60 min",
                    ingredients: ["Almond Flour", "Egg Whites", "Powdered Sugar", "Butter", "Jam"],
                    steps: ["Fold flour into meringue", "Pipe small circles and rest", "Bake and sandwich with filling"]
                }
            },
            {
                title: "Crème Brûlée",
                tag: "France: Burnt Cream",
                content: "A rich custard base topped with a contrasting layer of hard caramel created by torching sugar.",
                image: "https://loremflickr.com/800/600/creme,brulee/all",
                recipe: {
                    time: "45 min",
                    ingredients: ["Heavy Cream", "Egg Yolks", "Vanilla Bean", "Sugar"],
                    steps: ["Bake custard in water bath", "Chill completely", "Burn sugar on top before serving"]
                }
            },
            // TURKEY (8-10)
            {
                title: "Baklava",
                tag: "Turkey: Honey Layers",
                content: "Layers of crisp phyllo pastry filled with chopped nuts and sweetened with honey or syrup.",
                image: "https://loremflickr.com/800/600/baklava/all",
                recipe: {
                    time: "60 min",
                    ingredients: ["Phyllo Dough", "Pistachios/Walnuts", "Butter", "Honey", "Sugar syrup"],
                    steps: ["Layer dough with butter", "Fill with crushed nuts", "Bake and drench in syrup"]
                }
            },
            {
                title: "Turkish Delight",
                tag: "Turkey: Lokum",
                content: "A gel-based confection made from starch and sugar, often flavored with rosewater or lemon.",
                image: "https://loremflickr.com/800/600/turkish,delight/all",
                recipe: {
                    time: "90 min",
                    ingredients: ["Sugar", "Cornstarch", "Rosewater", "Lemon Juice", "Pistachios"],
                    steps: ["Boil sugar and starch", "Cook until thick and clear", "Set in a tray and dust with sugar"]
                }
            },
            {
                title: "Kunafa",
                tag: "Turkey: Cheese Pastry",
                content: "A Middle Eastern cheese pastry soaked in sweet sugar syrup. Crunchy on the outside, gooey inside.",
                image: "https://loremflickr.com/800/600/kunafa/all",
                recipe: {
                    time: "40 min",
                    ingredients: ["Kataifi Dough", "Akkawi Cheese", "Sugar syrup", "Orange blossom water", "Pistachios"],
                    steps: ["Layer pastry and cheese", "Bake until golden", "Pour cold syrup on hot pastry"]
                }
            }
        ]
    }
}

export default function HomePage() {
    const [query, setQuery] = useState('')
    const [popularRecipes, setPopularRecipes] = useState<any[]>([])
    const [activeCollection, setActiveCollection] = useState<keyof typeof FEATURE_COLLECTIONS | null>(null)
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

                {/* Collection Modal */}
                {activeCollection && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in transition-all"
                        onClick={() => setActiveCollection(null)}
                    >
                        <div
                            className="bg-white dark:bg-gray-800 w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 sm:p-8 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
                                <div>
                                    <h2 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                                        {activeCollection === 'stories' && <BookOpen className="text-primary w-8 h-8" />}
                                        {activeCollection === 'everyday' && <Utensils className="text-primary w-8 h-8" />}
                                        {activeCollection === 'desserts' && <IceCream className="text-primary w-8 h-8" />}
                                        {FEATURE_COLLECTIONS[activeCollection].title}
                                    </h2>
                                    <p className="text-gray-500 dark:text-gray-400 font-medium">{FEATURE_COLLECTIONS[activeCollection].description}</p>
                                </div>
                                <button
                                    onClick={() => setActiveCollection(null)}
                                    className="p-3 rounded-2xl bg-white dark:bg-gray-700 shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-all text-gray-500 hover:text-red-500"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-12">
                                {FEATURE_COLLECTIONS[activeCollection].items.map((item, idx) => (
                                    <div key={idx} className="group grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                                        <div className="relative rounded-[2rem] overflow-hidden shadow-xl aspect-[4/3]">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                            <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur px-4 py-1.5 rounded-full text-xs font-black text-primary uppercase tracking-widest shadow-lg">
                                                {item.tag}
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">{item.title}</h3>
                                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg font-medium">{item.content}</p>
                                            </div>

                                            {item.cultural_note && (
                                                <div className="p-5 bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-400 rounded-2xl italic text-orange-800 dark:text-orange-200 font-medium">
                                                    " {item.cultural_note} "
                                                </div>
                                            )}

                                            {item.recipe && (
                                                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-3xl p-6 space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                            <ChefHat className="w-4 h-4" /> Quick Recipe
                                                        </span>
                                                        <span className="text-xs font-black text-primary bg-primary/10 px-3 py-1 rounded-lg flex items-center gap-1.5">
                                                            <Clock className="w-3.5 h-3.5" /> {item.recipe.time}
                                                        </span>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <div className="flex flex-wrap gap-2">
                                                            {item.recipe.ingredients.map(ing => (
                                                                <span key={ing} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-3 py-1 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300">
                                                                    {ing}
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <ol className="space-y-2">
                                                            {item.recipe.steps.map((step, sidx) => (
                                                                <li key={sidx} className="text-sm text-gray-600 dark:text-gray-400 flex gap-3 font-medium">
                                                                    <span className="text-primary font-bold">{sidx + 1}.</span> {step}
                                                                </li>
                                                            ))}
                                                        </ol>
                                                    </div>
                                                </div>
                                            )}

                                            <button
                                                onClick={() => router.push(`/search?q=${encodeURIComponent(item.title)}`)}
                                                className="inline-flex items-center gap-2 text-primary hover:text-accent font-black text-sm uppercase tracking-wider group/link transition-all"
                                            >
                                                Explore Full Recipe <ExternalLink className="w-4 h-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 text-center">
                                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">
                                    More daily updates in the Cuisine Explorer & Blog
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
                    <FeatureCard
                        icon={<BookOpen className="w-8 h-8" />}
                        title="Stories Behind Dishes"
                        description="Uncover the deep history and cultural secrets behind dishes from every corner of the globe."
                        onClick={() => setActiveCollection('stories')}
                    />
                    <FeatureCard
                        icon={<Utensils className="w-8 h-8" />}
                        title="Everyday Meals"
                        description="Reduce daily decision fatigue with quick, repeatable, and comforting home-cooked favorites."
                        onClick={() => setActiveCollection('everyday')}
                    />
                    <FeatureCard
                        icon={<IceCream className="w-8 h-8" />}
                        title="Desserts"
                        description="Tradition sweets and global treats for moments of delight."
                        onClick={() => setActiveCollection('desserts')}
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

function FeatureCard({ icon, title, description, onClick }: { icon: React.ReactNode; title: string; description: string; onClick?: () => void }) {
    return (
        <div
            className={`glass p-8 rounded-2xl card-hover ${onClick ? 'cursor-pointer hover:border-primary/50' : ''}`}
            onClick={onClick}
        >
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
                    src={recipe.image_url || recipe.image || `https://loremflickr.com/800/600/dish,food,${recipe.title.replace(/\s+/g, ',').toLowerCase()}`}
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
