'use client'

import { X, Check } from 'lucide-react'

interface ActionResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    actionName: string;
}

export function ActionResultModal({ isOpen, onClose, actionName }: ActionResultModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/10 backdrop-blur-md px-4">
            <div className="w-full max-w-sm bg-white border border-border rounded-[32px] p-6 shadow-[0_8px_32px_rgba(255,180,200,0.3)] animate-in zoom-in-95 duration-200">

                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-primary">作戦の結果を教えてね 📝</h2>
                    <button onClick={onClose} className="p-1.5 bg-foreground/5 hover:bg-foreground/10 rounded-full text-foreground/40 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <p className="text-sm text-foreground/60 font-medium mb-6">
                    「<span className="text-foreground/80 font-bold">{actionName}</span>」に対するお客様の反応を教えて！<br />次もっといい作戦を考えるために使うよ✨
                </p>

                <div className="flex flex-col gap-3">
                    <ResultButton label="返信あり（良感触） 💖" color="bg-emerald-100 text-emerald-600 border-emerald-200 shadow-sm" />
                    <ResultButton label="来店予約ゲット 🎉" color="bg-primary/10 text-primary border-primary/20 shadow-sm" />
                    <ResultButton label="既読スルー 🥺" color="bg-foreground/5 text-foreground/60 border-border" />
                    <ResultButton label="その他・未達 💭" color="bg-white text-foreground/40 border-border shadow-sm" />
                </div>

            </div>
        </div>
    )
}

function ResultButton({ label, color }: { label: string, color: string }) {
    return (
        <button className={`flex items-center justify-center p-3 rounded-xl border font-bold transition-all active:scale-[0.98] ${color}`}>
            {label}
        </button>
    )
}
