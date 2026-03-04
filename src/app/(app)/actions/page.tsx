import { Zap, TrendingUp, Shield, CheckCircle2 } from 'lucide-react'

export default function ActionsPage() {
    return (
        <div className="flex flex-col gap-6 p-6 pt-10">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-wider text-foreground">作戦一覧</h1>
            </div>

            <div className="flex gap-2 mb-2 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6">
                <FilterChip label="すべて" active />
                <FilterChip label="攻めの作戦" icon={<Zap className="w-3 h-3" />} color="text-primary bg-primary/5 border-primary/20" />
                <FilterChip label="関係作り" icon={<TrendingUp className="w-3 h-3" />} color="text-stone-600 bg-stone-50 border-stone-200" />
                <FilterChip label="関係キープ" icon={<Shield className="w-3 h-3" />} color="text-primary-dark bg-primary-light/50 border-primary/10" />
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
            <button className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all bg-foreground text-white shadow-[0_2px_10px_-2px_rgba(43,43,43,0.3)] active:scale-95 tracking-wide">
                {label}
            </button>
        )
    }

    return (
        <button className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border active:scale-95 tracking-wide ${color ? color : 'bg-white border-border text-muted hover:bg-stone-50'}`}>
            {icon}
            {label}
        </button>
    )
}

function ActionTicket({ customer, type, title, time, probability }: any) {
    const typeConfig: any = {
        attack: {
            label: '攻め (ATTACK)',
            color: 'primary',
            icon: <Zap className="w-4 h-4 text-primary fill-primary/20" />
        },
        growth: {
            label: '成長 (GROWTH)',
            color: 'stone',
            icon: <TrendingUp className="w-4 h-4 text-stone-500" />
        },
        defense: {
            label: '防御 (DEFENSE)',
            color: 'primary-dark',
            icon: <Shield className="w-4 h-4 text-primary-dark" />
        }
    }

    const conf = typeConfig[type]

    // Subtle luxury gradient depending on type
    const gradientMap: any = {
        'primary': 'from-white to-primary/5',
        'stone': 'from-white to-stone-50',
        'primary-dark': 'from-white to-primary-light/30'
    }

    return (
        <div className={`premium-card p-5 flex flex-col gap-4 group active:scale-[0.98] transition-all cursor-pointer bg-gradient-to-br ${gradientMap[conf.color]} hover:shadow-lg`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-md bg-${conf.color}/5 border border-${conf.color}/10`}>
                        {conf.icon}
                    </div>
                    <div>
                        <div className="text-[9px] font-bold tracking-widest text-muted mb-0.5">{conf.label}</div>
                        <div className="text-sm font-bold text-foreground tracking-wide">{customer}</div>
                    </div>
                </div>
                <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-stone-50 transition-colors bg-white shadow-sm hover:scale-105 active:scale-95">
                    <CheckCircle2 className="w-5 h-5 text-muted/60" />
                </div>
            </div>

            <div className="pt-3 border-t border-border flex items-end justify-between">
                <div className="flex flex-col gap-1.5">
                    <h3 className="text-base font-bold text-foreground tracking-wide leading-tight pr-4">{title}</h3>
                    <p className="text-xs text-muted font-medium flex items-center gap-1.5 mt-1">
                        送信目安:
                        <span className="text-primary bg-primary/5 px-2 py-0.5 rounded-sm text-[10px] font-bold flex items-center gap-1 border border-primary/20 tracking-widest">
                            {time}
                        </span>
                    </p>
                </div>
                <div className="flex flex-col items-end pb-1">
                    <span className="text-[9px] text-muted/80 font-bold tracking-widest">成功予測</span>
                    <span className="text-xl font-bold text-foreground font-sans tracking-wide">{probability}<span className="text-xs font-medium text-muted ml-0.5">%</span></span>
                </div>
            </div>
        </div>
    )
}
