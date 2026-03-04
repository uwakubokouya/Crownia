"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Calendar, DollarSign, Wine, FileText, Check } from 'lucide-react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'

export default function NewVisitPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [visitType, setVisitType] = useState('honshimei')
    const [amount, setAmount] = useState('')
    const [hasBottle, setHasBottle] = useState(false)
    const [memo, setMemo] = useState('')

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        setIsLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()

            const userId = user?.id || 'd1b54ac6-2244-4860-9dc4-177b9dcca967' // Fallback for dev

            if (!user && process.env.NODE_ENV !== 'development') {
                throw new Error('Not authenticated')
            }

            const { error } = await supabase
                .from('events')
                .insert([
                    {
                        user_id: userId,
                        customer_id: params.id,
                        type: 'visit',
                        amount: amount ? Number(amount) : 0,
                        occurred_at: new Date(date).toISOString(),
                        meta: {
                            visit_type: visitType,
                            has_bottle: hasBottle,
                            memo: memo.trim()
                        }
                    }
                ])

            if (error) throw error

            router.push(`/customers/${params.id}`)
        } catch (error) {
            console.error('Error adding event:', error)
            alert('登録に失敗しました。ログイン状態を確認してください。')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col min-h-[100dvh] bg-white pb-20">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center justify-between">
                <Link href={`/customers/${params.id}`} className="p-2 -ml-2 text-foreground hover:text-black transition-colors">
                    <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
                </Link>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium tracking-widest uppercase">New Visit</span>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8 p-6">
                <div>
                    <h1 className="text-2xl font-light tracking-wide text-foreground uppercase mb-2">来店履歴の登録</h1>
                    <p className="text-[11px] text-muted font-light tracking-widest">
                        お客様の来店に関する情報を記録します。
                    </p>
                </div>

                <div className="flex flex-col gap-6">
                    {/* Date */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] text-muted font-normal uppercase tracking-widest flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" strokeWidth={1.5} /> DATE / 来店日 <span className="text-rose-600">*</span>
                        </label>
                        <input
                            type="date"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-white border border-border rounded-none px-4 py-3 focus:outline-none focus:border-foreground text-foreground transition-all font-light text-[15px] tracking-wide"
                        />
                    </div>

                    {/* Visit Type */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] text-muted font-normal uppercase tracking-widest">
                            TYPE / 来店種類
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { id: 'free', label: 'フリー' },
                                { id: 'jounai', label: '場内' },
                                { id: 'honshimei', label: '本指名' },
                                { id: 'dohan', label: '同伴' },
                            ].map((vType) => (
                                <button
                                    key={vType.id}
                                    type="button"
                                    onClick={() => setVisitType(vType.id)}
                                    className={`py-3 px-4 border text-[13px] font-light tracking-wide transition-all ${visitType === vType.id
                                            ? 'border-foreground bg-foreground text-white'
                                            : 'border-border bg-white text-foreground hover:border-black'
                                        }`}
                                >
                                    {vType.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Amount */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] text-muted font-normal uppercase tracking-widest flex items-center gap-1.5">
                            <DollarSign className="w-3 h-3 text-muted" strokeWidth={1.5} /> AMOUNT / 会計額
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-3.5 text-muted font-light">¥</span>
                            <input
                                type="number"
                                min="0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="50000"
                                className="w-full bg-white border border-border rounded-none pl-10 pr-4 py-3 placeholder-muted focus:outline-none focus:border-foreground text-foreground transition-all font-light text-[15px] tracking-wide"
                            />
                        </div>
                    </div>

                    {/* Bottle / Toggle */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] text-muted font-normal uppercase tracking-widest flex items-center gap-1.5 mb-1">
                            <Wine className="w-3 h-3 text-rose-500" strokeWidth={1.5} /> BOTTLE / ボトルの有無
                        </label>
                        <button
                            type="button"
                            onClick={() => setHasBottle(!hasBottle)}
                            className={`flex items-center justify-between p-4 border transition-all ${hasBottle ? 'bg-rose-50 border-rose-200' : 'bg-white border-border hover:border-black'}`}
                        >
                            <span className={`text-[13px] font-light tracking-wide ${hasBottle ? 'text-rose-900' : 'text-foreground'}`}>ボトルのオーダーあり</span>
                            <div className={`w-5 h-5 border flex items-center justify-center transition-all ${hasBottle ? 'bg-rose-600 border-rose-600 text-white' : 'border-border bg-white'}`}>
                                {hasBottle && <Check className="w-3.5 h-3.5" strokeWidth={2} />}
                            </div>
                        </button>
                    </div>

                    {/* Memo */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] text-muted font-normal uppercase tracking-widest flex items-center gap-1.5">
                            <FileText className="w-3 h-3 text-muted" strokeWidth={1.5} /> MEMO / 来店メモ
                        </label>
                        <textarea
                            value={memo}
                            onChange={(e) => setMemo(e.target.value)}
                            placeholder="楽しかった話題、次回につながるキーワードなど..."
                            rows={4}
                            className="w-full bg-white border border-border rounded-none px-4 py-3 placeholder-muted focus:outline-none focus:border-foreground text-foreground transition-all font-light text-[13px] tracking-wide resize-none"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-4 w-full bg-foreground text-white border border-foreground py-4 flex items-center justify-center gap-2 font-normal tracking-widest uppercase text-xs transition-all hover:bg-[#222] active:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Save className="w-4 h-4" strokeWidth={1.5} />
                            SAVE VISIT / 履歴を保存する
                        </>
                    )}
                </button>
            </form>
        </div>
    )
}
