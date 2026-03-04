import { Zap, TrendingUp, Shield, CheckCircle2 } from 'lucide-react'

export default function ActionsPage() {
    return (
        <div className="flex flex-col gap-6 p-6 pt-10">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black tracking-tight text-stone-800">今日の作戦一覧 🎯</h1>
            </div>

            <div className="flex gap-2 mb-2 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6">
                <FilterChip label="すべて" active />
                <FilterChip label="攻めの作戦" icon={<Zap className="w-3 h-3" />} color="text-rose-500 bg-rose-50 border-rose-100" />
                <FilterChip label="関係作り" icon={<TrendingUp className="w-3 h-3" />} color="text-blue-500 bg-blue-50 border-blue-100" />
                <FilterChip label="関係キープ" icon={<Shield className="w-3 h-3" />} color="text-emerald-500 bg-emerald-50 border-emerald-100" />
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
    if (active) {
        return (
            <button className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all bg-stone-800 text-white shadow-md active:scale-95">
                {label}
            </button>
        )
    }

    return (
        <button className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border active:scale-95 ${color ? color : 'bg-white border-stone-200 text-stone-500'}`}>
            {icon}
            {label}
        </button>
    )
}

function ActionTicket({ customer, type, title, time, probability }: any) {
    const typeConfig: any = {
        attack: {
            label: '攻め (ATTACK)',
            color: 'rose',
            icon: <Zap className="w-4 h-4 text-rose-500 fill-rose-500/20" />
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

    // Subtle gradient depending on type
    const gradientMap: any = {
        rose: 'from-white to-rose-50/50',
        blue: 'from-white to-blue-50/50',
        emerald: 'from-white to-emerald-50/50'
    }

    return (
        <div className={`premium-card p-5 flex flex-col gap-4 group active:scale-[0.98] transition-all cursor-pointer bg-gradient-to-br ${gradientMap[conf.color]} hover:shadow-lg`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg bg-${conf.color}-50 border border-${conf.color}-100`}>
                        {conf.icon}
                    </div>
                    <div>
                        <div className="text-[9px] font-black tracking-widest text-stone-400 mb-0.5">{conf.label}</div>
                        <div className="text-base font-bold text-stone-800">{customer}</div>
                    </div>
                </div>
                <div className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors bg-white shadow-sm hover:scale-105 active:scale-95">
                    <CheckCircle2 className="w-5 h-5 text-stone-300" />
                </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-end justify-between">
                <div className="flex flex-col gap-1.5">
                    <h3 className="text-lg font-black text-stone-700 tracking-tight leading-tight pr-4">{title}</h3>
                    <p className="text-xs text-stone-500 font-bold flex items-center gap-1.5 mt-1">
                        送信目安:
                        <span className="text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md text-sm font-black flex items-center gap-1 border border-rose-100">
                            {time}
                        </span>
                    </p>
                </div>
                <div className="flex flex-col items-end pb-1">
                    <span className="text-[10px] text-stone-400 font-black tracking-widest">成功予測</span>
                    <span className="text-2xl font-black text-stone-800 font-sans tracking-tighter">{probability}<span className="text-sm font-bold text-stone-400 ml-0.5">%</span></span>
                </div>
            </div>
        </div>
    )
}
