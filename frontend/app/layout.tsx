import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata: Metadata = {
    title: 'Dishcovery - Discover Delicious Recipes',
    description: 'AI-powered recipe discovery platform with personalized recommendations, ingredient substitutions, and cooking tips.',
    keywords: 'recipes, cooking, AI, food, ingredients, meal planning',
}

// Validate Clerk environment variables
const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Error message if Clerk keys are missing
    if (!publishableKey) {
        return (
            <html lang="en">
                <body className={`${inter.variable} ${outfit.variable} antialiased`}>
                    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
                        <h1 style={{ color: 'red' }}>Configuration Error</h1>
                        <p>Missing Clerk environment variable: <code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code></p>
                        <p>Please add this variable in your Vercel environment settings and redeploy.</p>
                    </div>
                </body>
            </html>
        );
    }

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
