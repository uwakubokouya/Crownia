"use client"

import { ArrowLeft, Edit3, MessageCircle, MoreVertical, Zap, Shield, TrendingUp, History, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState, use, useRef } from 'react'
import { createBrowserClient } from '@supabase/ssr'

import { useRouter } from 'next/navigation'

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const resolvedParams = use(params)
    const [customer, setCustomer] = useState<any>(null)
    const [latestVisit, setLatestVisit] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isEditingMemo, setIsEditingMemo] = useState(false)
    const [memoInput, setMemoInput] = useState('')
    const [isSavingMemo, setIsSavingMemo] = useState(false)
    const [actionCards, setActionCards] = useState<any[]>([])
    const [priorityData, setPriorityData] = useState<{ category?: string, nextAction?: string } | null>(null)
    const isGeneratingCards = useRef(false)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        // Strict UUID validation to prevent 400 Bad Request from Supabase
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!resolvedParams?.id || !uuidRegex.test(resolvedParams.id)) {
            router.replace('/customers')
            return
        }

        const fetchData = async () => {
            try {
                // Fetch customer
                const { data: customerData, error: customerError } = await supabase
                    .from('customers')
                    .select('*')
                    .eq('id', resolvedParams.id)
                    .maybeSingle()

                if (customerError) throw customerError
                if (!customerData) {
                    setCustomer(null)
                    setIsLoading(false)
                    return
                }

                setCustomer(customerData)
                setMemoInput(customerData.notes || '')

                // Fetch latest visit
                const { data: visitData, error: visitError } = await supabase
                    .from('events')
                    .select('*')
                    .eq('customer_id', resolvedParams.id)
                    .eq('type', 'visit')
                    .order('occurred_at', { ascending: false })
                    .limit(1)

                if (!visitError && visitData && visitData.length > 0) {
                    setLatestVisit(visitData[0])
                }

                // Fetch AI recommendations
                const { data: aiData, error: aiError } = await supabase
                    .from('ai_recommendations')
                    .select('*')
                    .eq('customer_id', resolvedParams.id)
                    .order('category', { ascending: true }) // simple order

                if (aiError) throw aiError

                if (aiData && aiData.length > 0) {
                    setActionCards(aiData)
                }

                // Fetch latest priority and next action
                const { data: summaryData } = await supabase
                    .from('conversation_summaries')
                    .select('inferred_features')
                    .eq('customer_id', resolvedParams.id)
                    .order('created_at', { ascending: false })
                    .limit(1)

                if (summaryData && summaryData.length > 0 && summaryData[0].inferred_features) {
                    setPriorityData({
                        category: summaryData[0].inferred_features.priority_category,
                        nextAction: summaryData[0].inferred_features.next_action
                    })
                }
            } catch (err: any) {
                console.error('Error fetching customer details:', err.message || err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [resolvedParams.id, supabase])

    const handleSaveMemo = async () => {
        setIsSavingMemo(true)
        try {
            const { error } = await supabase
                .from('customers')
                .update({ notes: memoInput })
                .eq('id', resolvedParams.id)

            if (error) throw error
            setCustomer((prev: any) => ({ ...prev, notes: memoInput }))
            setIsEditingMemo(false)
        } catch (error) {
            console.error('Error updating memo:', error)
            alert('メモの保存に失敗しました。')
        } finally {
            setIsSavingMemo(false)
        }
    }

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
                    <Link href={`/customers/${resolvedParams.id}/edit`} className="p-2 text-foreground hover:text-black transition-colors active:scale-[0.95] active:bg-zinc-100 block">
                        <Edit3 className="w-4 h-4" strokeWidth={1.5} />
                    </Link>
                    <button onClick={() => alert('Options (Coming soon)')} className="p-2 -mr-2 text-foreground hover:text-black transition-colors active:scale-[0.95] active:bg-zinc-100 hidden">
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

                    {priorityData?.nextAction && (
                        <div className="premium-card p-5 bg-foreground text-white mb-2">
                            <span className="text-[9px] font-normal tracking-widest uppercase text-zinc-400 block mb-2 border-b border-zinc-800 pb-2">NEXT ACTION / 次のアクション</span>
                            <p className="text-[14px] font-light leading-relaxed">{priorityData.nextAction}</p>
                        </div>
                    )}

                    {actionCards && actionCards.length > 0 ? (
                        actionCards.map((card: any) => {
                            let icon = <TrendingUp className="w-4 h-4 text-foreground" strokeWidth={1.5} />
                            if (card.category === 'attack') icon = <Zap className="w-4 h-4 text-rose-600" strokeWidth={1.5} />
                            if (card.category === 'defense') icon = <Shield className="w-4 h-4 text-muted" strokeWidth={1.5} />

                            let title = '成長 (関係強化)'
                            if (card.category === 'attack') title = '攻め (売上UP)'
                            if (card.category === 'defense') title = '防御 (失客防止)'

                            const isPriority = card.category === priorityData?.category;

                            return (
                                <ActionDetailCard
                                    key={card.id}
                                    title={title}
                                    goal={card.goal}
                                    probability={card.probability}
                                    reason={card.reason_lines?.[0] || ''}
                                    message={card.suggested_message_text}
                                    time={card.suggested_send_time_window}
                                    icon={icon}
                                    type={card.category}
                                    isPriority={isPriority}
                                />
                            )
                        })
                    ) : (
                        <div className="text-center p-8 bg-zinc-50 border border-border mt-4">
                            <p className="text-[11px] text-muted tracking-widest font-normal uppercase mb-2">
                                NO STRATEGIES FOUND
                            </p>
                            <p className="text-[10px] text-muted tracking-wide font-light">
                                LINE解析を行って最新の戦略を生成してください。
                            </p>
                        </div>
                    )}
                </section>

                {/* Notes */}
                <section className="premium-card p-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[9px] font-normal text-foreground uppercase tracking-widest flex items-center gap-2">
                            接客メモ / NOTES
                        </h2>
                        {!isEditingMemo && (
                            <button onClick={() => setIsEditingMemo(true)} className="text-[9px] font-normal text-muted uppercase tracking-widest hover:text-foreground transition-colors flex items-center gap-1">
                                <Edit3 className="w-3 h-3" strokeWidth={1.5} /> Edit
                            </button>
                        )}
                    </div>

                    {isEditingMemo ? (
                        <div className="flex flex-col gap-3">
                            <textarea
                                value={memoInput}
                                onChange={(e) => setMemoInput(e.target.value)}
                                rows={5}
                                className="w-full bg-zinc-50 border border-border p-4 text-[12px] text-foreground placeholder:text-muted focus:outline-none focus:border-foreground resize-none font-light tracking-wide transition-colors"
                                placeholder="接客に関するメモ、特徴などを入力..."
                            />
                            <div className="flex items-center justify-end gap-2 mt-1">
                                <button
                                    onClick={() => {
                                        setIsEditingMemo(false)
                                        setMemoInput(customer.notes || '')
                                    }}
                                    disabled={isSavingMemo}
                                    className="px-4 py-2 text-[10px] uppercase tracking-widest font-normal text-muted hover:text-foreground transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveMemo}
                                    disabled={isSavingMemo}
                                    className="px-4 py-2 bg-foreground text-white text-[10px] uppercase tracking-widest font-normal transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isSavingMemo ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Save'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-[12px] text-muted border-l border-border pl-4 py-1 font-light leading-relaxed whitespace-pre-wrap">
                            {customer.notes || 'メモは未登録です。'}
                        </p>
                    )}
                </section>

                {/* History & Events */}
                <div className="flex flex-col gap-4">
                    <Link href={`/customers/${customer.id}/events/new`} className="w-full bg-foreground text-white border border-foreground py-3.5 flex items-center justify-center gap-2 font-normal tracking-widest uppercase text-[11px] transition-all hover:bg-[#222] active:bg-black active:scale-[0.99]">
                        <Edit3 className="w-3.5 h-3.5" strokeWidth={1.5} />
                        来店記録を追加 / ADD VISIT
                    </Link>

                    <Link href={`/customers/${resolvedParams.id}/events`} className="premium-card p-5 flex items-center justify-between cursor-pointer active:scale-[0.99] active:bg-zinc-50 transition-all hover:border-foreground group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white border border-border flex items-center justify-center group-hover:border-foreground transition-colors">
                                <History className="w-4 h-4 text-foreground" strokeWidth={1.5} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="font-normal text-foreground tracking-widest uppercase text-[12px]">History / 履歴を一覧する</span>
                                <span className="text-[10px] text-muted font-light tracking-wide">
                                    {latestVisit
                                        ? `前回のご来店: ${new Date(latestVisit.occurred_at).toLocaleDateString('ja-JP')} (${new Intl.NumberFormat('ja-JP').format(latestVisit.amount)}円)`
                                        : '来店履歴なし'}
                                </span>
                            </div>
                        </div>
                        <ArrowLeft className="w-4 h-4 text-muted rotate-180" strokeWidth={1.5} />
                    </Link>
                </div>

            </div>
        </div>
    )
}

function ActionDetailCard({ title, goal, probability, reason, message, time, icon, type, isPriority }: any) {
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
        <div className={`premium-card p-6 ${cardBg} ${isPriority ? 'border-black border-[2px]' : borderClass} relative transition-all group overflow-hidden`}>
            {isPriority && (
                <div className="absolute top-0 right-0 bg-black text-white text-[9px] px-3 py-1 font-normal tracking-widest flex items-center gap-1 z-10">
                    ★ 優先度スコア / 最優先
                </div>
            )}

            <div className={`flex items-start justify-between mb-6 ${isPriority ? 'pt-4' : ''}`}>
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
