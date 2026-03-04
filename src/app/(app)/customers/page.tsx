import { Search, Plus, ShieldAlert, Zap } from 'lucide-react'
import Link from 'next/link'

export default function CustomersPage() {
    return (
        <div className="flex flex-col gap-6 p-6 pt-10">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-wider text-foreground">お客様一覧</h1>
                <button className="flex items-center justify-center bg-primary text-white p-2.5 rounded-xl hover:bg-primary/90 transition-colors shadow-[0_4px_15px_-3px_rgba(197,160,89,0.3)]">
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted" />
                <input
                    type="text"
                    placeholder="名前やタグで検索..."
                    className="w-full bg-white border border-border shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] rounded-xl pl-12 pr-4 py-3.5 placeholder-muted/60 focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground transition-all font-medium"
                />
            </div>

            <div className="flex flex-col gap-3">
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
        interest: 'bg-stone-50 text-stone-500 border border-border/80',
        build: 'bg-primary-light text-primary-dark border border-primary/20',
        trust: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
        depend: 'bg-primary/10 text-primary border border-primary/30',
        highvalue: 'bg-gradient-to-r from-[#D4AF37]/10 to-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30'
    }

    return (
        <Link href={`/customers/${id}`} className="premium-card p-4 flex flex-col gap-4 relative overflow-hidden group hover:shadow-lg transition-all cursor-pointer active:scale-[0.99]">
            {isCritical && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-red-100/30 to-transparent pointer-events-none" />
            )}

            <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1.5">
                    <h3 className="text-lg font-bold text-foreground tracking-wide">{name}</h3>
                    <span className={`text-[9px] font-bold px-3 py-1 rounded-sm w-fit tracking-widest ${stageColors[stage] || stageColors.interest}`}>
                        {stageLabel}
                    </span>
                </div>

                {isCritical && (
                    <div className="flex items-center gap-1 bg-red-50 px-2 py-1 rounded-sm text-red-600 border border-red-100">
                        <ShieldAlert className="w-3 h-3" />
                        <span className="text-[9px] uppercase font-bold tracking-widest">要注意</span>
                    </div>
                )}
                {isCaution && (
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-sm text-amber-600 border border-amber-100">
                        <AlertTriangle className="w-3 h-3" />
                        <span className="text-[9px] uppercase font-bold tracking-widest">警戒</span>
                    </div>
                )}
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-muted font-bold uppercase tracking-widest flex items-center gap-1">
                        <Zap className="w-3 h-3 text-primary fill-primary/20" /> 次のアクション
                    </span>
                    <span className="text-sm text-foreground/80 font-medium tracking-wide line-clamp-1">{nextAction}</span>
                </div>
            </div>
        </Link>
    )
}

function AlertTriangle(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
        </svg>
    )
}
