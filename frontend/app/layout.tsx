import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata: Metadata = {
    title: 'Recipe AI - Discover Delicious Recipes',
    description: 'AI-powered recipe discovery platform with personalized recommendations, ingredient substitutions, and cooking tips.',
    keywords: 'recipes, cooking, AI, food, ingredients, meal planning',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider>
            <html lang="en" suppressHydrationWarning>
                <body className={`${inter.variable} ${outfit.variable} antialiased`}>
                    {children}
                </body>
            </html>
        </ClerkProvider>
    )
}
