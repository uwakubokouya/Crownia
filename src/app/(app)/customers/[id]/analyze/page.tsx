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
        <div className="flex flex-col min-h-[100dvh] bg-background pb-20">
            <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center gap-4">
                <Link href={`/customers/${params.id}`} className="p-2 -ml-2 text-foreground/50 hover:text-primary transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <span className="font-bold text-lg text-foreground">LINE分析 💬</span>
            </header>

            <div className="flex flex-col gap-6 p-6">

                {!result ? (
                    <>
                        <div className="text-center">
                            <div className="mx-auto w-16 h-16 rounded-3xl bg-[#06C755]/10 flex items-center justify-center mb-4">
                                <MessageCircle className="w-8 h-8 text-[#06C755]" />
                            </div>
                            <h1 className="text-xl font-bold tracking-tight mb-2 text-foreground">LINEトークをペーストしてね 💌</h1>
                            <p className="text-sm text-foreground/60 font-medium">
                                LINEのトーク履歴をそのままペーストしてね。<br />AIが自動で話者を分けて、ぴったりの作戦を考えるよ✨
                            </p>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-br from-[#06C755]/30 to-blue-500/30 rounded-3xl blur opacity-30 group-focus-within:opacity-100 transition duration-500" />
                            <textarea
                                className="relative w-full h-64 bg-white/60 border border-border shadow-inner rounded-2xl p-4 text-sm text-foreground/80 placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-[#06C755]/50 resize-none font-medium"
                                placeholder={`18:00 お客様: 今日はありがとう。\n18:05 自分: こちらこそ楽しかったよ✨\n...`}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                        </div>

                        <div className="flex items-start gap-2 text-xs text-foreground/50 font-bold bg-white/40 p-3 rounded-xl border border-border">
                            <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0" />
                            <p>セキュリティのため、トーク内容は保存されず、要約だけが残るから安心してね🔒</p>
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={!text || isAnalyzing}
                            className="w-full bg-[#06C755] hover:bg-[#05b34c] disabled:bg-foreground/10 disabled:text-foreground/30 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#06C755]/20 active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {isAnalyzing ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Wand2 className="w-5 h-5" /> 解析スタート ✨
                                </>
                            )}
                        </button>
                    </>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-6">
                        <div className="text-center mb-2">
                            <div className="mx-auto w-16 h-16 rounded-3xl bg-blue-500/10 flex items-center justify-center mb-4">
                                <Wand2 className="w-8 h-8 text-blue-500" />
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">解析完了 🎉</h1>
                            <p className="text-sm text-foreground/60 font-medium">
                                AIがお客様の心理と一番いい作戦を考えたよ！<br />この内容でお客様の情報を更新する？
                            </p>
                        </div>

                        <div className="glass rounded-3xl p-6 border-blue-500/20 shadow-sm bg-gradient-to-br from-blue-500/5 to-white/50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">タイプ</span>
                                    <span className="text-lg font-black text-foreground/80">{result.type}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">段階</span>
                                    <span className="text-lg font-black text-foreground/80">{result.stage}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">危険度</span>
                                    <span className="text-lg font-black text-orange-500">警戒 ✨</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">自信度</span>
                                    <span className="text-lg font-black text-primary">{result.confidence}%</span>
                                </div>
                            </div>
                        </div>

                        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center gap-2">
                            お客様情報を更新する 💖 <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                )}

            </div>
        </div>
    )
}
