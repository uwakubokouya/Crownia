import { Zap, AlertTriangle, TrendingUp, ArrowUpCircle } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

export default function DashboardPage() {
    const today = format(new Date(), 'yyyy.M.d')

    return (
        <div className="flex flex-col gap-8 p-6 pt-12 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-light tracking-wide text-foreground uppercase">HOME</h1>
                    <p className="text-muted text-[11px] mt-1 font-medium tracking-widest uppercase">{today}</p>
                </div>
                <div className="h-10 w-10 bg-white border border-border flex items-center justify-center">
                    <div className="w-8 h-8 bg-rose-50 flex items-center justify-center">
                        <span className="text-rose-600 text-xs font-light tracking-widest">CR</span>
                    </div>
                </div>
            </div>

            {/* 1. 本日のタスク */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-xs font-normal text-muted tracking-widest uppercase">TODAY'S TASK / 本日のタスク</h2>
                </div>
                <div className="flex flex-col gap-4">
                    <ActionCard
                        id="2"
                        name="山田 太郎"
                        action="「そろそろ会いたい」送信"
                        time="21:00"
                        type="attack"
                    />
                    <ActionCard
                        id="3"
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
                    <h2 className="text-xs font-normal text-muted tracking-widest uppercase">ATTENTION / 注意が必要なお客様</h2>
                </div>
                <div className="premium-card p-5 relative overflow-hidden group border-l-[4px] border-l-rose-300">
                    <div className="flex items-center justify-between mb-3">
                        <span className="font-normal text-foreground text-base tracking-wide">佐藤 健一</span>
                        <span className="text-[9px] px-2 py-1 bg-rose-50 text-rose-600 border border-rose-100 font-medium tracking-widest uppercase">CRITICAL</span>
                    </div>
                    <p className="text-xs font-light text-muted leading-relaxed">最終来店から45日経過。他店舗へ流出の可能性大です。</p>
                </div>
            </section>

            {/* 3. 売上着地予測 */}
            <section className="grid grid-cols-2 gap-4 mt-2">
                <div className="premium-card p-5 flex flex-col justify-between hover:bg-rose-50/30 transition-colors">
                    <div className="flex items-center gap-1.5 mb-6 text-muted">
                        <span className="text-[9px] font-normal tracking-widest uppercase">CURRENT / 現在の売上</span>
                    </div>
                    <div>
                        <div className="text-xl font-normal text-foreground tracking-wide">¥450,000</div>
                        <div className="text-[10px] text-muted font-light mt-2 tracking-wide">先月比 <span className="text-rose-600 font-medium">+12%</span></div>
                    </div>
                </div>
                <div className="premium-card p-5 flex flex-col justify-between bg-zinc-50 border-border hover:bg-rose-50 transition-colors">
                    <div className="flex items-center gap-1.5 mb-6 text-foreground">
                        <span className="text-[9px] font-normal tracking-widest text-rose-600 uppercase flex items-center gap-1">
                            <Zap strokeWidth={1.5} className="w-3 h-3" />
                            FORECAST / AI着地予測
                        </span>
                    </div>
                    <div>
                        <div className="text-xl font-normal text-foreground tracking-wide">¥820,000</div>
                        <div className="text-[10px] text-muted font-light mt-2 tracking-wide">信頼度: <span className="text-foreground">高</span></div>
                    </div>
                </div>
            </section>

            {/* 4. 段階昇格見込み */}
            <section>
                <div className="flex items-center gap-2 mb-4 mt-4">
                    <h2 className="text-xs font-normal text-muted tracking-widest uppercase">UPGRADE / 昇格見込みのお客様</h2>
                </div>
                <div className="premium-card p-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between group hover:border-rose-200 transition-colors">
                    <div>
                        <div className="font-normal text-foreground text-base tracking-wide mb-2">高橋 誠</div>
                        <div className="text-[11px] font-light text-muted flex items-center gap-3 tracking-widest uppercase">
                            <span>信頼</span>
                            <span className="text-rose-300">→</span>
                            <span className="text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5">依存</span>
                        </div>
                    </div>
                    <Link href="/customers/2" className="premium-btn text-[10px] px-6 py-2.5 sm:w-auto w-full text-center hover:premium-btn-hover active:premium-btn-active">
                        VIEW
                    </Link>
                </div>
            </section>
        </div>
    )
}

function ActionCard({ id, name, action, time, type }: { id: string, name: string, action: string, time: string, type: 'attack' | 'defense' | 'growth' }) {
    const styles = {
        attack: { badge: 'bg-rose-50 text-rose-600 border-rose-100' },
        defense: { badge: 'bg-white text-muted border-border' },
        growth: { badge: 'bg-zinc-50 text-foreground border-border' }
    }

    const { badge } = styles[type]

    return (
        <Link href={`/customers/${id}`} className="premium-card p-5 flex items-center justify-between group active:scale-[0.99] transition-all cursor-pointer hover:border-black">
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
                <span className="text-[8px] font-normal text-muted tracking-widest uppercase">TIME / 推奨時間</span>
                <span className="text-xs font-normal text-foreground tracking-widest">{time}</span>
            </div>
        </Link>
    )
}
