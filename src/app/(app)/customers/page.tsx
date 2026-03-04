"use client"

import { Search, Plus, ShieldAlert, Zap } from 'lucide-react'
import Link from 'next/link'

export default function CustomersPage() {
    return (
        <div className="flex flex-col gap-8 p-6 pt-12">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-light tracking-wide text-foreground uppercase">Clients</h1>
                <button
                    onClick={() => alert('Add New Client (Coming soon)')}
                    className="flex items-center justify-center bg-foreground text-white p-2 border border-foreground hover:bg-white hover:text-foreground active:scale-[0.95] active:bg-zinc-800 transition-all"
                >
                    <Plus className="w-5 h-5" strokeWidth={1.5} />
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted" strokeWidth={1.5} />
                <input
                    type="text"
                    placeholder="Search by name or tag..."
                    className="w-full bg-white border border-border rounded-none pl-12 pr-4 py-3 placeholder-muted focus:outline-none focus:border-foreground text-foreground transition-all font-light text-sm tracking-wide"
                />
            </div>

            <div className="flex flex-col gap-4">
                {/* Mock Data for MVP Design */}
                <CustomerCard
                    id="1"
                    name="佐藤 健一"
                    stage="depend"
                    stageLabel="依存"
                    nextAction="「最近冷たいよね」"
                    dangerLevel="critical"
                />
                <CustomerCard
                    id="2"
                    name="山田 太郎"
                    stage="trust"
                    stageLabel="信頼"
                    nextAction="ボトルお礼フォロー"
                    dangerLevel="safe"
                />
                <CustomerCard
                    id="3"
                    name="鈴木 一郎"
                    stage="interest"
                    stageLabel="興味"
                    nextAction="次の休みの予定を探る"
                    dangerLevel="caution"
                />
            </div>
        </div>
    )
}

function CustomerCard({ id, name, stage, stageLabel, nextAction, dangerLevel }: { id: string, name: string, stage: string, stageLabel: string, nextAction: string, dangerLevel: string }) {
    const isCritical = dangerLevel === 'critical'
    const isCaution = dangerLevel === 'caution'

    const stageColors: Record<string, string> = {
        interest: 'bg-white text-muted border-border',
        build: 'bg-white text-foreground border-border',
        trust: 'bg-white text-foreground border-foreground',
        depend: 'bg-foreground text-white border-foreground',
        highvalue: 'bg-white text-foreground border-foreground font-bold'
    }

    return (
        <Link href={`/customers/${id}`} className="premium-card p-5 flex flex-col gap-5 relative overflow-hidden group hover:border-foreground transition-all cursor-pointer active:scale-[0.99] active:bg-zinc-50">
            {isCritical && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-muted/10 to-transparent pointer-events-none" />
            )}

            <div className="flex items-start justify-between">
                <div className="flex flex-col gap-2.5">
                    <h3 className="text-lg font-normal text-foreground tracking-wide">{name}</h3>
                    <span className={`text-[9px] font-normal px-3 py-1 border tracking-widest uppercase w-fit ${stageColors[stage] || stageColors.interest}`}>
                        {stageLabel}
                    </span>
                </div>

                <div className="flex flex-col gap-2 items-end">
                    {isCritical && (
                        <div className="flex items-center gap-1.5 bg-foreground px-2 py-1 text-white border border-foreground">
                            <ShieldAlert className="w-3 h-3" strokeWidth={1.5} />
                            <span className="text-[8px] uppercase font-normal tracking-widest">CRITICAL</span>
                        </div>
                    )}
                    {isCaution && (
                        <div className="flex items-center gap-1.5 bg-white px-2 py-1 text-foreground border border-foreground">
                            <AlertTriangle className="w-3 h-3" strokeWidth={1.5} />
                            <span className="text-[8px] uppercase font-normal tracking-widest">CAUTION</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <span className="text-[8px] text-muted font-normal uppercase tracking-widest flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-foreground" strokeWidth={1.5} /> NEXT ACTION
                    </span>
                    <span className="text-xs text-foreground font-light tracking-wide line-clamp-1">{nextAction}</span>
                </div>
            </div>
        </Link>
    )
}

function AlertTriangle(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
        </svg>
    )
}
