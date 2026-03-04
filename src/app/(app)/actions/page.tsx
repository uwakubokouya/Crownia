import { Zap, TrendingUp, Shield, CheckCircle2 } from 'lucide-react'

export default function ActionsPage() {
    return (
        <div className="flex flex-col gap-8 p-6 pt-12">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-light tracking-wide text-foreground uppercase">Strategy</h1>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6">
                <FilterChip label="すべて" active />
                <FilterChip label="攻め" icon={<Zap className="w-3.5 h-3.5" strokeWidth={1.5} />} />
                <FilterChip label="関係作り" icon={<TrendingUp className="w-3.5 h-3.5" strokeWidth={1.5} />} />
                <FilterChip label="関係キープ" icon={<Shield className="w-3.5 h-3.5" strokeWidth={1.5} />} />
            </div>

            <div className="flex flex-col gap-4 mt-2">
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

function FilterChip({ label, active, icon }: any) {
    if (active) {
        return (
            <button className="flex items-center gap-2 px-5 py-2.5 text-[11px] font-normal tracking-widest uppercase transition-all bg-foreground text-white border border-foreground">
                {icon}
                {label}
            </button>
        )
    }

    return (
        <button className="flex items-center gap-2 px-5 py-2.5 text-[11px] font-normal tracking-widest uppercase transition-all border border-border bg-white text-muted hover:border-foreground hover:text-foreground">
            {icon}
            {label}
        </button>
    )
}

function ActionTicket({ customer, type, title, time, probability }: any) {
    const typeConfig: any = {
        attack: {
            label: 'ATTACK / 攻め',
            icon: <Zap className="w-4 h-4 text-white" strokeWidth={1.5} />
        },
        growth: {
            label: 'GROWTH / 成長',
            icon: <TrendingUp className="w-4 h-4 text-foreground" strokeWidth={1.5} />
        },
        defense: {
            label: 'DEFENSE / 防御',
            icon: <Shield className="w-4 h-4 text-muted" strokeWidth={1.5} />
        }
    }

    const conf = typeConfig[type]
    const isAttack = type === 'attack'

    return (
        <div className={`premium-card p-6 flex flex-col gap-6 group active:scale-[0.98] transition-all cursor-pointer ${isAttack ? 'bg-foreground text-white border-foreground' : 'bg-white text-foreground border-border hover:border-foreground'}`}>
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className={`p-2 border ${isAttack ? 'border-foreground bg-foreground' : 'border-border bg-white'}`}>
                        {conf.icon}
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className={`text-[9px] font-normal tracking-widest uppercase ${isAttack ? 'text-white/60' : 'text-muted'}`}>{conf.label}</span>
                        <span className={`text-[15px] font-normal tracking-wide ${isAttack ? 'text-white' : 'text-foreground'}`}>{customer}</span>
                    </div>
                </div>
                <div className={`w-8 h-8 flex items-center justify-center transition-colors group-hover:scale-105 ${isAttack ? 'text-white border-white/20 hover:border-white' : 'text-muted border-border hover:text-foreground hover:border-foreground'} border`}>
                    <CheckCircle2 className="w-4 h-4" strokeWidth={1.5} />
                </div>
            </div>

            <div className={`pt-5 border-t flex items-end justify-between ${isAttack ? 'border-white/20' : 'border-border'}`}>
                <div className="flex flex-col gap-2.5">
                    <h3 className={`text-[15px] font-light tracking-wide leading-tight ${isAttack ? 'text-white' : 'text-foreground'}`}>{title}</h3>
                    <p className={`text-[10px] font-normal flex items-center gap-2 uppercase tracking-widest ${isAttack ? 'text-white/80' : 'text-muted'}`}>
                        SEND TIME
                        <span className={`tracking-widest font-normal px-2 py-0.5 border ${isAttack ? 'bg-transparent text-white border-white/30' : 'bg-white text-foreground border-border'}`}>
                            {time}
                        </span>
                    </p>
                </div>
                <div className="flex flex-col items-end">
                    <span className={`text-[8px] font-normal tracking-widest uppercase mb-1.5 ${isAttack ? 'text-white/60' : 'text-muted'}`}>Win Rate</span>
                    <span className={`text-2xl font-light tracking-tight ${isAttack ? 'text-white' : 'text-foreground'}`}>{probability}<span className={`text-sm font-normal ml-0.5 ${isAttack ? 'text-white/60' : 'text-muted'}`}>%</span></span>
                </div>
            </div>
        </div>
    )
}
