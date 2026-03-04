import { Zap, AlertTriangle, TrendingUp, ArrowUpCircle } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-6 p-6 pt-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-wider text-foreground">HOME</h1>
                    <p className="text-muted text-xs mt-1 font-medium tracking-widest">3月4日 (水)</p>
                </div>
                <div className="h-11 w-11 rounded-full bg-white border border-border overflow-hidden shadow-sm p-0.5">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-light to-primary" />
                </div>
            </div>

            {/* 1. 今日のミッション */}
            <section>
                <div className="flex items-center gap-2 mb-3 px-1">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <Zap className="w-3.5 h-3.5 text-primary fill-primary" />
                    </div>
                    <h2 className="text-sm font-bold text-foreground tracking-widest">今日のミッション</h2>
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

            {/* 2. 要注意のお客様 */}
            <section>
                <div className="flex items-center gap-2 mb-3 mt-2 px-1">
                    <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center">
                        <AlertTriangle className="w-3.5 h-3.5 text-stone-500" />
                    </div>
                    <h2 className="text-sm font-bold text-foreground tracking-widest">要注意のお客様</h2>
                </div>
                <div className="premium-card p-4 relative overflow-hidden group border-l-2 border-l-red-400">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-foreground text-lg tracking-wide">佐藤 健一</span>
                        <span className="text-[9px] px-2.5 py-1 rounded-sm bg-red-50 text-red-600 font-bold tracking-widest uppercase border border-red-100">CRITICAL</span>
                    </div>
                    <p className="text-xs font-medium text-muted leading-relaxed">最終来店から45日経過。他店舗へ流出の可能性大です。</p>
                </div>
            </section>

            {/* 3. 売上着地予測 */}
            <section className="grid grid-cols-2 gap-3 mt-2">
                <div className="premium-card p-4 flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 mb-4 text-muted">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">現在の売上</span>
                    </div>
                    <div>
                        <div className="text-xl font-bold text-foreground font-sans tracking-wider">¥450,000</div>
                        <div className="text-[9px] text-emerald-600 font-bold mt-1.5 bg-emerald-50 w-fit px-2 py-0.5 rounded-sm tracking-widest border border-emerald-100">先月比 +12%</div>
                    </div>
                </div>
                <div className="premium-card p-4 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-primary-light/50 to-white">
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/20 rounded-full blur-2xl opacity-50" />
                    <div className="flex items-center gap-1.5 mb-4 text-primary relative">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">着地予測</span>
                    </div>
                    <div className="relative">
                        <div className="text-xl font-bold text-primary font-sans tracking-wider">¥820,000</div>
                        <div className="text-[9px] text-primary/80 font-bold mt-1.5 tracking-widest">AI予測</div>
                    </div>
                </div>
            </section>

            {/* 4. 段階昇格チャンス */}
            <section>
                <div className="flex items-center gap-2 mb-3 mt-2 px-1">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <ArrowUpCircle className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <h2 className="text-sm font-bold text-foreground tracking-widest">昇格のチャンス</h2>
                </div>
                <div className="premium-card p-4 flex items-center justify-between group">
                    <div>
                        <div className="font-bold text-foreground text-lg tracking-wide">高橋 誠</div>
                        <div className="text-[10px] font-medium text-muted mt-1 flex items-center gap-1.5">
                            信頼
                            <span className="text-muted/50">→</span>
                            <span className="text-primary bg-primary/10 px-1.5 py-0.5 rounded-sm tracking-widest font-bold">依存</span>
                        </div>
                    </div>
                    <Link href="/actions" className="premium-btn text-[10px] px-4 py-2 hover:premium-btn-hover active:premium-btn-active">
                        作戦を見る
                    </Link>
                </div>
            </section>
        </div>
    )
}

function ActionCard({ name, action, time, type }: { name: string, action: string, time: string, type: 'attack' | 'defense' | 'growth' }) {
    const styles = {
        attack: { badge: 'bg-primary/10 text-primary border-primary/20', icon: 'text-primary' },
        defense: { badge: 'bg-stone-50 text-stone-600 border-stone-200', icon: 'text-stone-400' },
        growth: { badge: 'bg-primary/5 text-primary/80 border-primary/20', icon: 'text-primary/60' }
    }

    const { badge } = styles[type]

    return (
        <Link href="/actions" className="premium-card p-4 flex items-center justify-between group hover:shadow-lg transition-all cursor-pointer">
            <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground text-base tracking-wide">{name}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest border ${badge}`}>
                        {type}
                    </span>
                </div>
                <span className="text-xs text-muted font-medium tracking-wide">{action}</span>
            </div>
            <div className="flex flex-col items-end gap-0.5">
                <span className="text-[9px] font-bold text-muted/60 uppercase tracking-widest">送信目安</span>
                <span className="text-sm font-bold text-primary font-sans">{time}</span>
            </div>
        </Link>
    )
}
