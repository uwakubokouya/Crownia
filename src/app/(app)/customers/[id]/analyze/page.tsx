'use client'

import { useState } from 'react'
import { ArrowLeft, MessageCircle, AlertCircle, Wand2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function AnalyzePage({ params }: { params: { id: string } }) {
    const [text, setText] = useState('')
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [result, setResult] = useState<null | any>(null)

    const handleAnalyze = () => {
        setIsAnalyzing(true)
        // Simulate AI processing
        setTimeout(() => {
            setIsAnalyzing(false)
            setResult({
                type: '承認欲求型',
                confidence: 85,
                dangerLevel: 'caution',
                stage: 'trust'
            })
        }, 2000)
    }

    return (
        <div className="flex flex-col min-h-[100dvh] bg-white pb-20">
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center justify-between">
                <Link href={`/customers/${params.id}`} className="p-2 -ml-2 text-foreground hover:text-black transition-colors">
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
                            <p className="text-[11px] text-muted font-light leading-relaxed">
                                LINEのトーク履歴をペーストしてください。<br />AIが自動で会話を解析し、最適な戦略を立案します。
                            </p>
                        </div>

                        <div className="relative group mt-4">
                            <textarea
                                className="relative w-full h-64 bg-zinc-50 border border-border p-5 text-[13px] text-foreground placeholder:text-muted focus:outline-none focus:border-foreground resize-none font-light tracking-wide transition-colors"
                                placeholder={`18:00 お客様: 今日はありがとう。\n18:05 自分: こちらこそ楽しかったよ\n...`}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                        </div>

                        <div className="flex items-start gap-3 text-[10px] text-muted font-light bg-white p-4 border border-border mt-2">
                            <AlertCircle className="w-3.5 h-3.5 text-foreground shrink-0" strokeWidth={1.5} />
                            <p className="leading-relaxed">セキュリティのため、ペーストされたトーク内容は一時的に解析のみに使用され、データベースには保存されません。</p>
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={!text || isAnalyzing}
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
                                    <span className="text-lg font-light text-foreground">{result.type}</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-[9px] font-normal text-muted uppercase tracking-widest">Stage / 段階</span>
                                    <span className="text-lg font-light text-foreground">{result.stage}</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-[9px] font-normal text-muted uppercase tracking-widest">Risk / 危険度</span>
                                    <span className="text-lg font-light text-foreground uppercase">CAUTION</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-[9px] font-normal text-muted uppercase tracking-widest">Confidence / 信頼度</span>
                                    <span className="text-lg font-light text-foreground">{result.confidence}%</span>
                                </div>
                            </div>
                        </div>

                        <Link href={`/customers/${params.id}`} className="w-full bg-foreground hover:bg-black text-white text-[11px] uppercase tracking-widest font-normal py-4 border border-foreground transition-all active:scale-[0.99] active:bg-zinc-800 flex items-center justify-center gap-3 mt-4">
                            UPDATE PROFILE / プロフィール更新 <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                        </Link>
                    </div>
                )}

            </div>
        </div>
    )
}
