import { Zap, AlertTriangle, TrendingUp, ArrowUpCircle } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-6 p-6 pt-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-primary">ホーム</h1>
                    <p className="text-stone-500 text-sm mt-0.5 font-medium">3月4日 (水)</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-white border-2 border-primary/20 overflow-hidden shadow-sm">
                    {/* Avatar placeholder */}
                    <div className="w-full h-full bg-gradient-to-br from-pink-300 to-rose-400" />
                </div>
            </div>

            {/* 1. 今日の営業タスク (AI Actions) */}
            <section>
                <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-5 h-5 text-amber-400 fill-amber-400/20" />
                    <h2 className="text-lg font-bold text-stone-700">今日のミッション ✨</h2>
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
                    <AlertTriangle className="w-5 h-5 text-rose-400 fill-rose-400/20" />
                    <h2 className="text-lg font-bold text-stone-700">要注意のお客様 🥺</h2>
                </div>
                <div className="glass rounded-2xl p-4 border-rose-100 shadow-sm bg-white/60">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-stone-800">佐藤 健一</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 font-bold tracking-wider uppercase">CRITICAL</span>
                    </div>
                    <p className="text-xs font-medium text-stone-600 leading-relaxed">最終来店から45日経過。他店舗へ流出の可能性大です 💦</p>
                </div>
            </section>

            {/* 3. 売上着地予測 */}
            <section className="grid grid-cols-2 gap-4 mt-2">
                <div className="glass rounded-2xl p-4 flex flex-col justify-between shadow-sm bg-white/60 border-white/50">
                    <div className="flex items-center gap-2 mb-4 text-stone-400">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">現在の売上</span>
                    </div>
                    <div>
                        <div className="text-2xl font-black text-stone-700">¥450,000</div>
                        <div className="text-xs text-emerald-500 font-bold mt-1 bg-emerald-50 w-fit px-1.5 py-0.5 rounded-md">先月比 +12% 💖</div>
                    </div>
                </div>
                <div className="glass rounded-2xl p-4 flex flex-col justify-between border-primary/20 shadow-sm relative overflow-hidden group bg-gradient-to-br from-rose-50 to-white">
                    <div className="flex items-center gap-2 mb-4 text-primary relative">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">着地予測</span>
                    </div>
                    <div className="relative">
                        <div className="text-2xl font-black text-primary">¥820,000</div>
                        <div className="text-xs text-primary/70 font-bold mt-1">AIベースの予測 ✨</div>
                    </div>
                </div>
            </section>

            {/* 4. 段階昇格チャンス */}
            <section>
                <div className="flex items-center gap-2 mb-3 mt-2">
                    <ArrowUpCircle className="w-5 h-5 text-blue-400 fill-blue-400/20" />
                    <h2 className="text-lg font-bold text-stone-700">昇格のチャンス 🎀</h2>
                </div>
                <div className="glass rounded-2xl p-4 flex items-center justify-between shadow-sm bg-white/60 border-blue-100">
                    <div>
                        <div className="font-bold text-stone-800">高橋 誠</div>
                        <div className="text-[10px] font-bold text-stone-500 mt-1">信頼 → <span className="text-blue-500 bg-blue-50 px-1 rounded">依存</span></div>
                    </div>
                    <Link href="/actions" className="text-[10px] font-bold bg-primary text-white hover:bg-primary/90 px-3 py-1.5 rounded-xl transition-all shadow-md shadow-primary/20 active:scale-95">
                        作戦を見る
                    </Link>
                </div>
            </section>
        </div>
    )
}

function ActionCard({ name, action, time, type }: { name: string, action: string, time: string, type: 'attack' | 'defense' | 'growth' }) {
    const styles = {
        attack: { wrapper: 'border-rose-100 bg-rose-50/50', badge: 'bg-rose-100 text-rose-500' },
        defense: { wrapper: 'border-emerald-100 bg-emerald-50/50', badge: 'bg-emerald-100 text-emerald-600' },
        growth: { wrapper: 'border-blue-100 bg-blue-50/50', badge: 'bg-blue-100 text-blue-500' }
    }

    const { wrapper, badge } = styles[type]

    return (
        <Link href="/actions" className={`glass rounded-2xl p-4 flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer shadow-sm hover:shadow-md ${wrapper}`}>
            <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-800">{name}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${badge}`}>
                        {type}
                    </span>
                </div>
                <span className="text-xs text-stone-600 font-bold">{action}</span>
            </div>
            <div className="flex flex-col items-end gap-0.5">
                <span className="text-[9px] font-bold text-stone-400 uppercase">送信目安</span>
                <span className="text-sm font-black text-primary">{time}</span>
            </div>
        </Link>
    )
}
