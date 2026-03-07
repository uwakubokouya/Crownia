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
                    const targetPriceId = currentPlan === 'free'
                        ? process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID
                        : process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID;

                    const res = await fetch('/api/stripe/checkout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ priceId: targetPriceId || 'price_placeholder' })
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
            className="w-full premium-btn py-4 text-[11px] font-normal tracking-widest uppercase hover:premium-btn-hover active:premium-btn-active disabled:opacity-50 disabled:cursor-not-allowed border border-foreground bg-foreground text-white hover:bg-white hover:text-foreground transition-all"
        >
            {isLoading ? 'PREPARING...' : currentPlan === 'free' ? 'UPGRADE TO BASIC' : 'UPGRADE TO PRO'}
        </button>
    )
}
