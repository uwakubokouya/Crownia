import { Zap, AlertTriangle, TrendingUp, ArrowUpCircle } from 'lucide-react'

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-6 p-6 pt-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-primary">ホーム</h1>
                    <p className="text-foreground/60 text-sm mt-0.5">3月4日 (水)</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden">
                    {/* Avatar placeholder */}
                    <div className="w-full h-full bg-gradient-to-br from-pink-500 to-rose-500" />
                </div>
            </div>

            {/* 1. 今日の営業タスク (AI Actions) */}
            <section>
                <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <h2 className="text-lg font-semibold text-foreground/80">今日のミッション ✨</h2>
                </div>
                <div className="grid gap-3">
                    <ActionCard
                        name="山田 太郎"
                        action="「そろそろ会いたい」送信"
                        time="21:00"
                        type="attack"
                    />
                    <ActionCard
                        name="鈴木 一郎"
                        action="ボトルお礼のフォロー"
                        time="15:00"
                        type="defense"
                    />
                </div>
            </section>

            {/* 2. 顧客リスク警告 */}
            <section>
                <div className="flex items-center gap-2 mb-3 mt-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <h2 className="text-lg font-semibold text-foreground/80">要注意のお客様 🥺</h2>
                </div>
                <div className="glass rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">佐藤 健一</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-500 font-bold tracking-wider">CRITICAL</span>
                    </div>
                    <p className="text-sm text-foreground/60">最終来店から45日経過。他店舗へ流出の可能性大です 💦</p>
                </div>
            </section>

            {/* 3. 売上着地予測 */}
            <section className="grid grid-cols-2 gap-4 mt-2">
                <div className="glass rounded-2xl p-4 flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-4 text-zinc-400">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">現在の売上</span>
                    </div>
                    <div>
                        <div className="text-2xl font-bold">¥450k</div>
                        <div className="text-xs text-emerald-500 font-medium mt-1">先月比 +12% 💖</div>
                    </div>
                </div>
                <div className="glass rounded-2xl p-4 flex flex-col justify-between border-primary/30 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
                    <div className="flex items-center gap-2 mb-4 text-primary relative">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">着地予測</span>
                    </div>
                    <div className="relative">
                        <div className="text-2xl font-bold text-primary">¥820k</div>
                        <div className="text-xs text-primary/70 font-medium mt-1">AIベースの予測</div>
                    </div>
                </div>
            </section>

            {/* 4. 段階昇格チャンス */}
            <section>
                <div className="flex items-center gap-2 mb-3 mt-2">
                    <ArrowUpCircle className="w-5 h-5 text-blue-400" />
                    <h2 className="text-lg font-semibold text-foreground/80">昇格のチャンス 🎀</h2>
                </div>
                <div className="glass rounded-2xl p-4 flex items-center justify-between">
                    <div>
                        <div className="font-medium">高橋 誠</div>
                        <div className="text-sm text-zinc-400 mt-0.5">信頼 → <span className="text-blue-400">依存</span></div>
                    </div>
                    <button className="text-xs font-medium bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg transition-colors">
                        作戦を見る
                    </button>
                </div>
            </section>
        </div>
    )
}

function ActionCard({ name, action, time, type }: { name: string, action: string, time: string, type: 'attack' | 'defense' | 'growth' }) {
    const colors = {
        attack: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
        defense: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        growth: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    }

    return (
        <div className="glass rounded-2xl p-4 flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{name}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border uppercase tracking-wider ${colors[type]}`}>
                        {type}
                    </span>
                </div>
                <span className="text-sm text-foreground/70 font-medium">{action}</span>
            </div>
            <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] font-bold text-foreground/50 uppercase">送信目安</span>
                <span className="text-sm font-bold text-foreground/80">{time}</span>
            </div>
        </div>
    )
}
