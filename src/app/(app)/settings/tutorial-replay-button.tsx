"use client"

import { BookOpen } from 'lucide-react'

export function TutorialReplayButton() {
    return (
        <button 
            onClick={() => window.dispatchEvent(new Event('showTutorial'))}
            className="flex items-center justify-between p-5 premium-card group active:scale-[0.99] transition-all hover:border-foreground bg-white border border-border w-full text-left"
        >
            <div className="flex items-center gap-4">
                <div className="text-muted group-hover:text-foreground transition-colors">
                    <BookOpen strokeWidth={1.5} />
                </div>
                <span className="font-light text-[14px] text-foreground tracking-wide">チュートリアルを再確認する</span>
            </div>
            <svg className="w-4 h-4 text-muted/40 group-hover:text-foreground transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
        </button>
    )
}
