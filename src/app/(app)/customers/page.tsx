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
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-foreground/40" />
                <input
                    type="text"
                    placeholder="名前やタグで検索..."
                    className="w-full glass bg-white/40 rounded-2xl pl-12 pr-4 py-3.5 placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground transition-all font-medium"
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
        interest: 'bg-foreground/5 text-foreground/60',
        build: 'bg-blue-100 text-blue-500',
        trust: 'bg-emerald-100 text-emerald-500',
        depend: 'bg-primary/10 text-primary',
        highvalue: 'bg-amber-100 text-amber-500' // Gold-like
    }

    return (
        <Link href={`/customers/${id}`} className="glass rounded-3xl p-4 flex flex-col gap-4 relative overflow-hidden group hover:shadow-lg transition-all cursor-pointer active:scale-[0.99] border-white/50">
            {isCritical && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-bl-[100px] pointer-events-none" />
            )}

            <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1.5">
                    <h3 className="text-lg font-bold text-foreground">{name}</h3>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full w-fit ${stageColors[stage] || stageColors.interest}`}>
                        {stageLabel}
                    </span>
                </div>

                {isCritical && (
                    <div className="flex items-center gap-1.5 bg-red-100 px-2.5 py-1 rounded-xl text-red-500">
                        <ShieldAlert className="w-4 h-4" />
                        <span className="text-[10px] uppercase font-bold tracking-wider">要注意</span>
                    </div>
                )}
                {isCaution && (
                    <div className="flex items-center gap-1.5 bg-yellow-100 px-2.5 py-1 rounded-xl text-yellow-600">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-[10px] uppercase font-bold tracking-wider">警戒</span>
                    </div>
                )}
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-foreground/50 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Zap className="w-3 h-3 text-primary" /> 次のアクション
                    </span>
                    <span className="text-sm text-foreground/80 font-bold line-clamp-1">{nextAction}</span>
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
