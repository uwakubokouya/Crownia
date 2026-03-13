"use client"

import { useState, useEffect } from 'react'
import { ArrowRight, Check, X, Star, MessageCircle, BarChart, Calendar, Settings } from 'lucide-react'

export function TutorialOverlay() {
    const [isVisible, setIsVisible] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)

    useEffect(() => {
        // Check if tutorial was already completed
        const isCompleted = localStorage.getItem('crownia_tutorial_completed')
        if (!isCompleted) {
            // Slight delay to allow base UI to render before showing overlay
            setTimeout(() => {
                setIsVisible(true)
            }, 500)
        }

        const handleShowTutorial = () => {
            setCurrentStep(0)
            setIsVisible(true)
        }
        
        window.addEventListener('showTutorial', handleShowTutorial)
        return () => window.removeEventListener('showTutorial', handleShowTutorial)
    }, [])

    const handleComplete = () => {
        localStorage.setItem('crownia_tutorial_completed', 'true')
        setIsVisible(false)
    }

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            handleComplete()
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    if (!isVisible) return null

    const steps = [
        {
            title: "Welcome to Crownia",
            subtitle: "次世代の接客戦略AIツール",
            icon: <Star className="w-8 h-8 text-black" strokeWidth={1} />,
            content: (
                <div className="flex flex-col gap-4 text-left">
                    <p className="text-[13px] font-light leading-relaxed text-zinc-700">
                        Crowniaをご利用いただきありがとうございます。<br /><br />
                        このツールは、お客様の情報を管理するだけでなく、<b>独自のAIがLINEの会話を分析し、最適な接客戦略をパーソナライズして提供</b>します。<br /><br />
                        まずは基本的な使い方と用語についてご案内します。
                    </p>
                </div>
            )
        },
        {
            title: "Terminology & Stages",
            subtitle: "用語と関係性の段階について",
            icon: <BarChart className="w-8 h-8 text-black" strokeWidth={1} />,
            content: (
                <div className="flex flex-col gap-5 text-left">
                    <div>
                        <span className="text-[11px] font-normal tracking-widest uppercase mb-2 block border-b pb-1">関係性段階 (Stages)</span>
                        <p className="text-[12px] font-light leading-relaxed text-zinc-700 mb-2">
                            お客様とあなたとの現在の関係性を5段階で表します。
                        </p>
                        <ul className="text-[11px] font-light flex flex-col gap-1.5 pl-2 border-l-2 border-black/10">
                            <li><b className="font-normal text-black">興味 (Interest):</b> まだ関係が浅く、来店動機を探る段階</li>
                            <li><b className="font-normal text-black">関係構築 (Build):</b> 共通点を見つけ、親密度を上げる段階</li>
                            <li><b className="font-normal text-black">信頼 (Trust):</b> あなたを信頼し、安定して来店してくれる段階</li>
                            <li><b className="font-normal text-black">依存 (Depend):</b> あなたがいないとダメな状態・優先度が高い段階</li>
                            <li><b className="font-normal text-black">高単価 (High Value):</b> 信頼関係が極まり、高額な投資を行ってくれる段階</li>
                        </ul>
                    </div>
                    <div>
                        <span className="text-[11px] font-normal tracking-widest uppercase mb-1 block border-b pb-1">AI優先度スコア</span>
                        <p className="text-[12px] font-light leading-relaxed text-zinc-700">
                            AIが顧客の来店確率や失客リスクを独自のアルゴリズムで計算したスコアです。<br/>ホーム画面の「TODAY'S TASK」はこのスコアの高い順に表示されます。
                        </p>
                    </div>
                </div>
            )
        },
        {
            title: "Clients & LINE Analysis",
            subtitle: "顧客管理とLINE解析",
            icon: <MessageCircle className="w-8 h-8 text-black" strokeWidth={1} />,
            content: (
                <div className="flex flex-col gap-4 text-left">
                    <p className="text-[13px] font-light leading-relaxed text-zinc-700">
                        「CLIENTS」タブでは、お客様の登録・管理を行います。<br /><br />
                        <b>【🌟 最も重要な機能】</b><br />
                        顧客詳細画面から<b>「LINE解析」</b>を実行してください。LINEのトーク履歴（エクスポートしたテキスト）を貼り付けるだけで、AIが自動で<b>現在の段階、性格タイプ、そして今送るべきメッセージ（NEXT ACTION）</b>を生成します。
                    </p>
                </div>
            )
        },
        {
            title: "Calendar & History",
            subtitle: "来店履歴とスケジュール",
            icon: <Calendar className="w-8 h-8 text-black" strokeWidth={1} />,
            content: (
                <div className="flex flex-col gap-4 text-left">
                    <p className="text-[13px] font-light leading-relaxed text-zinc-700">
                        「CALENDAR」タブでは、月間のスケジュールと過去の履歴を確認できます。<br /><br />
                        顧客詳細画面から「来店履歴（Visit）」を登録すると、自動的にカレンダーに過去の来店日と売上が表示されます。<br />
                        また、手動で未来の予定（同伴など）をカレンダーに追加することも可能です。
                    </p>
                </div>
            )
        },
        {
            title: "Settings & Support",
            subtitle: "設定画面について",
            icon: <Settings className="w-8 h-8 text-black" strokeWidth={1} />,
            content: (
                <div className="flex flex-col gap-4 text-left">
                    <p className="text-[13px] font-light leading-relaxed text-zinc-700">
                        「SETTINGS」タブでは、プロフィールの変更やStripe連携のほか、<b>「AI優先度スコア設定」</b>が行えます。<br />
                        ここでは、AIが今日のタスク優先度を決める際の独自の基準（来店頻度や売上などの重要度）をカスタマイズできます。<br /><br />
                        操作に迷った場合やエラーが発生した場合は、「よくある質問・サポート」をご確認ください。<br /><br />
                        <b className="text-black">※このチュートリアルは、設定の「チュートリアルを再確認する」からいつでも見直せます。</b><br /><br />
                        <i>準備は完了です。Crowniaで新しい接客体験を始めましょう。</i>
                    </p>
                </div>
            )
        }
    ]

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-sm rounded-none border border-white/20 shadow-2xl overflow-hidden flex flex-col relative">
                
                {/* Close Button (Skip) */}
                <button 
                    onClick={handleComplete}
                    className="absolute top-4 right-4 text-zinc-400 hover:text-black transition-colors z-10 p-1"
                >
                    <X className="w-5 h-5" strokeWidth={1.5} />
                </button>

                {/* Header Area */}
                <div className="p-8 pb-6 flex flex-col items-center justify-center text-center bg-zinc-50 border-b border-border relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-black/5 rounded-full blur-2xl"></div>
                    <div className="w-16 h-16 bg-white border border-border flex items-center justify-center mb-6 shadow-sm z-10">
                        {steps[currentStep].icon}
                    </div>
                    <h2 className="text-xl font-light tracking-widest text-foreground uppercase z-10">
                        {steps[currentStep].title}
                    </h2>
                    <span className="text-[10px] tracking-widest uppercase text-muted mt-2 font-normal z-10">
                        {steps[currentStep].subtitle}
                    </span>
                </div>

                {/* Content Area */}
                <div className="p-8 bg-white min-h-[200px]">
                    {steps[currentStep].content}
                </div>

                {/* Footer Area */}
                <div className="p-6 border-t border-border flex flex-col gap-4 bg-zinc-50">
                    
                    {/* Progress Dots */}
                    <div className="flex justify-center gap-2 mb-2">
                        {steps.map((_, idx) => (
                            <div 
                                key={idx} 
                                className={`h-0.5 transition-all ${idx === currentStep ? 'w-6 bg-black' : 'w-2 bg-zinc-300'}`}
                            />
                        ))}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={prevStep}
                            className={`text-[10px] tracking-widest uppercase font-normal px-4 py-2 transition-colors ${currentStep === 0 ? 'text-transparent cursor-default' : 'text-muted hover:text-black'}`}
                            disabled={currentStep === 0}
                        >
                            Back
                        </button>

                        <button
                            onClick={nextStep}
                            className="bg-black text-white px-6 py-3 text-[11px] tracking-widest font-normal uppercase flex items-center gap-2 hover:bg-zinc-800 active:scale-95 transition-all"
                        >
                            {currentStep === steps.length - 1 ? (
                                <>GET STARTED <Check className="w-3.5 h-3.5" strokeWidth={2}/></>
                            ) : (
                                <>NEXT <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5}/></>
                            )}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}
