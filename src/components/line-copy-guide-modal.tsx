'use client'

import { X, Hand, Smartphone, Copy, CheckCircle2, MessageSquare, Plus, ArrowUpRight, MousePointer2 } from 'lucide-react'

interface LineCopyGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function LineCopyGuideModal({ isOpen, onClose }: LineCopyGuideModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="w-full max-w-md bg-white border border-border shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
                
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-border bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-sm font-medium tracking-wide text-foreground uppercase">HOW TO COPY CHAT / トーク履歴のコピー方法</h2>
                        <p className="text-[10px] text-muted font-light mt-1">iOSの機能を使って複数メッセージを一括コピー</p>
                    </div>
                    <button onClick={onClose} className="p-2 -mr-2 text-muted hover:text-black transition-colors shrink-0">
                        <X className="w-5 h-5" strokeWidth={1.5} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-5 overflow-y-auto space-y-8 pb-10">
                    
                    {/* Step 1 */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-foreground text-white text-[10px] font-medium">1</span>
                            <h3 className="text-[12px] font-medium text-foreground">メッセージを長押し＆少しスライド</h3>
                        </div>
                        <p className="text-[11px] text-muted font-light leading-relaxed pl-7">
                            LINEのトーク画面で、コピーしたい最初のメッセージを長押しし、そのまま少し横にスライドさせます。
                        </p>
                        
                        {/* Illustration 1 */}
                        <div className="ml-7 mt-3 aspect-video bg-zinc-50 border border-border flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-x-8 inset-y-6 flex flex-col gap-3">
                                <div className="h-8 w-2/3 bg-white border border-border rounded-2xl rounded-tl-sm self-start" />
                                <div className="h-10 w-3/4 bg-[#06C755] opacity-20 border border-[#06C755]/30 rounded-2xl rounded-tr-sm self-end rotate-2 scale-105 shadow-lg transition-transform" />
                                <div className="h-8 w-1/2 bg-white border border-border rounded-2xl rounded-tl-sm self-start" />
                            </div>
                            <div className="absolute top-1/2 right-1/4 transform -translate-y-1/2">
                                <MousePointer2 className="w-8 h-8 text-foreground fill-foreground/20 -rotate-12" strokeWidth={1} />
                                <div className="absolute top-0 -left-6 w-16 h-8 border-t-2 border-foreground/30 border-dashed rounded-[100%] -rotate-12" />
                            </div>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-foreground text-white text-[10px] font-medium">2</span>
                            <h3 className="text-[12px] font-medium text-foreground">別の指で他のメッセージをタップ</h3>
                        </div>
                        <p className="text-[11px] text-muted font-light leading-relaxed pl-7">
                            画面から指を離さずに、反対の手の指を使って他のコピーしたいメッセージを次々とタップします。メッセージが重なっていきます。
                        </p>
                        
                        {/* Illustration 2 */}
                        <div className="ml-7 mt-3 aspect-video bg-zinc-50 border border-border flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-x-8 inset-y-6 flex flex-col gap-3">
                                <div className="h-8 w-2/3 bg-white border border-border rounded-2xl rounded-tl-sm self-start relative">
                                    <div className="absolute inset-0 bg-black/5 rounded-2xl rounded-tl-sm" />
                                </div>
                                <div className="h-8 w-3/4 bg-white border border-border rounded-2xl rounded-tr-sm self-end relative">
                                     <div className="absolute inset-0 bg-black/5 rounded-2xl rounded-tr-sm" />
                                </div>
                                <div className="h-8 w-1/2 bg-white border border-border rounded-2xl rounded-tl-sm self-start relative" />
                            </div>
                            
                            {/* Stacked messages */}
                            <div className="absolute top-1/2 right-1/4 transform -translate-y-1/2 ml-4">
                                <div className="relative">
                                    <div className="h-10 w-32 bg-[#06C755]/20 border border-[#06C755]/30 rounded-2xl shadow-sm rotate-6 absolute top-2 left-2" />
                                    <div className="h-10 w-32 bg-[#06C755]/20 border border-[#06C755]/30 rounded-2xl shadow-md rotate-3 absolute top-1 left-1" />
                                    <div className="h-10 w-32 bg-[#06C755]/20 border border-[#06C755]/30 rounded-2xl shadow-lg relative flex items-center justify-center">
                                        <span className="text-[#06C755] font-bold text-xs bg-white pt-0.5 pb-0.5 px-1.5 rounded-full border border-[#06C755]/30">3</span>
                                    </div>
                                    <MousePointer2 className="w-8 h-8 text-foreground fill-foreground/20 absolute -bottom-4 -right-2 -rotate-12 z-10" strokeWidth={1} />
                                </div>
                            </div>
                            
                            {/* Tap other message */}
                            <div className="absolute bottom-6 left-1/3">
                                <MousePointer2 className="w-6 h-6 text-foreground/60 fill-transparent scale-x-[-1] animate-pulse" strokeWidth={1.5} />
                            </div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-foreground text-white text-[10px] font-medium">3</span>
                            <h3 className="text-[12px] font-medium text-foreground">メモ帳を開いてドロップ</h3>
                        </div>
                        <p className="text-[11px] text-muted font-light leading-relaxed pl-7">
                            指を離さずに、ホーム画面などから「メモ帳」アプリを開きます。新規メモの画面に指を持っていき、指を離す（ドロップ）とメッセージが貼り付けられます。
                        </p>
                        
                        {/* Illustration 3 */}
                        <div className="ml-7 mt-3 aspect-video bg-zinc-50 border border-border flex items-center justify-center relative overflow-hidden">
                            <div className="w-2/3 h-5/6 bg-white border border-border rounded-t-md relative shadow-sm">
                                <div className="absolute inset-x-0 top-0 h-6 border-b border-border flex items-center px-2">
                                    <div className="w-12 h-1.5 bg-zinc-200 rounded-full" />
                                </div>
                                <div className="p-3 space-y-2 mt-6">
                                    <div className="w-3/4 h-2 bg-zinc-100 rounded-full" />
                                    <div className="w-full h-2 bg-zinc-100 rounded-full" />
                                    <div className="w-5/6 h-2 bg-zinc-100 rounded-full" />
                                </div>
                                
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4 z-10">
                                     <div className="h-10 w-32 bg-[#06C755]/20 border border-[#06C755]/30 rounded-2xl shadow-xl flex items-center justify-center">
                                        <span className="text-[#06C755] font-bold text-xs bg-white pt-0.5 pb-0.5 px-1.5 rounded-full border border-[#06C755]/30">3</span>
                                    </div>
                                    <MousePointer2 className="w-8 h-8 text-foreground fill-foreground/20 absolute -bottom-4 -right-2 -rotate-12" strokeWidth={1} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 4 */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-foreground text-white text-[10px] font-medium">4</span>
                            <h3 className="text-[12px] font-medium text-foreground">全選択してコピーし、ここにペースト</h3>
                        </div>
                        <p className="text-[11px] text-muted font-light leading-relaxed pl-7">
                            メモ帳に貼り付けられたテキストを「すべて選択」してコピーし、Crowniaのこの画面に戻ってテキストエリアにペーストしてください。
                        </p>
                        
                        {/* Illustration 4 */}
                        <div className="ml-7 mt-3 aspect-video bg-zinc-50 border border-border flex items-center justify-center relative overflow-hidden">
                            <div className="w-3/4 h-2/3 border-2 border-dashed border-border bg-white flex flex-col items-center justify-center relative">
                                <Copy className="w-6 h-6 text-muted mb-2" strokeWidth={1.5} />
                                <span className="text-[9px] font-medium text-muted uppercase tracking-widest">Paste Here</span>
                                
                                {/* Paste tooltip popover */}
                                <div className="absolute -top-3 right-4 bg-foreground text-white text-[9px] px-3 py-1.5 rounded-sm shadow-lg whitespace-nowrap animate-bounce">
                                    ペースト
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rotate-45" />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                
                {/* Footer Action */}
                <div className="p-4 border-t border-border bg-zinc-50 mt-auto">
                    <button 
                        onClick={onClose}
                        className="w-full bg-foreground hover:bg-black text-white text-[11px] uppercase tracking-widest font-normal py-4 transition-colors flex items-center justify-center gap-2"
                    >
                        <CheckCircle2 className="w-4 h-4" strokeWidth={1.5} /> わかった / GOT IT
                    </button>
                </div>

            </div>
        </div>
    )
}
