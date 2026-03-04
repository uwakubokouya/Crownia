'use client'

import { useState } from 'react'

export function UpgradeButton({ currentPlan }: { currentPlan: string }) {
    const [isLoading, setIsLoading] = useState(false)

    if (currentPlan === 'pro') return null

    return (
        <button
            disabled={isLoading}
            onClick={async () => {
                setIsLoading(true)
                try {
                    const res = await fetch('/api/stripe/checkout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_placeholder' })
                    })
                    const data = await res.json()
                    if (data.url) {
                        window.location.href = data.url
                    } else if (data.error) {
                        alert(`エラー: ${data.error}`)
                        setIsLoading(false)
                    } else {
                        alert('不明なエラーが発生しました')
                        setIsLoading(false)
                    }
                } catch (e: any) {
                    console.error(e)
                    alert(`通信エラー: ${e.message}`)
                    setIsLoading(false)
                }
            }}
            className="w-full bg-gradient-to-r from-primary to-rose-400 hover:from-primary/90 hover:to-rose-400/90 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-primary/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isLoading ? '準備中...' : 'Proプランにアップグレード 💖'}
        </button>
    )
}
