"use client"

import { ArrowLeft, Edit3, MessageCircle, MoreVertical, Zap, Shield, TrendingUp, History, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

import { useRouter } from 'next/navigation'

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [customer, setCustomer] = useState<any>(null)
    const [latestVisit, setLatestVisit] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        if (params.id === 'undefined') {
            router.replace('/customers')
            return
        }

        const fetchData = async () => {
            try {
                // Fetch customer
                const { data: customerData, error: customerError } = await supabase
                    .from('customers')
                    .select('*')
                    .eq('id', params.id)
                    .single()

                if (customerError) throw customerError
                setCustomer(customerData)

                // Fetch latest visit
                const { data: visitData, error: visitError } = await supabase
                    .from('events')
                    .select('*')
                    .eq('customer_id', params.id)
                    .eq('type', 'visit')
                    .order('occurred_at', { ascending: false })
                    .limit(1)

                if (!visitError && visitData && visitData.length > 0) {
                    setLatestVisit(visitData[0])
                }
            } catch (err) {
                console.error('Error fetching customer details:', err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [params.id, supabase])

    const stageLabels: Record<string, string> = {
        interest: '興味',
        build: '関係構築',
        trust: '信頼',
        depend: '依存',
        highvalue: '高単価'
    };

    const typeLabels: Record<string, string> = {
        approval: '承認欲求型',
        lonely: '寂しがり屋型',
        control: '支配型',
        hobby: '趣味特化型',
        status: 'ステータス誇示型'
    };

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-[100dvh] bg-white pb-20 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-muted" />
            </div>
        )
    }

    if (!customer) {
        return (
            <div className="flex flex-col min-h-[100dvh] bg-white pb-20 items-center justify-center">
                <p className="text-muted tracking-widest font-light text-sm uppercase">Customer Not Found</p>
                <Link href="/customers" className="mt-4 px-4 py-2 bg-foreground text-white text-xs uppercase tracking-widest">
                    Back to Clients
                </Link>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-[100dvh] bg-white pb-20">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center justify-between">
                <Link href="/customers" className="p-2 -ml-2 text-foreground hover:text-black transition-colors">
                    <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
                </Link>
                <div className="flex items-center gap-2">
                    <button onClick={() => alert('Edit Customer (Coming soon)')} className="p-2 text-foreground hover:text-black transition-colors active:scale-[0.95] active:bg-zinc-100">
                        <Edit3 className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                    <button onClick={() => alert('Options (Coming soon)')} className="p-2 -mr-2 text-foreground hover:text-black transition-colors active:scale-[0.95] active:bg-zinc-100">
                        <MoreVertical className="w-5 h-5" strokeWidth={1.5} />
                    </button>
                </div>
            </header>

            <div className="flex flex-col gap-8 p-6">
                {/* Profile Card */}
                <section className="flex flex-col items-center text-center gap-4">
                    <div className="w-24 h-24 bg-white border border-border flex items-center justify-center p-1">
                        <div className="w-full h-full bg-foreground flex items-center justify-center text-3xl font-light text-white">
                            {customer.display_name.charAt(0)}
                        </div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-light tracking-wide text-foreground">{customer.display_name}</h1>
                        <div className="flex items-center justify-center gap-2 mt-4">
                            <span className="px-3 py-1 bg-foreground text-white text-[9px] font-normal uppercase tracking-widest">
                                {stageLabels[customer.stage] || customer.stage}段階
                            </span>
                            <span className="px-3 py-1 bg-white text-muted text-[9px] font-normal border border-border tracking-widest uppercase">
                                {customer.current_type ? (typeLabels[customer.current_type] || customer.current_type) : 'AI分析中 (未定)'}
                            </span>
                        </div>
                    </div>
                </section>

                {/* LINE Analysis CTA */}
                <Link href={`/customers/${customer.id}/analyze`} className="group relative bg-white border border-border hover:border-foreground p-5 flex items-center justify-between transition-all active:scale-[0.99] active:bg-zinc-50 hover:bg-zinc-50">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-rose-50 border border-rose-100 flex items-center justify-center group-hover:border-rose-300 transition-colors">
                            <MessageCircle className="w-4 h-4 text-rose-600" strokeWidth={1.5} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="font-normal text-foreground text-[13px] tracking-widest uppercase">LINE Analysis / LINE解析</span>
                            <span className="text-[10px] text-muted font-light tracking-wide">最新の会話から戦略を再構築します</span>
                        </div>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-muted rotate-180" strokeWidth={1.5} />
                </Link>

                {/* AI Action Cards */}
                <section className="flex flex-col gap-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xs font-normal flex items-center gap-2 text-rose-600 tracking-widest uppercase">
                            <Zap className="w-3 h-3 text-rose-500" strokeWidth={1.5} />
                            AI Strategy / AI戦略
                        </h2>
                    </div>

                    {/* Attack Card */}
                    <ActionDetailCard
                        title="攻め (売上UP)"
                        goal="ボトルのオーダー"
                        probability={75}
                        reason="承認欲求が高まっており、他卓への対抗心から高額ボトルが期待できる。"
                        message="〇〇さんの席が一番落ち着くかも。いつもありがとうね"
                        time="22:30"
                        icon={<Zap className="w-4 h-4 text-rose-600" strokeWidth={1.5} />}
                        type="attack"
                    />

                    {/* Growth Card */}
                    <ActionDetailCard
                        title="成長 (関係強化)"
                        goal="依存段階の定着"
                        probability={90}
                        reason="最近の返信速度が上がっているため、特別感を演出して本指名を確固たるものに。"
                        message="さっき起きたんだけど、一番に〇〇さんにLINEしちゃった"
                        time="14:00"
                        icon={<TrendingUp className="w-4 h-4 text-foreground" strokeWidth={1.5} />}
                        type="growth"
                    />

                    {/* Defense Card */}
                    <ActionDetailCard
                        title="防御 (失客防止)"
                        goal="次回来店の確約"
                        probability={85}
                        reason="来店周期が20日を超えたため、軽いジャブで存在をアピール。"
                        message="最近忙しい？無理しないでね"
                        time="20:00"
                        icon={<Shield className="w-4 h-4 text-muted" strokeWidth={1.5} />}
                        type="defense"
                    />
                </section>

                {/* Notes */}
                <section className="premium-card p-6 flex flex-col gap-4">
                    <h2 className="text-[9px] font-normal text-foreground uppercase tracking-widest flex items-center gap-2">
                        接客メモ / NOTES
                    </h2>
                    <p className="text-[12px] text-muted border-l border-border pl-4 py-1 font-light leading-relaxed whitespace-pre-wrap">
                        {customer.notes || 'メモは未登録です。'}
                    </p>
                </section>

                {/* History & Events */}
                <div className="flex flex-col gap-4">
                    <Link href={`/customers/${customer.id}/events/new`} className="w-full bg-foreground text-white border border-foreground py-3.5 flex items-center justify-center gap-2 font-normal tracking-widest uppercase text-[11px] transition-all hover:bg-[#222] active:bg-black active:scale-[0.99]">
                        <Edit3 className="w-3.5 h-3.5" strokeWidth={1.5} />
                        来店記録を追加 / ADD VISIT
                    </Link>

                    <section onClick={() => alert('History View (Coming soon)')} className="premium-card p-5 flex items-center justify-between cursor-pointer active:scale-[0.99] active:bg-zinc-50 transition-all hover:border-foreground group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white border border-border flex items-center justify-center group-hover:border-foreground transition-colors">
                                <History className="w-4 h-4 text-foreground" strokeWidth={1.5} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="font-normal text-foreground tracking-widest uppercase text-[12px]">History / 履歴</span>
                                <span className="text-[10px] text-muted font-light tracking-wide">
                                    {latestVisit
                                        ? `前回のご来店: ${new Date(latestVisit.occurred_at).toLocaleDateString('ja-JP')} (${new Intl.NumberFormat('ja-JP').format(latestVisit.amount)}円)`
                                        : '来店履歴なし'}
                                </span>
                            </div>
                        </div>
                        <ArrowLeft className="w-4 h-4 text-muted rotate-180" strokeWidth={1.5} />
                    </section>
                </div>

            </div>
        </div>
    )
}

function ActionDetailCard({ title, goal, probability, reason, message, time, icon, type }: any) {
    const isAttack = type === 'attack';
    const cardBg = isAttack ? 'bg-rose-50 text-rose-900' : 'bg-white text-foreground';
    const borderClass = isAttack ? 'border-rose-200' : 'border-border';
    const textMuted = isAttack ? 'text-rose-600/80' : 'text-muted';
    const iconWrapper = isAttack ? 'bg-white' : 'bg-white';

    const handleCopy = () => {
        navigator.clipboard.writeText(message);
        alert('Copied to clipboard!');
    };

    return (
        <div className={`premium-card p-6 ${cardBg} ${borderClass} relative transition-all group`}>
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className={`p-2 border ${borderClass} ${iconWrapper}`}>
                        {icon}
                    </div>
                    <span className={`font-light text-[14px] tracking-wide ${isAttack ? 'text-rose-900' : 'text-foreground'}`}>{title}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className={`text-[8px] font-normal tracking-widest uppercase mb-1 ${textMuted}`}>Win Rate / 成功率</span>
                    <span className={`text-2xl font-light tracking-tight ${isAttack ? 'text-rose-900' : 'text-foreground'}`}>{probability}<span className={`text-sm ml-0.5 ${textMuted}`}>%</span></span>
                </div>
            </div>

            <div className={`flex flex-col gap-6`}>
                <div className={`grid grid-cols-2 gap-6 border-t ${isAttack ? 'border-rose-200/50' : 'border-border'} pt-5`}>
                    <div>
                        <span className={`text-[8px] font-normal uppercase tracking-widest block mb-1.5 ${textMuted}`}>目標 / Goal</span>
                        <span className={`text-[12px] font-light ${isAttack ? 'text-rose-900' : 'text-foreground'}`}>{goal}</span>
                    </div>
                    <div>
                        <span className={`text-[8px] font-normal uppercase tracking-widest block mb-1.5 ${textMuted}`}>理由 / Reason</span>
                        <p className={`text-[11px] font-light leading-relaxed ${textMuted}`}>{reason}</p>
                    </div>
                </div>

                <div className={`p-5 border ${isAttack ? 'bg-white/60 border-rose-200' : 'bg-zinc-50 border-border'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <span className={`text-[8px] font-normal uppercase tracking-widest ${textMuted}`}>
                            RECOMMENDED MESSAGE / 推奨メッセージ
                        </span>
                        <span className={`font-normal border px-2 py-0.5 text-[8px] tracking-widest uppercase ${isAttack ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-white text-foreground border-border'}`}>
                            {time} 頃
                        </span>
                    </div>
                    <p className={`text-[13px] font-light tracking-wide leading-relaxed ${isAttack ? 'text-rose-900' : 'text-foreground'}`}>{message}</p>
                    <button onClick={handleCopy} className={`w-full mt-6 py-3 text-[11px] font-normal tracking-widest uppercase transition-all active:scale-[0.98] border ${isAttack ? 'bg-rose-500 text-white hover:bg-rose-600 border-rose-600 active:bg-rose-700' : 'bg-foreground text-white hover:bg-[#222] border-foreground active:bg-black'}`}>
                        コピーする
                    </button>
                </div>
            </div>
        </div>
    )
}
