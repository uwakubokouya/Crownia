"use client"

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, DollarSign, Loader2, Wine, Trash2, Edit3, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'

export default function CustomerHistoryPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const resolvedParams = use(params)
    const [events, setEvents] = useState<any[]>([])
    const [customer, setCustomer] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // Fetch customer name
                const { data: customerData, error: customerError } = await supabase
                    .from('customers')
                    .select('display_name')
                    .eq('id', resolvedParams.id)
                    .single()

                if (customerError) throw customerError
                setCustomer(customerData)

                // Fetch events
                const { data: eventsData, error: eventsError } = await supabase
                    .from('events')
                    .select('*')
                    .eq('customer_id', resolvedParams.id)
                    .eq('type', 'visit')
                    .order('occurred_at', { ascending: false })

                if (eventsError) throw eventsError
                setEvents(eventsData || [])
            } catch (err) {
                console.error('Error fetching history:', err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchHistory()
    }, [resolvedParams.id, supabase])

    const handleDeleteEvent = async (eventId: string) => {
        if (!confirm('この来店記録を削除しますか？\n（この操作は取り消せません）')) return

        try {
            const { error } = await supabase
                .from('events')
                .delete()
                .eq('id', eventId)

            if (error) throw error
            setEvents(prev => prev.filter(e => e.id !== eventId))
        } catch (error) {
            console.error('Error deleting event:', error)
            alert('削除に失敗しました。')
        }
    }

    const formatVisitType = (type: string) => {
        const types: Record<string, string> = {
            'free': 'フリー',
            'jounai': '場内',
            'honshimei': '本指名',
            'dohan': '同伴'
        }
        return types[type] || type
    }

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-[100dvh] bg-white items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-muted" />
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-[100dvh] bg-white pb-20">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center justify-between">
                <Link href={`/customers/${resolvedParams.id}`} className="p-2 -ml-2 text-foreground hover:text-black transition-colors">
                    <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
                </Link>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium tracking-widest uppercase text-foreground">Visit History</span>
                </div>
            </header>

            <div className="flex flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-light tracking-wide text-foreground uppercase mb-2">来店履歴</h1>
                    <p className="text-[11px] text-muted font-light tracking-widest">
                        {customer?.display_name} さんの過去の来店記録一覧です。
                    </p>
                </div>

                {/* Add new button */}
                <Link
                    href={`/customers/${resolvedParams.id}/events/new`}
                    className="w-full bg-foreground text-white border border-foreground pt-4 pb-3 flex items-center justify-center gap-2 font-normal tracking-widest uppercase text-[11px] transition-all hover:bg-[#222] active:bg-black active:scale-[0.99] shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] mb-4"
                >
                    <Edit3 className="w-3.5 h-3.5" strokeWidth={1.5} />
                    ADD VISIT / 新規来店を記録
                </Link>

                {events.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center border border-dashed border-border p-6 bg-zinc-50/50 mt-4">
                        <Calendar className="w-8 h-8 text-muted mb-4 opacity-50" strokeWidth={1} />
                        <p className="text-muted tracking-widest font-light text-[11px] uppercase">No Visit History Found</p>
                        <p className="text-[10px] text-muted/70 mt-2">まだ来店記録が存在しません</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {events.map((event) => (
                            <div key={event.id} className="border border-border bg-white flex flex-col group relative">
                                {/* Header / Date & Type */}
                                <div className="border-b border-border p-4 flex items-center justify-between bg-zinc-50/30">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 border border-border bg-white flex flex-col items-center justify-center">
                                            <span className="text-[8px] font-normal uppercase tracking-widest text-muted -mb-1">
                                                {new Date(event.occurred_at).toLocaleString('en-US', { month: 'short' })}
                                            </span>
                                            <span className="text-[14px] font-light text-foreground">
                                                {new Date(event.occurred_at).getDate()}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[12px] font-light text-foreground tracking-widest uppercase">
                                                {new Date(event.occurred_at).getFullYear()}
                                            </span>
                                            <span className="text-[9px] font-medium tracking-widest text-muted">
                                                {new Date(event.occurred_at).toLocaleDateString('ja-JP')}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-white border border-border text-[9px] uppercase tracking-widest font-normal text-muted shadow-sm">
                                        {formatVisitType(event.meta?.visit_type)}
                                    </span>
                                </div>

                                {/* Body / Stats */}
                                <div className="p-5 flex flex-col gap-5">
                                    <div className="flex items-center gap-8">
                                        <div className="flex flex-col gap-1.5 flex-1">
                                            <span className="text-[8px] text-muted font-normal tracking-widest uppercase flex items-center gap-1">
                                                <DollarSign className="w-3 h-3" strokeWidth={1.5} /> 会計額
                                            </span>
                                            <span className="text-[16px] font-light text-foreground">
                                                ¥{new Intl.NumberFormat('ja-JP').format(event.amount)}
                                            </span>
                                        </div>

                                        <div className="flex flex-col gap-1.5 flex-1 border-l border-border pl-8">
                                            <span className="text-[8px] text-muted font-normal tracking-widest uppercase flex items-center gap-1">
                                                <Wine className={`w-3 h-3 ${event.meta?.has_bottle ? 'text-rose-500' : 'text-muted'}`} strokeWidth={1.5} /> ボトル
                                            </span>
                                            <span className={`text-[13px] font-light ${event.meta?.has_bottle ? 'text-rose-900 font-normal' : 'text-foreground'}`}>
                                                {event.meta?.has_bottle ? 'あり' : 'なし'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Memo block */}
                                    {event.meta?.memo && (
                                        <div className="pt-4 border-t border-border mt-1">
                                            <span className="text-[8px] text-muted font-normal tracking-widest uppercase flex items-center gap-1.5 mb-2">
                                                <MessageSquare className="w-3 h-3 text-muted" strokeWidth={1.5} /> 来店メモ
                                            </span>
                                            <p className="text-[12px] text-muted font-light leading-relaxed whitespace-pre-wrap pl-2 border-l border-border">
                                                {event.meta.memo}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="border-t border-border bg-zinc-50 p-2 flex justify-end">
                                    <button
                                        onClick={() => handleDeleteEvent(event.id)}
                                        className="p-2 text-muted hover:text-rose-600 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
