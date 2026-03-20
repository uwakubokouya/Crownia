'use client'

import { useState, use, useEffect } from 'react'
import { ArrowLeft, MessageCircle, AlertCircle, Wand2, ArrowRight, History } from 'lucide-react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { LineCopyGuideModal } from '@/components/line-copy-guide-modal'
import { LineExportGuideModal } from '@/components/line-export-guide-modal'

export default function AnalyzePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const [text, setText] = useState('')
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [result, setResult] = useState<null | any>(null)
    const [pastSummaries, setPastSummaries] = useState<any[]>([])
    const [isLoadingHistory, setIsLoadingHistory] = useState(true)
    const [isConsented, setIsConsented] = useState<boolean | null>(null)
    const [isGuideOpen, setIsGuideOpen] = useState(false)
    const [isExportGuideOpen, setIsExportGuideOpen] = useState(false)

    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('is_user_consented_raw')
                        .eq('id', user.id)
                        .single()
                    if (profile) {
                        setIsConsented(profile.is_user_consented_raw ?? false)
                    }
                }

                const { data, error } = await supabase
                    .from('conversation_summaries')
                    .select('*')
                    .eq('customer_id', resolvedParams.id)
                    .order('created_at', { ascending: false })
                    .limit(5)

                if (error) throw error
                setPastSummaries(data || [])
            } catch (err) {
                console.error('Error fetching data:', err)
            } finally {
                setIsLoadingHistory(false)
            }
        }
        fetchData()
    }, [resolvedParams.id, supabase])

    const handleAnalyze = async () => {
        setIsAnalyzing(true)
        setErrorMsg(null)
        setResult(null)

        try {
            const res = await fetch('/api/ai/analyze-line', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerId: resolvedParams.id,
                    chatHistory: text
                })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || '解析に失敗しました')
            }

            setResult(data.result)

            // Add the new summary to the past summaries list locally so it appears if we dismiss this logic
            if (data.result?.summaryText) {
                setPastSummaries(prev => [
                    {
                        id: 'new-' + Date.now(),
                        created_at: new Date().toISOString(),
                        summary_text: data.result.summaryText,
                        inferred_features: { last_message: data.result.lastMessage }
                    },
                    ...prev
                ])
            }

            // clear the text area since it is processed
            setText('')

        } catch (err: any) {
            console.error('Analyze Error:', err)
            setErrorMsg(err.message)
        } finally {
            setIsAnalyzing(false)
        }
    }

    return (
        <div className="flex flex-col min-h-[100dvh] bg-white pb-20">
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center justify-between">
                <Link href={`/customers/${resolvedParams.id}`} className="p-2 -ml-2 text-foreground hover:text-black transition-colors">
                    <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
                </Link>
                <span className="font-light tracking-widest text-[12px] uppercase text-foreground">LINE Analysis / LINE解析</span>
                <div className="w-9"></div>
            </header>

            <div className="flex flex-col gap-6 p-6">

                {!result ? (
                    <>
                        <div className="text-center mt-4">
                            <div className="mx-auto w-12 h-12 bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mb-6">
                                <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
                            </div>
                            <h1 className="text-lg font-light tracking-wide mb-3 text-foreground uppercase">Input Chat History / トーク履歴入力</h1>
                            <div className="flex flex-col items-center gap-3 mt-1">
                                <p className="text-[11px] text-muted font-light leading-relaxed mb-1">
                                    LINEのトーク履歴をペーストしてください。<br />AIが自動で会話を解析し、最適な戦略を立案します。
                                </p>
                                <button
                                    onClick={() => setIsExportGuideOpen(true)}
                                    className="text-[11px] text-foreground border-b border-foreground/30 hover:border-foreground transition-colors pb-0.5 inline-flex items-center"
                                >
                                    トーク履歴の送信方法はコチラ（新しく分析する場合はこちら）
                                </button>
                                <button
                                    onClick={() => setIsGuideOpen(true)}
                                    className="text-[11px] text-muted hover:text-foreground border-b border-transparent hover:border-foreground/30 transition-colors pb-0.5"
                                >
                                    トーク履歴のコピーの仕方はコチラ（トークの続きを送る場合はこちら）
                                </button>
                            </div>
                            
                            {isConsented === false && (
                                <div className="mt-6 p-3 bg-red-50 border border-red-100 rounded-sm flex items-start text-left gap-2 max-w-sm mx-auto">
                                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" strokeWidth={1.5} />
                                    <p className="text-[10px] text-red-600 font-light tracking-wide leading-relaxed">
                                        【注意】AI解析の許可がオフのため、新しいLINE解析は実行できません。設定画面から許可をオンにしてください。
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Past Summaries History Context */}
                        {!isLoadingHistory && pastSummaries.length > 0 && (
                            <div className="mt-8 mb-4 border border-border bg-zinc-50 p-5">
                                <div className="flex items-center gap-2 mb-4 text-muted">
                                    <History className="w-4 h-4" strokeWidth={1.5} />
                                    <h2 className="text-[10px] font-normal uppercase tracking-widest">Past Summaries / 過去のサマリ履歴</h2>
                                </div>
                                <div className="flex flex-col gap-4">
                                    {pastSummaries.map((summary) => (
                                        <div key={summary.id} className="bg-white border text-foreground border-border p-4 relative">
                                            <span className="text-[9px] text-muted font-normal tracking-widest uppercase mb-2 block border-b border-border/50 pb-2">
                                                {new Date(summary.created_at).toLocaleDateString('ja-JP')}
                                            </span>
                                            <p className="text-[12px] font-light leading-relaxed whitespace-pre-wrap">
                                                {summary.summary_text}
                                            </p>
                                            {summary.inferred_features?.last_message && (
                                                <div className="mt-4 pt-3 border-t border-border/30">
                                                    <span className="text-[8px] font-normal tracking-widest text-muted uppercase block mb-1.5">Last Message / 会話の最後</span>
                                                    <div className="bg-zinc-50 border border-border p-3">
                                                        <p className="text-[11px] font-light text-muted font-mono whitespace-pre-wrap leading-relaxed truncate">
                                                            {summary.inferred_features.last_message}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="relative group mt-4">
                            <textarea
                                className={`relative w-full h-64 bg-zinc-50 border border-border p-5 text-[13px] text-foreground placeholder:text-muted focus:outline-none focus:border-foreground resize-none font-light tracking-wide transition-colors ${
                                    isConsented === false ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                placeholder={isConsented === false ? 'AI解析がオフになっています' : `18:00 お客様: 今日はありがとう。\n18:05 自分: こちらこそ楽しかったよ\n...`}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                disabled={isConsented === false}
                            />
                        </div>

                        <div className="flex items-start gap-3 text-[10px] text-muted font-light bg-white p-4 border border-border mt-2">
                            <AlertCircle className="w-3.5 h-3.5 text-foreground shrink-0" strokeWidth={1.5} />
                            <p className="leading-relaxed">セキュリティのため、ペーストされたトーク内容は暗号化通信により、一時的にAI解析に使用されます。</p>
                        </div>

                        {errorMsg && (
                            <div className="flex items-start gap-3 text-[11px] text-rose-600 font-light bg-rose-50 p-4 border border-rose-200 mt-2">
                                <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                                <p className="leading-relaxed">{errorMsg}</p>
                            </div>
                        )}

                        <button
                            onClick={handleAnalyze}
                            disabled={!text || isAnalyzing || isConsented === false}
                            className="w-full mt-4 bg-foreground hover:bg-black disabled:bg-zinc-100 disabled:text-muted disabled:border-border text-white text-[11px] uppercase tracking-widest font-normal py-4 border border-foreground transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                        >
                            {isAnalyzing ? (
                                <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Wand2 className="w-4 h-4" strokeWidth={1.5} /> START ANALYSIS / 解析開始
                                </>
                            )}
                        </button>
                    </>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-8 mt-4">
                        <div className="text-center mb-2">
                            <div className="mx-auto w-12 h-12 border border-rose-200 bg-rose-50 text-rose-600 flex items-center justify-center mb-6">
                                <Wand2 className="w-5 h-5" strokeWidth={1.5} />
                            </div>
                            <h1 className="text-xl font-light tracking-widest text-foreground mb-3 uppercase">Analysis Complete / 解析完了</h1>
                            <p className="text-[11px] text-muted font-light leading-relaxed">
                                AIによる解析が完了しました。<br />以下の情報でお客様のプロフィールを更新しますか？
                            </p>
                        </div>

                        <div className="bg-white border border-border p-6 relative overflow-hidden">
                            <div className="grid grid-cols-2 gap-y-8 gap-x-4">
                                <div className="flex flex-col gap-2">
                                    <span className="text-[9px] font-normal text-muted uppercase tracking-widest">Type / タイプ</span>
                                    <span className="text-lg font-light text-foreground">
                                        {{
                                            approval: '承認欲求型',
                                            lonely: '寂しがり屋型',
                                            control: '支配型',
                                            hobby: '趣味特化型',
                                            status: 'ステータス誇示型'
                                        }[result.type as string] || result.type}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-[9px] font-normal text-muted uppercase tracking-widest">Stage / 段階</span>
                                    <span className="text-lg font-light text-foreground">
                                        {{
                                            interest: '興味',
                                            build: '関係構築',
                                            trust: '信頼',
                                            depend: '依存',
                                            highvalue: '高単価'
                                        }[result.stage as string] || result.stage}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-[9px] font-normal text-muted uppercase tracking-widest">Risk / 危険度</span>
                                    <span className="text-lg font-light text-foreground uppercase">
                                        {{
                                            safe: '安全 (SAFE)',
                                            caution: '注意 (CAUTION)',
                                            danger: '危険 (DANGER)',
                                            critical: '致命的 (CRITICAL)'
                                        }[result.dangerLevel as string] || result.dangerLevel}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-[9px] font-normal text-muted uppercase tracking-widest">Confidence / 信頼度</span>
                                    <span className="text-lg font-light text-foreground">{result.confidence}%</span>
                                </div>
                            </div>
                        </div>

                        {result.summaryText && (
                            <div className="bg-zinc-50 border border-border p-5 relative overflow-hidden mt-4">
                                <h3 className="text-[10px] font-normal text-muted uppercase tracking-widest mb-3">会話サマリ</h3>
                                <p className="text-[12px] font-light leading-relaxed text-foreground whitespace-pre-wrap">{result.summaryText}</p>
                            </div>
                        )}

                        <Link href={`/customers/${resolvedParams.id}`} className="w-full bg-foreground hover:bg-black text-white text-[11px] uppercase tracking-widest font-normal py-4 border border-foreground transition-all active:scale-[0.99] active:bg-zinc-800 flex items-center justify-center gap-3 mt-4">
                            UPDATE PROFILE / プロフィール更新 <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                        </Link>
                    </div>
                )}

            </div>

            <LineCopyGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
            <LineExportGuideModal isOpen={isExportGuideOpen} onClose={() => setIsExportGuideOpen(false)} />
        </div>
    )
}
