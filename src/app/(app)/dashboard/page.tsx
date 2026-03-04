import { Zap, AlertTriangle, TrendingUp, ArrowUpCircle } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-8 p-6 pt-12">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-light tracking-wide text-foreground uppercase">Home</h1>
                    <p className="text-muted text-[10px] mt-1 font-medium tracking-widest uppercase">March 4</p>
                </div>
                <div className="h-10 w-10 bg-white border border-border flex items-center justify-center">
                    <div className="w-8 h-8 bg-foreground flex items-center justify-center">
                        {/* Replace with actual image or elegant monogram */}
                        <span className="text-white text-xs font-light tracking-widest">CR</span>
                    </div>
                </div>
            </div>

            {/* 1. 今日のミッション */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-xs font-normal text-muted tracking-widest uppercase">Todays Mission</h2>
                </div>
                <div className="flex flex-col gap-4">
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
                <div className="flex items-center gap-2 mb-4 mt-2">
                    <h2 className="text-xs font-normal text-muted tracking-widest uppercase">Attention</h2>
                </div>
                <div className="premium-card p-5 relative overflow-hidden group border-l-[4px] border-l-foreground">
                    <div className="flex items-center justify-between mb-3">
                        <span className="font-normal text-foreground text-base tracking-wide">佐藤 健一</span>
                        <span className="text-[9px] px-2 py-1 bg-foreground text-white font-medium tracking-widest uppercase">CRITICAL</span>
                    </div>
                    <p className="text-xs font-light text-muted leading-relaxed">最終来店から45日経過。他店舗へ流出の可能性大です。</p>
                </div>
            </section>

            {/* 3. 売上着地予測 */}
            <section className="grid grid-cols-2 gap-4 mt-2">
                <div className="premium-card p-5 flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 mb-6 text-muted">
                        <span className="text-[9px] font-normal tracking-widest uppercase">Current</span>
                    </div>
                    <div>
                        <div className="text-xl font-normal text-foreground tracking-wide">¥450,000</div>
                        <div className="text-[10px] text-muted font-light mt-2 tracking-wide">先月比 <span className="text-foreground font-medium">+12%</span></div>
                    </div>
                </div>
                <div className="premium-card p-5 flex flex-col justify-between bg-zinc-50 border-border">
                    <div className="flex items-center gap-1.5 mb-6 text-foreground">
                        <span className="text-[9px] font-normal tracking-widest uppercase flex items-center gap-1">
                            <Zap strokeWidth={1.5} className="w-3 h-3" />
                            AI Forecast
                        </span>
                    </div>
                    <div>
                        <div className="text-xl font-normal text-foreground tracking-wide">¥820,000</div>
                        <div className="text-[10px] text-muted font-light mt-2 tracking-wide">信頼度: <span className="text-foreground">高</span></div>
                    </div>
                </div>
            </section>

            {/* 4. 段階昇格チャンス */}
            <section>
                <div className="flex items-center gap-2 mb-4 mt-4">
                    <h2 className="text-xs font-normal text-muted tracking-widest uppercase">Upgrade Chance</h2>
                </div>
                <div className="premium-card p-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between group">
                    <div>
                        <div className="font-normal text-foreground text-base tracking-wide mb-2">高橋 誠</div>
                        <div className="text-[11px] font-light text-muted flex items-center gap-3 tracking-widest uppercase">
                            <span>信頼</span>
                            <span className="text-border">→</span>
                            <span className="text-foreground border border-foreground px-2 py-0.5">依存</span>
                        </div>
                    </div>
                    <Link href="/actions" className="premium-btn text-[10px] px-6 py-2.5 sm:w-auto w-full text-center hover:premium-btn-hover active:premium-btn-active">
                        VIEW
                    </Link>
                </div>
            </section>
        </div>
    )
}

function ActionCard({ name, action, time, type }: { name: string, action: string, time: string, type: 'attack' | 'defense' | 'growth' }) {
    const styles = {
        attack: { badge: 'bg-foreground text-white border-foreground' },
        defense: { badge: 'bg-white text-muted border-border' },
        growth: { badge: 'bg-zinc-50 text-foreground border-border' }
    }

    const { badge } = styles[type]

    return (
        <Link href="/actions" className="premium-card p-5 flex items-center justify-between group active:scale-[0.99] transition-all cursor-pointer">
            <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-3">
                    <span className="font-normal text-foreground text-[15px] tracking-wide">{name}</span>
                    <span className={`text-[8px] font-normal px-2 py-0.5 border tracking-widest uppercase ${badge}`}>
                        {type}
                    </span>
                </div>
                <span className="text-[11px] text-muted font-light tracking-wide">{action}</span>
            </div>
            <div className="flex flex-col items-end gap-1.5 border-l border-border pl-4">
                <span className="text-[8px] font-normal text-muted tracking-widest uppercase">Time</span>
                <span className="text-xs font-normal text-foreground tracking-widest">{time}</span>
            </div>
        </Link>
    )
}
