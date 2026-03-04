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
            className="w-full premium-btn py-3.5 hover:premium-btn-hover active:premium-btn-active disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
            {isLoading ? '準備中...' : 'Proプランにアップグレード'}
        </button>
    )
}
