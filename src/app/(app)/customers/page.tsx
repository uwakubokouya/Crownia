import { Search, Plus, ThumbsUp, ShieldAlert, Zap } from 'lucide-react'
import Link from 'next/link'

export default function CustomersPage() {
    return (
        <div className="flex flex-col gap-6 p-6 pt-10">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-primary">お客様一覧 👩‍❤️‍👨</h1>
                <button className="flex items-center justify-center bg-primary text-white p-2.5 rounded-2xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30">
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-stone-300" />
                <input
                    type="text"
                    placeholder="名前やタグで検索..."
                    className="w-full bg-white border border-stone-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] rounded-2xl pl-12 pr-4 py-3.5 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-200 text-stone-700 transition-all font-bold"
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
        interest: 'bg-stone-50 text-stone-500',
        build: 'bg-blue-50 text-blue-500',
        trust: 'bg-emerald-50 text-emerald-600',
        depend: 'bg-rose-50 text-rose-500',
        highvalue: 'bg-amber-50 text-amber-500' // Gold-like
    }

    return (
        <Link href={`/customers/${id}`} className="premium-card p-4 flex flex-col gap-4 relative overflow-hidden group hover:shadow-lg transition-all cursor-pointer active:scale-[0.99]">
            {isCritical && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-rose-100/50 to-transparent pointer-events-none" />
            )}

            <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1.5">
                    <h3 className="text-lg font-black text-stone-800 tracking-tight">{name}</h3>
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full w-fit tracking-wider ${stageColors[stage] || stageColors.interest}`}>
                        {stageLabel}
                    </span>
                </div>

                {isCritical && (
                    <div className="flex items-center gap-1.5 bg-rose-50 px-3 py-1.5 rounded-xl text-rose-500 border border-rose-100">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span className="text-[10px] uppercase font-black tracking-widest">要注意</span>
                    </div>
                )}
                {isCaution && (
                    <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl text-amber-600 border border-amber-100">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span className="text-[10px] uppercase font-black tracking-widest">警戒</span>
                    </div>
                )}
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Zap className="w-3 h-3 text-rose-400 fill-rose-400/20" /> 次のアクション
                    </span>
                    <span className="text-sm text-stone-700 font-bold tracking-wide line-clamp-1">{nextAction}</span>
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
