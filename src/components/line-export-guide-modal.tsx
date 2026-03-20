'use client'

import { X, Menu, Settings, Share, Copy, CheckCircle2, FileText, ArrowRight } from 'lucide-react'

interface LineExportGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function LineExportGuideModal({ isOpen, onClose }: LineExportGuideModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="w-full max-w-md bg-white border border-border shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
                
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-border bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-sm font-medium tracking-wide text-foreground uppercase">HOW TO EXPORT CHAT / トーク履歴の送信方法</h2>
                        <p className="text-[10px] text-muted font-light mt-1">LINEの全トーク履歴をテキストで一括取得</p>
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
                            <h3 className="text-[12px] font-medium text-foreground">メニューから「トーク履歴を送信」</h3>
                        </div>
                        <p className="text-[11px] text-muted font-light leading-relaxed pl-7">
                            トーク画面右上の「≡（メニュー）」を開き、「設定」＞「トーク履歴を送信」の順にタップします。
                        </p>
                        
                        {/* Illustration 1 */}
                        <div className="ml-7 mt-3 aspect-video bg-zinc-50 border border-border flex items-center justify-center relative overflow-hidden">
                            <div className="w-3/4 h-2/3 bg-white border border-border rounded-md shadow-sm flex flex-col">
                                <div className="h-8 border-b border-border flex items-center justify-end px-3 gap-2">
                                    <Menu className="w-4 h-4 text-foreground" strokeWidth={1.5} />
                                </div>
                                <div className="flex-1 flex px-2 py-4 gap-2">
                                    <div className="w-1/2 space-y-2">
                                        <div className="flex items-center gap-2 p-1.5 bg-zinc-50 border border-border rounded-sm">
                                            <Settings className="w-3 h-3 text-muted" />
                                            <div className="w-12 h-1.5 bg-zinc-200 rounded-full" />
                                        </div>
                                        <div className="flex items-center gap-2 p-1.5 bg-zinc-100 border border-foreground/30 rounded-sm relative">
                                            <Share className="w-3 h-3 text-foreground" />
                                            <div className="w-16 h-1.5 bg-foreground/60 rounded-full" />
                                            <div className="absolute -right-1 -top-1 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-50" />
                                            <div className="absolute -right-1 -top-1 w-3 h-3 bg-red-500 rounded-full" />
                                        </div>
                                    </div>
                                    <div className="w-1/2" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-foreground text-white text-[10px] font-medium">2</span>
                            <h3 className="text-[12px] font-medium text-foreground">共有メニューから「新規クイックメモ」を選択</h3>
                        </div>
                        <p className="text-[11px] text-muted font-light leading-relaxed pl-7">
                            共有メニューが開くので、「新規クイックメモ」を選択します。（※メモ帳等に保存してから開いて全選択コピーすることも可能です）
                        </p>
                        
                        {/* Illustration 2 */}
                        <div className="ml-7 mt-3 aspect-video bg-zinc-50 border border-border flex items-center justify-center relative overflow-hidden">
                            <div className="w-2/3 h-5/6 bg-white border border-border rounded-t-xl relative shadow-xl translate-y-4">
                                <div className="absolute inset-x-0 top-2 flex justify-center">
                                    <div className="w-10 h-1 bg-zinc-200 rounded-full" />
                                </div>
                                <div className="mt-8 px-4 grid grid-cols-4 gap-3">
                                    <div className="w-10 h-10 bg-zinc-100 rounded-xl" />
                                    <div className="w-10 h-10 bg-zinc-100 rounded-xl" />
                                    <div className="w-10 h-10 bg-zinc-100 rounded-xl" />
                                    <div className="w-10 h-10 bg-zinc-100 rounded-xl" />
                                </div>
                                <div className="mt-6 px-4 space-y-2">
                                    <div className="h-10 bg-zinc-50 border border-foreground/30 rounded-lg flex items-center px-3 gap-3">
                                        <FileText className="w-4 h-4 text-foreground" />
                                        <span className="text-[10px] font-medium tracking-widest text-foreground">クイックメモ / QUICK NOTE</span>
                                    </div>
                                    <div className="h-10 bg-zinc-50 rounded-lg" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-foreground text-white text-[10px] font-medium">3</span>
                            <h3 className="text-[12px] font-medium text-foreground">ここにペースト</h3>
                        </div>
                        <p className="text-[11px] text-muted font-light leading-relaxed pl-7">
                            コピーしたすべてのテキストを、Crowniaのこの画面に戻ってテキストエリアにペーストしてください。
                        </p>
                        
                        {/* Illustration 3 */}
                        <div className="ml-7 mt-3 aspect-video bg-zinc-50 border border-border flex items-center justify-center relative overflow-hidden">
                            <div className="w-3/4 h-2/3 border-2 border-dashed border-border bg-white flex flex-col items-center justify-center relative">
                                <FileText className="w-6 h-6 text-muted mb-2" strokeWidth={1.5} />
                                <span className="text-[9px] font-medium text-muted uppercase tracking-widest">Paste Here</span>
                                
                                <div className="absolute -top-3 right-4 bg-foreground text-white text-[9px] px-3 py-1.5 rounded-sm shadow-lg whitespace-nowrap animate-bounce">
                                    ペースト（貼り付け）
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
