import { ArrowLeft, Edit3, MessageCircle, MoreVertical, Zap, Shield, TrendingUp, History } from 'lucide-react'
import Link from 'next/link'

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
    // Mock Data
    const customer = {
        id: params.id,
        name: '佐藤 健一',
        stage: 'depend', // 依存
        stageLabel: '依存',
        type: 'approval', // 承認欲求型
        typeLabel: '承認欲求型',
        typeConfidence: 85,
        secondTypeLabel: 'ステータス誇示型',
        dangerLevel: 'critical',
        notes: 'IT企業役員。港区在住。ワイン好きだが自分からは頼まない。\n褒められると財布の紐が緩む。',
    }

    return (
        <div className="flex flex-col min-h-[100dvh] bg-background pb-20">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center justify-between">
                <Link href="/customers" className="p-2 -ml-2 text-foreground/50 hover:text-primary transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div className="flex items-center gap-2">
                    <button className="p-2 text-foreground/50 hover:text-primary transition-colors">
                        <Edit3 className="w-5 h-5" />
                    </button>
                    <button className="p-2 -mr-2 text-foreground/50 hover:text-primary transition-colors">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <div className="flex flex-col gap-6 p-6">
                {/* Profile Card */}
                <section className="flex flex-col items-center text-center gap-3">
                    <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-pink-400 to-rose-400 shadow-xl shadow-rose-400/20 p-1">
                        <div className="w-full h-full rounded-[28px] bg-white flex items-center justify-center text-3xl font-bold text-primary">
                            {customer.name.charAt(0)}
                        </div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">{customer.name}</h1>
                        <div className="flex items-center justify-center gap-2 mt-2">
                            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20 shadow-sm">
                                {customer.stageLabel}段階
                            </span>
                            <span className="px-3 py-1 bg-white text-foreground/60 text-xs font-bold rounded-full border border-border/50 shadow-sm">
                                {customer.typeLabel} ({customer.typeConfidence}%)
                            </span>
                        </div>
                    </div>
                </section>

                {/* LINE Analysis CTA */}
                <Link href={`/customers/${customer.id}/analyze`} className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#06C755]/10 to-transparent border border-[#06C755]/20 p-4 flex items-center justify-between transition-all active:scale-[0.98] shadow-sm bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#06C755]/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                            <MessageCircle className="w-5 h-5 text-[#06C755]" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-[#06C755]">LINE分析でAIを更新 💬</span>
                            <span className="text-xs text-[#06C755]/70 font-medium">最新の会話から戦略を再構築します</span>
                        </div>
                    </div>
                    <ArrowLeft className="w-5 h-5 text-[#06C755] rotate-180" />
                </Link>

                {/* AI Action Cards */}
                <section className="flex flex-col gap-3">
                    <div className="flex items-center justify-between mb-1">
                        <h2 className="text-lg font-bold flex items-center gap-2 text-foreground/80">
                            <Zap className="w-5 h-5 text-yellow-500" />
                            AI 作戦会議 💖
                        </h2>
                    </div>

                    {/* Attack Card */}
                    <ActionDetailCard
                        title="攻め (売上UP)"
                        goal="ボトルのオーダー"
                        probability={75}
                        reason="承認欲求が高まっており、他卓への対抗心から高額ボトルが期待できる。"
                        message="〇〇さんの席が一番落ち着くかも🥺 いつもありがとうね✨"
                        time="22:30"
                        icon={<Zap className="w-5 h-5 text-rose-500" />}
                        colorClass="rose"
                    />

                    {/* Growth Card */}
                    <ActionDetailCard
                        title="成長 (関係強化)"
                        goal="依存段階の定着"
                        probability={90}
                        reason="最近の返信速度が上がっているため、特別感を演出して本指名を確固たるものに。"
                        message="さっき起きたんだけど、一番に〇〇さんにLINEしちゃった笑"
                        time="14:00"
                        icon={<TrendingUp className="w-5 h-5 text-blue-500" />}
                        colorClass="blue"
                    />

                    {/* Defense Card */}
                    <ActionDetailCard
                        title="防御 (失客防止)"
                        goal="次回来店の確約"
                        probability={85}
                        reason="来店周期が20日を超えたため、軽いジャブで存在をアピール。"
                        message="最近忙しい？無理しないでね😢"
                        time="20:00"
                        icon={<Shield className="w-5 h-5 text-emerald-500" />}
                        colorClass="emerald"
                    />
                </section>

                {/* Notes */}
                <section className="glass rounded-3xl p-4 flex flex-col gap-3 border-white/50">
                    <h2 className="text-sm font-bold text-foreground/50 uppercase tracking-widest">接客メモ 📝</h2>
                    <p className="text-sm text-foreground/80 font-medium leading-relaxed whitespace-pre-wrap">{customer.notes}</p>
                </section>

                {/* History Preview */}
                <section className="glass rounded-3xl p-4 flex items-center justify-between border-white/50 cursor-pointer active:scale-[0.98] transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <History className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-foreground/80">来店履歴 📅</span>
                            <span className="text-xs text-foreground/50 font-bold">前回のご来店: 12日前</span>
                        </div>
                    </div>
                    <ArrowLeft className="w-5 h-5 text-foreground/30 rotate-180" />
                </section>

            </div>
        </div>
    )
}

function ActionDetailCard({ title, goal, probability, reason, message, time, icon, colorClass }: any) {
    const colorMap: any = {
        rose: 'border-rose-500/20 from-rose-500/10 to-transparent',
        blue: 'border-blue-500/20 from-blue-500/10 to-transparent',
        emerald: 'border-emerald-500/20 from-emerald-500/10 to-transparent',
    }

    return (
        <div className={`glass rounded-3xl p-4 border border-white/60 bg-gradient-to-br ${colorMap[colorClass]} relative overflow-hidden shadow-sm`}>
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    {icon}
                    <span className="font-bold text-foreground/80">{title}</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="text-xs text-foreground/40 font-bold tracking-widest">SUCCESS</span>
                    <span className="text-lg font-black tracking-tighter text-foreground/80">{probability}%</span>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <div>
                    <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest block mb-1">目標</span>
                    <span className="text-sm font-bold text-foreground/80">{goal}</span>
                </div>

                <div>
                    <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest block mb-1">理由</span>
                    <p className="text-xs text-foreground/60 font-medium leading-relaxed">{reason}</p>
                </div>

                <div className="bg-white/60 rounded-2xl p-3 border border-border/50 shadow-inner mt-1">
                    <span className="text-[10px] text-foreground/50 font-bold uppercase tracking-widest block mb-2 flex items-center justify-between">
                        おすすめの返信内容 💌
                        <span className="text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full">{time} 頃送信</span>
                    </span>
                    <p className="text-sm font-bold text-foreground/80">{message}</p>
                    <button className="w-full mt-3 py-2.5 bg-primary hover:bg-primary/90 text-xs font-bold rounded-xl shadow-md shadow-primary/20 transition-all text-white active:scale-95">
                        コピーする 📋
                    </button>
                </div>
            </div>
        </div>
    )
}
