'use client'

import Link from 'next/link'
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { ChefHat, Globe, History, Heart } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function Navbar() {
    const pathname = usePathname()

    const navLinks = [
        { name: 'Home', href: '/', icon: null },
        { name: 'Cuisine Explorer', href: '/blog', icon: Globe },
        { name: 'History', href: '/history', icon: History, protected: true },
        { name: 'Saved', href: '/saved', icon: Heart, protected: true },
    ]

    return (
        <nav className="border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Brand */}
                    <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity group">
                        <ChefHat className="w-8 h-8 text-primary group-hover:rotate-12 transition-transform" />
                        <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Dishcovery
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => {
                            const Icon = link.icon
                            const isActive = pathname === link.href

                            const content = (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`flex items-center gap-1.5 text-sm font-medium transition-all duration-200 py-2 border-b-2 ${isActive
                                        ? 'text-primary border-primary'
                                        : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-primary'
                                        }`}
                                >
                                    {Icon && <Icon className="w-4 h-4" />}
                                    {link.name}
                                </Link>
                            )

                            if (link.protected) {
                                return (
                                    <SignedIn key={link.name}>
                                        {content}
                                    </SignedIn>
                                )
                            }

                            return content
                        })}
                    </div>

                    {/* Right Side: Profile/Sign In */}
                    <div className="flex items-center space-x-4">
                        <SignedIn>
                            <UserButton
                                afterSignOutUrl="/"
                                appearance={{
                                    elements: {
                                        avatarBox: "w-9 h-9 border-2 border-primary/20 hover:border-primary/50 transition-colors"
                                    }
                                }}
                            />
                        </SignedIn>
                        <SignedOut>
                            <Link
                                href="/sign-in"
                                className="px-5 py-2 rounded-full bg-gradient-to-r from-primary to-accent text-white text-sm font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all"
                            >
                                Sign In
                            </Link>
                        </SignedOut>
                    </div>
                </div>
            </div>
        </nav>
    )
}
