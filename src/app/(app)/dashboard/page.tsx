"use client"

import { Zap, AlertTriangle, TrendingUp, ArrowUpCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { format, startOfMonth } from 'date-fns'
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function DashboardPage() {
    const today = format(new Date(), 'yyyy.M.d')
    const [isLoading, setIsLoading] = useState(true)

    // Data states
    const [tasks, setTasks] = useState<any[]>([])
    const [attentionCustomer, setAttentionCustomer] = useState<any>(null)
    const [upgradeCustomer, setUpgradeCustomer] = useState<any>(null)
    const [currentSales, setCurrentSales] = useState<number>(0)
    const [forecastSales, setForecastSales] = useState<number>(0)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // 1. Fetch Today's Tasks (AI Recommendations limit 2)
                const { data: recData } = await supabase
                    .from('ai_recommendations')
                    .select('*, customers(display_name)')
                    .order('created_at', { ascending: false })
                    .limit(2)

                setTasks(recData || [])

                // 2. Fetch Attention Customer (danger or critical)
                const { data: dangerData } = await supabase
                    .from('customers')
                    .select('*')
                    .in('danger_level', ['danger', 'critical'])
                    .limit(1)

                if (dangerData && dangerData.length > 0) {
                    setAttentionCustomer(dangerData[0])
                } else {
                    // Fallback to warning if no critical
                    const { data: cautionData } = await supabase
                        .from('customers')
                        .select('*')
                        .eq('danger_level', 'caution')
                        .limit(1)
                    if (cautionData && cautionData.length > 0) setAttentionCustomer(cautionData[0])
                }

                // 3. Fetch Upgrade Customer (stage is build or trust)
                const { data: upgradeData } = await supabase
                    .from('customers')
                    .select('*')
                    .in('stage', ['build', 'trust'])
                    .order('updated_at', { ascending: false })
                    .limit(1)

                if (upgradeData && upgradeData.length > 0) {
                    setUpgradeCustomer(upgradeData[0])
                } else {
                    // Fallback just grab any latest
                    const { data: anyData } = await supabase.from('customers').select('*').limit(1)
                    if (anyData && anyData.length > 0) setUpgradeCustomer(anyData[0])
                }

                // 4. Sales Data (Current month sum)
                const monthStart = startOfMonth(new Date()).toISOString()
                const { data: salesData } = await supabase
                    .from('events')
                    .select('amount')
                    .eq('type', 'visit')
                    .gte('occurred_at', monthStart)

                const total = (salesData || []).reduce((sum, ev) => sum + (Number(ev.amount) || 0), 0)
                setCurrentSales(total)
                // Fake forecast as just 1.5x of current
                setForecastSales(Math.floor(total * 1.5) || 50000)

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
                            id={t.customer_id}
                            name={t.customers?.display_name || '名称未設定'}
                            action={t.goal || 'アクション未設定'}
                            time={t.suggested_send_time_window || '未定'}
                            type={t.category || 'growth'}
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

            {/* 3. 売上着地予測 */}
            <section className="grid grid-cols-2 gap-4 mt-2">
                <div className="premium-card p-5 flex flex-col justify-between hover:bg-rose-50/30 transition-colors">
                    <div className="flex items-center gap-1.5 mb-6 text-muted">
                        <span className="text-[9px] font-normal tracking-widest uppercase">CURRENT / 現在の売上</span>
                    </div>
                    <div>
                        <div className="text-xl font-normal text-foreground tracking-wide">¥{new Intl.NumberFormat('ja-JP').format(currentSales)}</div>
                    </div>
                </div>
                <div className="premium-card p-5 flex flex-col justify-between bg-zinc-50 border-border hover:bg-rose-50 transition-colors">
                    <div className="flex items-center gap-1.5 mb-6 text-foreground">
                        <span className="text-[9px] font-normal tracking-widest text-rose-600 uppercase flex items-center gap-1">
                            <Zap strokeWidth={1.5} className="w-3 h-3" />
                            FORECAST / 着地予測
                        </span>
                    </div>
                    <div>
                        <div className="text-xl font-normal text-foreground tracking-wide">¥{new Intl.NumberFormat('ja-JP').format(forecastSales)}</div>
                    </div>
                </div>
            </section>

            {/* 4. 段階昇格見込み */}
            <section>
                <div className="flex items-center gap-2 mb-4 mt-4">
                    <h2 className="text-xs font-normal text-muted tracking-widest uppercase">UPGRADE / 昇格見込みのお客様</h2>
                </div>
                {upgradeCustomer ? (
                    <div className="premium-card p-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between group hover:border-rose-200 transition-colors">
                        <div>
                            <div className="font-normal text-foreground text-base tracking-wide mb-2">{upgradeCustomer.display_name}</div>
                            <div className="text-[11px] font-light text-muted flex items-center gap-3 tracking-widest uppercase">
                                <span>{stageLabels[upgradeCustomer.stage] || upgradeCustomer.stage}</span>
                                <span className="text-rose-300">→</span>
                                <span className="text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5">NEXT</span>
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
