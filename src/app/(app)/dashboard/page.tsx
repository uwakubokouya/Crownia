import { Zap, AlertTriangle, TrendingUp, ArrowUpCircle } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-6 p-6 pt-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-stone-800">ホーム</h1>
                    <p className="text-stone-400 text-xs mt-1 font-bold tracking-wide">3月4日 (水)</p>
                </div>
                <div className="h-11 w-11 rounded-full bg-white border border-rose-100 overflow-hidden shadow-sm p-0.5">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-rose-200 to-rose-400" />
                </div>
            </div>

            {/* 1. 今日のミッション */}
            <section>
                <div className="flex items-center gap-2 mb-3 px-1">
                    <div className="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center">
                        <Zap className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    </div>
                    <h2 className="text-base font-bold text-stone-700 tracking-wide">今日のミッション</h2>
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
                    <h2 className="text-base font-bold text-stone-700 tracking-wide">要注意のお客様</h2>
                </div>
                <div className="premium-card p-4 relative overflow-hidden group border-l-4 border-l-rose-400">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-stone-800 text-lg">佐藤 健一</span>
                        <span className="text-[9px] px-2.5 py-1 rounded-full bg-rose-50 text-rose-500 font-black tracking-widest uppercase">CRITICAL</span>
                    </div>
                    <p className="text-xs font-medium text-stone-500 leading-relaxed">最終来店から45日経過。他店舗へ流出の可能性大です 💦</p>
                </div>
            </section>

            {/* 3. 売上着地予測 */}
            <section className="grid grid-cols-2 gap-3 mt-2">
                <div className="premium-card p-4 flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 mb-4 text-stone-400">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">現在の売上</span>
                    </div>
                    <div>
                        <div className="text-xl font-black text-stone-800 font-sans tracking-tight">¥450,000</div>
                        <div className="text-[10px] text-emerald-600 font-bold mt-1.5 bg-emerald-50 w-fit px-2 py-0.5 rounded-md tracking-wide">先月比 +12%</div>
                    </div>
                </div>
                <div className="premium-card p-4 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-rose-50/50 to-white">
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-rose-100 rounded-full blur-2xl opacity-50" />
                    <div className="flex items-center gap-1.5 mb-4 text-rose-500 relative">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">着地予測</span>
                    </div>
                    <div className="relative">
                        <div className="text-xl font-black text-rose-500 font-sans tracking-tight">¥820,000</div>
                        <div className="text-[10px] text-rose-400 font-bold mt-1.5 tracking-wide">AIベースの予測 ✨</div>
                    </div>
                </div>
            </section>

            {/* 4. 段階昇格チャンス */}
            <section>
                <div className="flex items-center gap-2 mb-3 mt-2 px-1">
                    <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
                        <ArrowUpCircle className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                    <h2 className="text-base font-bold text-stone-700 tracking-wide">昇格のチャンス</h2>
                </div>
                <div className="premium-card p-4 flex items-center justify-between group">
                    <div>
                        <div className="font-bold text-stone-800 text-lg">高橋 誠</div>
                        <div className="text-[10px] font-bold text-stone-400 mt-1 flex items-center gap-1.5">
                            信頼
                            <span className="text-stone-300">→</span>
                            <span className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">依存</span>
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
        attack: { badge: 'bg-rose-50 text-rose-500', icon: 'text-rose-400' },
        defense: { badge: 'bg-emerald-50 text-emerald-600', icon: 'text-emerald-400' },
        growth: { badge: 'bg-blue-50 text-blue-500', icon: 'text-blue-400' }
    }

    const { badge, icon } = styles[type]

    return (
        <Link href="/actions" className="premium-card p-4 flex items-center justify-between group hover:shadow-lg transition-all cursor-pointer">
            <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-800 text-base">{name}</span>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${badge}`}>
                        {type}
                    </span>
                </div>
                <span className="text-xs text-stone-500 font-medium tracking-wide">{action}</span>
            </div>
            <div className="flex flex-col items-end gap-0.5">
                <span className="text-[9px] font-bold text-stone-300 uppercase tracking-wider">送信目安</span>
                <span className="text-sm font-black text-rose-400 font-sans">{time}</span>
            </div>
        </Link>
    )
}
