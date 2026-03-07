"use client"

import { Zap, TrendingUp, Shield, CheckCircle2, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { calculateCustomerPriorityScore, PriorityScoreCustomer } from '@/lib/utils/priority'

export default function ActionsPage() {
    const [filter, setFilter] = useState('すべて')
    const [tickets, setTickets] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        const fetchActions = async () => {
            try {
                // Get User Custom Config for Priority
                const { data: { user } } = await supabase.auth.getUser()
                const customPriorityConfig = user?.user_metadata?.priority_settings

                const { data, error } = await supabase
                    .from('ai_recommendations')
                    .select('*, customers(display_name)')
                    .order('created_at', { ascending: false })

                if (error) throw error

                // Fetch latest summaries to get priority categories
                const { data: summaryData } = await supabase
                    .from('conversation_summaries')
                    .select('customer_id, inferred_features')
                    .order('created_at', { ascending: false })

                // Create a map of customer_id -> priority_category & next_action
                const summaryStats = new Map();
                if (summaryData) {
                    for (const s of summaryData) {
                        if (!summaryStats.has(s.customer_id) && s.inferred_features) {
                            summaryStats.set(s.customer_id, s.inferred_features);
                        }
                    }
                }

                // Fetch customers and visits for scoring
                const [customersRes, eventsRes] = await Promise.all([
                    supabase.from('customers').select('id, stage, danger_level, current_type'),
                    supabase.from('events').select('customer_id, occurred_at').eq('type', 'visit')
                ])

                const visitStats = new Map<string, { count: number, latest: string }>()
                if (eventsRes.data) {
                    eventsRes.data.forEach(ev => {
                        const existing = visitStats.get(ev.customer_id)
                        if (!existing) {
                            visitStats.set(ev.customer_id, { count: 1, latest: ev.occurred_at })
                        } else {
                            existing.count++
                            if (new Date(ev.occurred_at) > new Date(existing.latest)) {
                                existing.latest = ev.occurred_at
                            }
                        }
                    })
                }

                const customerMap = new Map<string, any>()
                if (customersRes.data) {
                    customersRes.data.forEach(c => customerMap.set(c.id, c))
                }

                // Filter to only Priority Recommendations
                const seenCustomerIds = new Set();
                const prioritizedRecs = (data || []).filter((d: any) => {
                    if (seenCustomerIds.has(d.customer_id)) return false; // Only one per customer

                    const aiStats = summaryStats.get(d.customer_id);
                    if (aiStats && d.category === aiStats.priority_category) {
                        seenCustomerIds.add(d.customer_id);
                        return true;
                    }
                    return false;
                });

                // Map to formatted tickets WITH calculated scores
                const formatted = prioritizedRecs.map((d: any) => {
                    const c = customerMap.get(d.customer_id) || {}
                    const vStats = visitStats.get(d.customer_id)
                    const aiStats = summaryStats.get(d.customer_id)

                    const scoreObj: PriorityScoreCustomer = {
                        id: d.customer_id,
                        display_name: d.customers?.display_name || '',
                        stage: c.stage || 'interest',
                        danger_level: c.danger_level,
                        visit_count: vStats?.count || 0,
                        last_visit_date: vStats?.latest,
                    }
                    const score = calculateCustomerPriorityScore(scoreObj, customPriorityConfig)

                    return {
                        id: d.id, // Use recommendation ID for unique keys
                        customerId: d.customer_id, // Keep customer ID for routing
                        customer: d.customers?.display_name || '顧客名未設定',
                        type: d.category,
                        title: d.goal || 'アクション未設定',
                        time: d.suggested_send_time_window || '未定',
                        probability: d.probability || 0,
                        score: score
                    }
                }).sort((a, b) => b.score - a.score) // Sort highest score first

                setTickets(formatted)
            } catch (err) {
                console.error('Error fetching actions:', err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchActions()
    }, [supabase])

    const filteredTickets = filter === 'すべて'
        ? tickets
        : tickets.filter(t =>
            (filter === '攻め' && t.type === 'attack') ||
            (filter === '関係作り' && t.type === 'growth') ||
            (filter === '関係キープ' && t.type === 'defense')
        )

    return (
        <div className="flex flex-col gap-8 p-6 pt-12">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-light tracking-wide text-foreground uppercase">Action</h1>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6">
                <FilterChip label="すべて" active={filter === 'すべて'} onClick={() => setFilter('すべて')} />
                <FilterChip label="攻め" active={filter === '攻め'} onClick={() => setFilter('攻め')} icon={<Zap className="w-3.5 h-3.5" strokeWidth={1.5} />} />
                <FilterChip label="関係作り" active={filter === '関係作り'} onClick={() => setFilter('関係作り')} icon={<TrendingUp className="w-3.5 h-3.5" strokeWidth={1.5} />} />
                <FilterChip label="関係キープ" active={filter === '関係キープ'} onClick={() => setFilter('関係キープ')} icon={<Shield className="w-3.5 h-3.5" strokeWidth={1.5} />} />
            </div>

            <div className="flex flex-col gap-4 mt-2">
                {isLoading ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="w-6 h-6 animate-spin text-muted" />
                    </div>
                ) : filteredTickets.length === 0 ? (
                    <div className="text-center p-8 border border-border mt-4">
                        <p className="text-xs text-muted tracking-widest uppercase">No Actions Found</p>
                    </div>
                ) : (
                    filteredTickets.map(ticket => (
                        <ActionTicket
                            key={ticket.id}
                            id={ticket.customerId} // use customerId for routing
                            customer={ticket.customer}
                            type={ticket.type}
                            title={ticket.title}
                            time={ticket.time}
                            probability={ticket.probability}
                            score={ticket.score}
                        />
                    ))
                )}
            </div>
        </div>
    )
}

function FilterChip({ label, active, icon, onClick }: any) {
    if (active) {
        return (
            <button onClick={onClick} className="flex items-center gap-2 px-5 py-2.5 text-[11px] font-normal tracking-widest uppercase transition-all bg-foreground text-white border border-foreground active:scale-[0.95]">
                {icon}
                {label}
            </button>
        )
    }

    return (
        <button onClick={onClick} className="flex items-center gap-2 px-5 py-2.5 text-[11px] font-normal tracking-widest uppercase transition-all border border-border bg-white text-muted hover:border-foreground hover:text-foreground active:scale-[0.95]">
            {icon}
            {label}
        </button>
    )
}

function ActionTicket({ id, customer, type, title, time, probability, score }: any) {
    const typeConfig: any = {
        attack: {
            label: 'ATTACK / 攻め',
            icon: <Zap className="w-4 h-4 text-rose-600" strokeWidth={1.5} />
        },
        growth: {
            label: 'GROWTH / 成長',
            icon: <TrendingUp className="w-4 h-4 text-foreground" strokeWidth={1.5} />
        },
        defense: {
            label: 'DEFENSE / 防御',
            icon: <Shield className="w-4 h-4 text-muted" strokeWidth={1.5} />
        }
    }

    const conf = typeConfig[type]
    const isAttack = type === 'attack'

    return (
        <Link href={`/customers/${id}`} className={`block premium-card p-6 flex flex-col gap-6 group active:scale-[0.98] transition-all cursor-pointer ${isAttack ? 'bg-rose-50 text-rose-900 border-rose-200' : 'bg-white text-foreground border-border hover:border-foreground'}`}>
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className={`p-2 border ${isAttack ? 'border-rose-200 bg-white' : 'border-border bg-white'}`}>
                        {conf.icon}
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className={`text-[9px] font-normal tracking-widest uppercase ${isAttack ? 'text-rose-600/80' : 'text-muted'}`}>{conf.label}</span>
                        <div className="flex items-center gap-2">
                            <span className={`text-[15px] font-normal tracking-wide ${isAttack ? 'text-rose-900' : 'text-foreground'}`}>{customer}</span>
                            <span className={`text-[8px] px-1.5 py-0.5 border font-normal uppercase ${isAttack ? 'border-rose-200 text-rose-600 bg-white' : 'border-border text-muted bg-white'}`}>優先度: {score}pt</span>
                        </div>
                    </div>
                </div>
                <div className={`w-8 h-8 flex items-center justify-center transition-colors group-hover:scale-105 ${isAttack ? 'text-rose-600 border-rose-200 group-hover:bg-rose-600 group-hover:text-white' : 'text-muted border-border group-hover:bg-foreground group-hover:text-white group-hover:border-foreground'} border rounded-none`}>
                    <CheckCircle2 className="w-4 h-4" strokeWidth={1.5} />
                </div>
            </div>

            <div className={`pt-5 border-t flex items-end justify-between ${isAttack ? 'border-rose-200/50' : 'border-border'}`}>
                <div className="flex flex-col gap-2.5">
                    <h3 className={`text-[15px] font-light tracking-wide leading-tight ${isAttack ? 'text-rose-900' : 'text-foreground'}`}>{title}</h3>
                    <p className={`text-[10px] font-normal flex items-center gap-2 uppercase tracking-widest ${isAttack ? 'text-rose-600/80' : 'text-muted'}`}>
                        SEND TIME / 推奨送信時間
                        <span className={`tracking-widest font-normal px-2 py-0.5 border ${isAttack ? 'bg-white text-rose-700 border-rose-200' : 'bg-white text-foreground border-border'}`}>
                            {time}
                        </span>
                    </p>
                </div>
                <div className="flex flex-col items-end">
                    <span className={`text-[8px] font-normal tracking-widest uppercase mb-1.5 ${isAttack ? 'text-rose-600/80' : 'text-muted'}`}>Win Rate / 成功率</span>
                    <span className={`text-2xl font-light tracking-tight ${isAttack ? 'text-rose-900' : 'text-foreground'}`}>{probability}<span className={`text-sm font-normal ml-0.5 ${isAttack ? 'text-rose-600/80' : 'text-muted'}`}>%</span></span>
                </div>
            </div>
        </Link>
    )
}
