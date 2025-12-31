'use client'

import React, { useState } from 'react'
import { Share2, Twitter, Copy, Check, MessageCircle } from 'lucide-react'

interface ShareButtonsProps {
    title: string
    url?: string
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false)
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy', err)
        }
    }

    const shareOnTwitter = () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this delicious recipe for ${title} on Dishcovery! 🍳`)}&url=${encodeURIComponent(shareUrl)}`
        window.open(twitterUrl, '_blank')
    }

    const shareOnWhatsApp = () => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`Check out this delicious recipe for ${title} on Dishcovery! 🍳 ${shareUrl}`)}`
        window.open(whatsappUrl, '_blank')
    }

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={shareOnWhatsApp}
                className="p-2 bg-[#25D366]/10 text-[#25D366] rounded-xl hover:bg-[#25D366]/20 transition-all"
                title="Share on WhatsApp"
            >
                <MessageCircle className="w-5 h-5 fill-current" />
            </button>

            <button
                onClick={shareOnTwitter}
                className="p-2 bg-[#1DA1F2]/10 text-[#1DA1F2] rounded-xl hover:bg-[#1DA1F2]/20 transition-all"
                title="Share on Twitter"
            >
                <Twitter className="w-5 h-5 fill-current" />
            </button>

            <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${copied
                        ? 'bg-green-50 border-green-200 text-green-600'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50'
                    }`}
                title="Copy Recipe Link"
            >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="text-sm font-semibold">{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
        </div>
    )
}
