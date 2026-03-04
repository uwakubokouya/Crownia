import { Zap, TrendingUp, Shield, CheckCircle2 } from 'lucide-react'

export default function ActionsPage() {
    return (
        <div className="flex flex-col gap-6 p-6 pt-10">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-primary">今日の作戦一覧 🎯</h1>
            </div>

            <div className="flex gap-2 mb-2 overflow-x-auto pb-2 scrollbar-hide">
                <FilterChip label="すべて" active />
                <FilterChip label="攻めの作戦" icon={<Zap className="w-3 h-3" />} color="text-rose-500" />
                <FilterChip label="関係作り" icon={<TrendingUp className="w-3 h-3" />} color="text-blue-500" />
                <FilterChip label="関係キープ" icon={<Shield className="w-3 h-3" />} color="text-emerald-500" />
            </div>

            <div className="flex flex-col gap-4">
                {/* Attack */}
                <ActionTicket
                    customer="佐藤 健一"
                    type="attack"
                    title="ボトルのオーダー打診"
                    time="22:30"
                    probability={75}
                />

                {/* Growth */}
                <ActionTicket
                    customer="高橋 誠"
                    type="growth"
                    title="「信頼」から「依存」へ昇格"
                    time="18:00"
                    probability={82}
                />

                {/* Defense */}
                <ActionTicket
                    customer="鈴木 一郎"
                    type="defense"
                    title="失客防止のジャブ"
                    time="20:00"
                    probability={90}
                />
            </div>
        </div>
    )
}

function FilterChip({ label, active, icon, color }: any) {
    return (
        <button className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all shadow-sm ${active ? 'bg-primary text-white shadow-primary/20' : 'bg-white border border-border text-foreground/50 hover:bg-foreground/5'}`}>
            {icon && <span className={color}>{icon}</span>}
            {label}
        </button>
    )
}

function ActionTicket({ customer, type, title, time, probability }: any) {
    const typeConfig: any = {
        attack: {
            label: '攻め (ATTACK)',
            color: 'rose',
            icon: <Zap className="w-4 h-4 text-rose-500" />
        },
        growth: {
            label: '成長 (GROWTH)',
            color: 'blue',
            icon: <TrendingUp className="w-4 h-4 text-blue-500" />
        },
        defense: {
            label: '防御 (DEFENSE)',
            color: 'emerald',
            icon: <Shield className="w-4 h-4 text-emerald-500" />
        }
    }

    const conf = typeConfig[type]
    const colorMap: any = {
        rose: 'border-rose-500/20 from-rose-500/10',
        blue: 'border-blue-500/20 from-blue-500/10',
        emerald: 'border-emerald-500/20 from-emerald-500/10'
    }

    return (
        <div className={`glass rounded-2xl p-4 flex flex-col gap-3 group border border-t flex-1 active:scale-[0.98] transition-all cursor-pointer bg-gradient-to-br ${colorMap[conf.color]} to-white/50 shadow-sm`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {conf.icon}
                    <span className="text-[10px] font-bold tracking-wider text-foreground/50">{conf.label}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/20" />
                    <span className="text-sm font-bold text-foreground/80">{customer}</span>
                </div>
                <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-foreground/5 transition-colors bg-white/50 shadow-inner">
                    <CheckCircle2 className="w-4 h-4 text-foreground/30" />
                </div>
            </div>

            <div className="flex items-end justify-between">
                <div>
                    <h3 className="text-base font-bold text-foreground">{title}</h3>
                    <p className="text-xs text-foreground/50 font-bold mt-1">おすすめ送信時間: <span className="text-primary bg-primary/10 px-1.5 py-0.5 rounded-md">{time}</span></p>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] text-foreground/40 font-bold tracking-widest">成功率</span>
                    <span className="text-xl font-black text-foreground/80">{probability}%</span>
                </div>
            </div>
        </div>
    )
}
