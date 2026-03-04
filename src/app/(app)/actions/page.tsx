"use client"

import { Zap, TrendingUp, Shield, CheckCircle2, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'

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
                const { data, error } = await supabase
                    .from('ai_recommendations')
                    .select('*, customers(display_name)')
                    .order('created_at', { ascending: false })

                if (error) throw error

                const formatted = (data || []).map((d: any) => ({
                    id: d.customer_id, // We link to the customer ID
                    customer: d.customers?.display_name || '顧客名未設定',
                    type: d.category,
                    title: d.goal || 'アクション未設定',
                    time: d.suggested_send_time_window || '未定',
                    probability: d.probability || 0
                }))
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
                            id={ticket.id}
                            customer={ticket.customer}
                            type={ticket.type}
                            title={ticket.title}
                            time={ticket.time}
                            probability={ticket.probability}
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

function ActionTicket({ id, customer, type, title, time, probability }: any) {
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
                        <span className={`text-[15px] font-normal tracking-wide ${isAttack ? 'text-rose-900' : 'text-foreground'}`}>{customer}</span>
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
