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
        <div className="flex flex-col gap-8 p-6 pt-12">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-light tracking-wide text-foreground uppercase">Settings</h1>
            </div>

            {/* Plan Card */}
            <section className="premium-card p-6 border border-border bg-white">
                <div className="relative">
                    <span className="text-[9px] font-normal text-muted uppercase tracking-widest block mb-4 border-b border-border pb-2">Current Plan</span>
                    <div className="flex items-end gap-2 mb-5">
                        <h2 className="text-4xl font-light text-foreground tracking-tight font-sans uppercase">{planDisplay}</h2>
                        <span className="text-xs text-muted font-normal mb-1.5 uppercase tracking-widest">/ 月</span>
                    </div>
                    <p className="text-[12px] text-muted font-light tracking-wide leading-relaxed mb-8">
                        {plan === 'pro' ? (
                            <>すべての強力なAI機能が使い放題です。<br />専属コンサルタントとしてフルサポートします。</>
                        ) : (
                            <>すべての基本AI機能をご利用いただけます。<br />もっと詳しい売上予測やLTV分析はProプランで。</>
                        )}
                    </p>
                    <UpgradeButton currentPlan={plan} />
                </div>
            </section>

            {/* Menu Options */}
            <section className="flex flex-col gap-3">
                <MenuRow icon={<User strokeWidth={1.5} />} label="プロフィール設定" />
                <MenuRow icon={<CreditCard strokeWidth={1.5} />} label="お支払い管理" href="/api/stripe/portal" />
                <MenuRow icon={<ShieldCheck strokeWidth={1.5} />} label="プライバシーとセキュリティ" />
                <MenuRow icon={<HelpCircle strokeWidth={1.5} />} label="よくある質問・サポート" />
            </section>

            {/* Logout */}
            <section className="mt-4">
                <button className="flex items-center justify-center gap-3 w-full p-4 border border-border bg-white text-muted hover:bg-zinc-50 hover:text-foreground transition-all active:scale-[0.99] font-light tracking-widest uppercase">
                    <LogOut className="w-4 h-4" strokeWidth={1.5} />
                    <span className="text-[11px]">ログアウト</span>
                </button>
            </section>

            <div className="flex justify-center mt-6">
                <span className="text-[9px] text-muted/40 font-normal tracking-widest uppercase">Crownia v1.0.0</span>
            </div>
        </div>
    )
}

function MenuRow({ icon, label, href = "#" }: any) {
    const content = (
        <>
            <div className="flex items-center gap-4">
                <div className="text-muted group-hover:text-foreground transition-colors">
                    {icon}
                </div>
                <span className="font-light text-[14px] text-foreground tracking-wide">{label}</span>
            </div>
            <svg className="w-4 h-4 text-muted/40 group-hover:text-foreground transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
        </>
    )

    const classes = "flex items-center justify-between p-5 premium-card group active:scale-[0.99] transition-all hover:border-foreground bg-white border border-border"

    if (href.startsWith('/api')) {
        return (
            <a href={href} className={classes}>
                {content}
            </a>
        )
    }

    return (
        <Link href={href} className={classes}>
            {content}
        </Link>
    )
}
