import { User, CreditCard, ShieldCheck, HelpCircle, LogOut, Zap } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { UpgradeButton } from './upgrade-button'
import { LogoutButton } from './logout-button'

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
                            <>顧客登録数 上限30名まで。<br />強力なAIモデル搭載の最上位プランです。<br />登録上限無制限をご希望の場合はサポートまでご連絡下さい。</>
                        ) : plan === 'basic' ? (
                            <>顧客登録数 上限15名まで。<br />上位AIモデル搭載プランです。</>
                        ) : (
                            <>無料お試しプラン（顧客登録 上限5名まで）。<br />すべての基本AI機能をご利用いただけます。</>
                        )}
                    </p>
                    <UpgradeButton currentPlan={plan} />
                </div>
            </section>

            {/* Menu Options */}
            <section className="flex flex-col gap-3">
                <MenuRow icon={<User strokeWidth={1.5} />} label="プロフィール設定" />
                <MenuRow icon={<Zap strokeWidth={1.5} />} label="AI優先度スコア設定" href="/settings/priority" />
                <MenuRow icon={<CreditCard strokeWidth={1.5} />} label="お支払い管理" href="/api/stripe/portal" />
                <MenuRow icon={<ShieldCheck strokeWidth={1.5} />} label="プライバシーとセキュリティ" />
                <MenuRow icon={<HelpCircle strokeWidth={1.5} />} label="よくある質問・サポート" />
            </section>

            {/* Logout */}
            <section className="mt-4">
                <LogoutButton />
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
