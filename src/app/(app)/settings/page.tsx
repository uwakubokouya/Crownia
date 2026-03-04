import { User, CreditCard, ShieldCheck, HelpCircle, LogOut } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { UpgradeButton } from './upgrade-button'

export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    let plan = 'free'

    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('plan')
            .eq('id', user.id)
            .single()

        if (profile) {
            plan = profile.plan
        }
    }

    const planDisplay = plan === 'pro' ? 'Pro' : plan === 'basic' ? 'Basic' : 'Free'

    return (
        <div className="flex flex-col gap-6 p-6 pt-10">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-primary">設定 ⚙️</h1>
            </div>

            {/* Plan Card */}
            <section className="glass rounded-[2rem] p-6 border border-primary/20 relative overflow-hidden shadow-sm bg-gradient-to-br from-white/80 to-white/40">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-1">現在のプラン 👑</span>
                    <div className="flex items-end gap-2 mb-4">
                        <h2 className="text-3xl font-black text-foreground/80">{planDisplay}</h2>
                        <span className="text-sm text-foreground/40 font-bold mb-1">/ 月</span>
                    </div>
                    <p className="text-xs text-foreground/60 font-bold leading-relaxed mb-6">
                        {plan === 'pro' ? (
                            <>すべての強力なAI機能が使い放題です ✨<br />専属コンサルタントとしてフルサポートします！</>
                        ) : (
                            <>すべての基本AI機能をご利用いただけます ✨<br />もっと詳しい売上予測やLTV分析はProプランで。</>
                        )}
                    </p>
                    <UpgradeButton currentPlan={plan} />
                </div>
            </section>

            {/* Menu Options */}
            <section className="flex flex-col gap-3">
                <MenuRow icon={<User />} label="プロフィール設定 👤" />
                <MenuRow icon={<CreditCard />} label="お支払い管理 💳" href="/api/stripe/portal" />
                <MenuRow icon={<ShieldCheck />} label="プライバシーとセキュリティ 🔒" />
                <MenuRow icon={<HelpCircle />} label="よくある質問・サポート ❓" />
            </section>

            {/* Logout */}
            <section className="mt-4">
                <button className="flex items-center justify-center gap-3 w-full p-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 text-rose-500 hover:bg-rose-500/10 transition-colors active:scale-[0.98] font-bold">
                    <LogOut className="w-5 h-5" />
                    <span>ログアウト 🚪</span>
                </button>
            </section>

            <div className="flex justify-center mt-6">
                <span className="text-[10px] text-foreground/30 font-bold tracking-widest uppercase">Crownia v1.0.0</span>
            </div>
        </div>
    )
}

function MenuRow({ icon, label, href = "#" }: any) {
    if (href.startsWith('/api')) {
        return (
            <a href={href} className="flex items-center justify-between p-4 glass rounded-2xl group active:scale-[0.98] transition-all border-border shadow-sm bg-white/40 hover:bg-white/60">
                <div className="flex items-center gap-4">
                    <div className="text-foreground/40 group-hover:text-primary transition-colors bg-white p-2 rounded-xl shadow-sm border border-border/50">
                        {icon}
                    </div>
                    <span className="font-bold text-foreground/80">{label}</span>
                </div>
                <svg className="w-5 h-5 text-foreground/20 group-hover:text-primary transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
            </a>
        )
    }

    return (
        <Link href={href} className="flex items-center justify-between p-4 glass rounded-2xl group active:scale-[0.98] transition-all border-border shadow-sm bg-white/40 hover:bg-white/60">
            <div className="flex items-center gap-4">
                <div className="text-foreground/40 group-hover:text-primary transition-colors bg-white p-2 rounded-xl shadow-sm border border-border/50">
                    {icon}
                </div>
                <span className="font-bold text-foreground/80">{label}</span>
            </div>
            <svg className="w-5 h-5 text-foreground/20 group-hover:text-primary transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
        </Link>
    )
}
