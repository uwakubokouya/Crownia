"use client"

import { ArrowLeft, Edit3, MessageCircle, MoreVertical, Zap, Shield, TrendingUp, History, Loader2, X, Sparkles, RefreshCw, Star } from 'lucide-react'
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
    const [priorityData, setPriorityData] = useState<{ category?: string, nextAction?: string, summaryText?: string, humanNature?: string } | null>(null)
    const [isAiModalOpen, setIsAiModalOpen] = useState(false)
    const [isRegenerating, setIsRegenerating] = useState(false)
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
                    .select('inferred_features, summary_text')
                    .eq('customer_id', resolvedParams.id)
                    .order('created_at', { ascending: false })
                    .limit(1)

                if (summaryData && summaryData.length > 0) {
                    setPriorityData({
                        category: summaryData[0].inferred_features?.priority_category,
                        nextAction: summaryData[0].inferred_features?.next_action,
                        summaryText: summaryData[0].summary_text,
                        humanNature: summaryData[0].inferred_features?.human_nature
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

    const handleRegenerateAnalysis = async () => {
        if (!customer) return;
        setIsRegenerating(true);
        
        try {
            // Get raw messages for this customer
            const { data: messages, error: msgError } = await supabase
                .from('messages')
                .select('message_text')
                .eq('customer_id', resolvedParams.id)
                .order('created_at', { ascending: false })
                .limit(1)

            if (msgError) throw msgError;
            
            if (!messages || messages.length === 0) {
                alert('LINEのトーク履歴が見つかりません。先にLINE解析からトーク履歴をインポートしてください。');
                setIsRegenerating(false);
                return;
            }

            const latestChatHistory = messages[0].message_text;

            const res = await fetch('/api/ai/analyze-character', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerId: resolvedParams.id,
                    chatHistory: latestChatHistory
                })
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => null);
                throw new Error(errData?.error || 'Analysis failed');
            }

            // Reload the page to get the freshest data
            window.location.reload();

        } catch (error: any) {
            console.error('Error regenerating:', error);
            alert(`再分析中にエラーが発生しました: ${error.message}`);
            setIsRegenerating(false);
        }
    }

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

    const toggleFavorite = async () => {
        if (!customer) return
        const newValue = !customer.is_favorite
        try {
            const { error } = await supabase
                .from('customers')
                .update({ is_favorite: newValue })
                .eq('id', resolvedParams.id)

            if (error) throw error
            setCustomer((prev: any) => ({ ...prev, is_favorite: newValue }))
        } catch (error) {
            console.error('Error toggling favorite:', error)
            alert('お気に入りの更新に失敗しました。マイグレーションが完了しているか確認してください。')
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

    const typeStrategies: Record<string, { desc: string, strategy: string }> = {
        approval: {
            desc: '高い頻度で絵文字やスタンプを使用し、プレゼントや自慢話が多く、褒められることを好む傾向があります。',
            strategy: '些細な変化や服装、持ち物を褒めましょう。会話では聞き役に徹し、「すごい」「知らなかった」など自尊心を満たすリアクションを多用することが効果的です。'
        },
        lonely: {
            desc: '「寂しい」「会いたい」などの発言が多く、夜中や早朝の連絡、長文が多い傾向があります。',
            strategy: '連絡頻度を高く保ちましょう。「今何してるの？」「声が聞きたいな」など、特別感を与えて依存させるような言葉選びが効果的です。'
        },
        control: {
            desc: '質問が多く、店を決めたりリードしたがる傾向があります。「俺が教える」といった発言が目立ちます。',
            strategy: '相手の意見やお店選びを尊重し、「頼りになる」「〇〇さんに任せたい」と伝えましょう。適度に甘える姿勢を見せることで、相手の「リードしたい欲求」を満たすことが重要です。'
        },
        hobby: {
            desc: '特定の趣味（ゴルフ、車、ゲームなど）の話題が中心となる傾向があります。',
            strategy: '相手の趣味に関する質問を積極的に行い、教えてもらう姿勢を取りましょう。「今度一緒に〜したい」と趣味に関連付けた同伴や、お店への誘いが有効です。'
        },
        status: {
            desc: 'IT職・経営者など職業の自慢、お金の話、高級品の話が多い傾向があります。',
            strategy: '相手の仕事の成功や持ち物の価値を高く評価しましょう。「〇〇さんみたいな人は初めて」と特別視し、高級なお店やボトルでの接客を提案しやすいタイプです。'
        }
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
                <div className="flex items-center gap-1">
                    <button onClick={toggleFavorite} className="p-2 text-foreground hover:text-yellow-500 transition-colors active:scale-[0.95] active:bg-zinc-100 flex items-center justify-center">
                        <Star className="w-5 h-5" strokeWidth={1.5} fill={customer?.is_favorite ? "currentColor" : "none"} color={customer?.is_favorite ? "#eab308" : "currentColor"} />
                    </button>
                    <Link href={`/customers/${resolvedParams.id}/edit`} className="p-2 text-foreground hover:text-black transition-colors active:scale-[0.95] active:bg-zinc-100 block">
                        <Edit3 className="w-4 h-4" strokeWidth={1.5} />
                    </Link>
                    <button onClick={() => alert('Options (Coming soon)')} className="p-2 text-foreground hover:text-black transition-colors active:scale-[0.95] active:bg-zinc-100 hidden">
                        <MoreVertical className="w-5 h-5" strokeWidth={1.5} />
                    </button>
                </div>
            </header>

            <div className="flex flex-col gap-8 p-6">
                {/* Profile Card */}
                <section className="flex flex-col items-center text-center gap-4">
                    <button onClick={() => setIsAiModalOpen(true)} className="w-24 h-24 bg-white border border-border flex items-center justify-center p-1 cursor-pointer hover:border-foreground transition-colors active:scale-95">
                        <div className="w-full h-full bg-foreground flex items-center justify-center text-3xl font-light text-white">
                            {customer.display_name.charAt(0)}
                        </div>
                    </button>
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

            {/* AI Analysis Modal */}
            {isAiModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-sm rounded-[1px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-4 border-b border-border flex items-center justify-between bg-zinc-50">
                            <h3 className="font-light tracking-widest text-[13px] uppercase flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-rose-500" strokeWidth={1.5} />
                                AI Analysis / 性格分析
                            </h3>
                            <button onClick={handleRegenerateAnalysis} disabled={isRegenerating} className="text-muted hover:text-black active:scale-95 transition-all w-8 h-8 flex items-center justify-center mr-2 disabled:opacity-50">
                                <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin text-rose-500' : ''}`} strokeWidth={1.5} />
                            </button>
                            <button onClick={() => setIsAiModalOpen(false)} className="text-muted hover:text-black">
                                <X className="w-5 h-5" strokeWidth={1.5} />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex flex-col gap-6">
                            {/* AI Summary */}
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-normal tracking-widest uppercase text-muted">本質的な人間性</span>
                                <div className="p-4 bg-zinc-50 border border-border text-[13px] font-light leading-relaxed text-foreground whitespace-pre-wrap">
                                    {priorityData?.humanNature || "性格分析のデータがまだありません。右上の更新ボタンを押して最新のLINE履歴から性格分析を実行してください。"}
                                </div>
                            </div>
                            
                            {/* Type Specific Features */}
                            {customer.current_type && typeStrategies[customer.current_type] && (
                                <div className="flex flex-col gap-4 border-t border-border pt-6">
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 bg-foreground text-white text-[10px] font-normal tracking-widest uppercase mb-2">
                                            {typeLabels[customer.current_type]}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <span className="text-[10px] font-normal tracking-widest uppercase text-muted block mb-1.5">特徴 / Features</span>
                                            <p className="text-[12px] font-light leading-relaxed text-foreground">
                                                {typeStrategies[customer.current_type].desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {!customer.current_type && (
                                <div className="text-center p-6 border border-border bg-zinc-50 mt-2">
                                    <p className="text-[11px] text-muted tracking-wide font-light">
                                        タイプが判定されていません。LINE解析を行ってください。
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
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
