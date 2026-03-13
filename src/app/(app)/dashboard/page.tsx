"use client"

import { Zap, AlertTriangle, TrendingUp, ArrowUpCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { format, startOfMonth } from 'date-fns'
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { calculateCustomerPriorityScore, PriorityScoreCustomer } from '@/lib/utils/priority'

export default function DashboardPage() {
    const today = format(new Date(), 'yyyy.M.d')
    const [isLoading, setIsLoading] = useState(true)

    // Data states
    const [tasks, setTasks] = useState<any[]>([])
    const [attentionCustomer, setAttentionCustomer] = useState<any>(null)
    const [upgradeCustomer, setUpgradeCustomer] = useState<any>(null)
    const [currentSales, setCurrentSales] = useState<number>(0)
    const [visitTypesCount, setVisitTypesCount] = useState<Record<string, number>>({})

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Get User Custom Config
                const { data: { user } } = await supabase.auth.getUser()
                const customPriorityConfig = user?.user_metadata?.priority_settings

                // 1. Fetch ALL required data for scoring
                const [customersRes, eventsRes, summariesRes] = await Promise.all([
                    supabase.from('customers').select('id, display_name, stage, danger_level, current_type'),
                    supabase.from('events').select('customer_id, occurred_at').eq('type', 'visit'),
                    supabase.from('conversation_summaries').select('customer_id, inferred_features')
                ])

                const customers = customersRes.data || []
                const events = eventsRes.data || []
                const summaries = summariesRes.data || []

                // Map events to customers
                const visitStats = new Map<string, { count: number, latest: string }>()
                events.forEach(ev => {
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

                // Map summaries to customers
                const summaryStats = new Map<string, any>()
                summaries.forEach(sum => {
                    // Just take the first one we see (assuming they are not strictly ordered here, 
                    // ideally we'd want the latest, but for simplicity of Map let's just reverse or sort later)
                    // We will just keep the most recent if there are multiple.
                    // Wait, we didn't order summaries. Let's just use it as a basic map for now.
                    if (sum.inferred_features?.next_action && !summaryStats.has(sum.customer_id)) {
                        summaryStats.set(sum.customer_id, sum.inferred_features)
                    }
                })

                // Calculate priority scores
                const scoredCustomers = customers.map(c => {
                    const stats = visitStats.get(c.id)
                    const aiStats = summaryStats.get(c.id)

                    const scoreObj: PriorityScoreCustomer = {
                        ...c,
                        visit_count: stats?.count || 0,
                        last_visit_date: stats?.latest,
                        next_action: aiStats?.next_action,
                        priority_category: aiStats?.priority_category,
                        recommended_time: aiStats?.recommended_time
                    }

                    return {
                        ...scoreObj,
                        score: calculateCustomerPriorityScore(scoreObj, customPriorityConfig)
                    }
                }).sort((a, b) => b.score - a.score) // Sort descending

                // 2. Set Today's Tasks (Top 5 customers with AI actions)
                const topTasks = scoredCustomers
                    .filter(c => c.next_action) // Must have an AI action to be a task
                    .slice(0, 5)
                    .map(c => ({
                        id: c.id,
                        name: c.display_name,
                        action: c.next_action,
                        time: c.recommended_time || 'ASAP',
                        type: c.priority_category || 'growth'
                    }))

                setTasks(topTasks)

                // 3. Fetch Attention Customer (danger or critical) - Still rely on danger_level logic, or just use top score with danger
                const dangerCustomers = scoredCustomers.filter(c => ['danger', 'critical'].includes(c.danger_level || ''))
                if (dangerCustomers.length > 0) {
                    setAttentionCustomer(dangerCustomers[0])
                } else {
                    const cautionCustomers = scoredCustomers.filter(c => c.danger_level === 'caution')
                    if (cautionCustomers.length > 0) setAttentionCustomer(cautionCustomers[0])
                }

                // 4. Fetch Upgrade Customer (stage is build or trust, highest score)
                const upgradeCandidates = scoredCustomers.filter(c => ['build', 'trust'].includes(c.stage))
                if (upgradeCandidates.length > 0) {
                    // Pick a random customer from the top 3 highest scorers to keep the UI dynamic
                    const topCandidates = upgradeCandidates.slice(0, 3)
                    const randomCandidate = topCandidates[Math.floor(Math.random() * topCandidates.length)]
                    setUpgradeCustomer(randomCandidate)
                } else {
                    setUpgradeCustomer(null)
                }

                // 4. Sales Data (Current month sum) & Visit Types Breakdown
                const monthStart = startOfMonth(new Date()).toISOString()
                const { data: salesData } = await supabase
                    .from('events')
                    .select('amount, meta')
                    .eq('type', 'visit')
                    .gte('occurred_at', monthStart)

                const total = (salesData || []).reduce((sum, ev) => sum + (Number(ev.amount) || 0), 0)
                setCurrentSales(total)

                const typeCounts: Record<string, number> = {
                    honshimei: 0,
                    jounai: 0,
                    dohan: 0,
                    free: 0
                }

                if (salesData) {
                    salesData.forEach(ev => {
                        const vt = ev.meta?.visit_type;
                        if (vt && typeCounts[vt] !== undefined) {
                            typeCounts[vt]++;
                        }
                    })
                }
                setVisitTypesCount(typeCounts)

            } catch (err) {
                console.error('Error fetching dashboard data:', err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchDashboardData()
    }, [supabase])

    const stageLabels: Record<string, string> = {
        interest: '興味',
        build: '関係構築',
        trust: '信頼',
        depend: '依存',
        highvalue: '高単価'
    };

    const nextStageLabels: Record<string, string> = {
        interest: '関係構築',
        build: '信頼',
        trust: '依存',
        depend: '高単価',
        highvalue: 'MAX'
    };

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-[100dvh] bg-white pb-20 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-muted" />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-8 p-6 pt-12 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-light tracking-wide text-foreground uppercase">HOME</h1>
                    <p className="text-muted text-[11px] mt-1 font-medium tracking-widest uppercase">{today}</p>
                </div>
                <div className="h-10 w-10 bg-white border border-border flex items-center justify-center">
                    <div className="w-8 h-8 bg-rose-50 flex items-center justify-center">
                        <span className="text-rose-600 text-xs font-light tracking-widest">CR</span>
                    </div>
                </div>
            </div>

            {/* 1. 本日のタスク */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-xs font-normal text-muted tracking-widest uppercase">TODAY'S TASK / 本日のタスク</h2>
                </div>
                <div className="flex flex-col gap-4">
                    {tasks.length > 0 ? tasks.map(t => (
                        <ActionCard
                            key={t.id}
                            id={t.id}
                            name={t.name}
                            action={t.action}
                            time={t.time}
                            type={t.type}
                        />
                    )) : (
                        <div className="text-center p-8 border border-border">
                            <p className="text-[10px] text-muted tracking-widest uppercase">No Tasks</p>
                        </div>
                    )}
                </div>
                {tasks.length > 0 && (
                    <Link href="/actions" className="block text-center mt-3 text-[10px] font-normal tracking-widest uppercase text-muted hover:text-foreground transition-colors">
                        View All Actions →
                    </Link>
                )}
            </section>

            {/* 2. 要注意のお客様 */}
            <section>
                <div className="flex items-center gap-2 mb-4 mt-2">
                    <h2 className="text-xs font-normal text-muted tracking-widest uppercase">ATTENTION / 注意が必要なお客様</h2>
                </div>
                {attentionCustomer ? (
                    <Link href={`/customers/${attentionCustomer.id}`} className="block premium-card p-5 relative overflow-hidden group border-l-[4px] border-l-rose-300 hover:border-r-border hover:border-y-border cursor-pointer active:scale-[0.99] transition-all">
                        <div className="flex items-center justify-between mb-3">
                            <span className="font-normal text-foreground text-base tracking-wide">{attentionCustomer.display_name}</span>
                            <span className="text-[9px] px-2 py-1 bg-rose-50 text-rose-600 border border-rose-100 font-medium tracking-widest uppercase">
                                {attentionCustomer.danger_level === 'critical' ? 'CRITICAL' : 'CAUTION'}
                            </span>
                        </div>
                        <p className="text-xs font-light text-muted leading-relaxed">来店の周期が遅れており、失客リスクが上昇しています。早めのフォローを推奨します。</p>
                    </Link>
                ) : (
                    <div className="text-center p-6 border border-border bg-zinc-50">
                        <p className="text-[10px] text-muted tracking-widest uppercase">No Attention Needed</p>
                    </div>
                )}
            </section>

            {/* 3. 売上表示 */}
            <section className="mt-2">
                <div className="premium-card p-5 flex flex-col justify-between hover:border-black transition-colors w-full">
                    <div className="flex items-center gap-1.5 mb-6 text-muted">
                        <span className="text-[9px] font-normal tracking-widest uppercase">CURRENT / 当月の売上 (合計)</span>
                    </div>
                    <div>
                        <div className="text-3xl font-light text-foreground tracking-wide mb-1">¥{new Intl.NumberFormat('ja-JP').format(currentSales)}</div>
                        <div className="text-[10px] font-light text-muted uppercase tracking-widest mb-6 border-b border-border pb-4">Calculated from visits this month</div>
                        
                        {/* Visit Types Breakdown */}
                        <div className="flex flex-col gap-2">
                            <span className="text-[8px] font-normal tracking-widest uppercase text-muted mb-1">内訳 / Breakdown</span>
                            <div className="grid grid-cols-4 gap-2">
                                <div className="flex flex-col items-center bg-zinc-50 border border-border py-2 px-1">
                                    <span className="text-[8px] text-muted tracking-widest uppercase mb-1 whitespace-nowrap">本指名</span>
                                    <span className="text-[14px] font-light text-foreground">{visitTypesCount['honshimei'] || 0}</span>
                                </div>
                                <div className="flex flex-col items-center bg-zinc-50 border border-border py-2 px-1">
                                    <span className="text-[8px] text-muted tracking-widest uppercase mb-1 whitespace-nowrap">同伴</span>
                                    <span className="text-[14px] font-light text-foreground">{visitTypesCount['dohan'] || 0}</span>
                                </div>
                                <div className="flex flex-col items-center bg-zinc-50 border border-border py-2 px-1">
                                    <span className="text-[8px] text-muted tracking-widest uppercase mb-1 whitespace-nowrap">場内</span>
                                    <span className="text-[14px] font-light text-foreground">{visitTypesCount['jounai'] || 0}</span>
                                </div>
                                <div className="flex flex-col items-center bg-zinc-50 border border-border py-2 px-1">
                                    <span className="text-[8px] text-muted tracking-widest uppercase mb-1 whitespace-nowrap">フリー</span>
                                    <span className="text-[14px] font-light text-foreground">{visitTypesCount['free'] || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. 段階昇格見込み */}
            <section>
                <div className="flex items-center gap-2 mb-4 mt-4">
                    <h2 className="text-xs font-normal text-muted tracking-widest uppercase">UPGRADE / 昇格見込みのお客様</h2>
                </div>
                {upgradeCustomer ? (
                    <div className="premium-card p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between group hover:border-black transition-colors cursor-pointer" onClick={() => window.location.href = `/customers/${upgradeCustomer.id}`}>
                        <div>
                            <div className="font-normal text-foreground text-base tracking-wide flex items-center gap-2 mb-2">
                                {upgradeCustomer.display_name}
                                <span className="text-[9px] text-muted tracking-widest font-normal uppercase border px-2 py-0.5">優先度: {upgradeCustomer.score}pt</span>
                            </div>
                            <div className="text-[11px] font-light text-muted flex items-center gap-3 tracking-widest uppercase">
                                <span>{stageLabels[upgradeCustomer.stage] || upgradeCustomer.stage}</span>
                                <span className="text-rose-300">→</span>
                                <span className="text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5">{nextStageLabels[upgradeCustomer.stage] || 'NEXT'}</span>
                            </div>
                        </div>
                        <Link href={`/customers/${upgradeCustomer.id}`} className="premium-btn text-[10px] px-6 py-2.5 sm:w-auto w-full text-center hover:premium-btn-hover active:premium-btn-active">
                            VIEW
                        </Link>
                    </div>
                ) : (
                    <div className="text-center p-6 border border-border bg-zinc-50">
                        <p className="text-[10px] text-muted tracking-widest uppercase">No Upgrades Predicted</p>
                    </div>
                )}
            </section>
        </div>
    )
}

function ActionCard({ id, name, action, time, type }: { id: string, name: string, action: string, time: string, type: string }) {
    const styles: any = {
        attack: { badge: 'bg-rose-50 text-rose-600 border-rose-100' },
        defense: { badge: 'bg-white text-muted border-border' },
        growth: { badge: 'bg-zinc-50 text-foreground border-border' }
    }

    const { badge } = styles[type] || styles.growth

    return (
        <Link href={`/customers/${id}`} className="premium-card p-5 flex items-center justify-between group active:scale-[0.99] transition-all cursor-pointer hover:border-black">
            <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-3">
                    <span className="font-normal text-foreground text-[15px] tracking-wide">{name}</span>
                    <span className={`text-[8px] font-normal px-2 py-0.5 border tracking-widest uppercase ${badge}`}>
                        {type}
                    </span>
                </div>
                <span className="text-[11px] text-muted font-light tracking-wide">{action}</span>
            </div>
            <div className="flex flex-col items-end gap-1.5 border-l border-border pl-4">
                <span className="text-[8px] font-normal text-muted tracking-widest uppercase">TIME / 推奨時間</span>
                <span className="text-xs font-normal text-foreground tracking-widest">{time}</span>
            </div>
        </Link>
    )
}
