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
                <h1 className="text-2xl font-black tracking-tight text-stone-800">設定</h1>
            </div>

            {/* Plan Card */}
            <section className="premium-card p-6 relative overflow-hidden bg-gradient-to-br from-white to-rose-50/30">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
                <div className="relative">
                    <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest block mb-1">現在のプラン</span>
                    <div className="flex items-end gap-2 mb-4">
                        <h2 className="text-3xl font-black text-stone-800 tracking-tight font-sans">{planDisplay}</h2>
                        <span className="text-sm text-stone-400 font-bold mb-1">/ 月</span>
                    </div>
                    <p className="text-xs text-stone-500 font-medium leading-relaxed mb-6">
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
                <MenuRow icon={<User />} label="プロフィール設定" />
                <MenuRow icon={<CreditCard />} label="お支払い管理" href="/api/stripe/portal" />
                <MenuRow icon={<ShieldCheck />} label="プライバシーとセキュリティ" />
                <MenuRow icon={<HelpCircle />} label="よくある質問・サポート" />
            </section>

            {/* Logout */}
            <section className="mt-4">
                <button className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl border border-stone-200 bg-white text-stone-500 hover:bg-stone-50 transition-colors active:scale-[0.98] font-bold shadow-sm">
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">ログアウト</span>
                </button>
            </section>

            <div className="flex justify-center mt-6">
                <span className="text-[10px] text-stone-300 font-bold tracking-widest uppercase">Crownia v1.0.0</span>
            </div>
        </div>
    )
}

function MenuRow({ icon, label, href = "#" }: any) {
    const content = (
        <>
            <div className="flex items-center gap-4">
                <div className="text-stone-400 group-hover:text-rose-500 transition-colors bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                    {icon}
                </div>
                <span className="font-bold text-stone-700 tracking-wide">{label}</span>
            </div>
            <svg className="w-5 h-5 text-stone-300 group-hover:text-rose-400 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
        </>
    )

    const classes = "flex items-center justify-between p-4 premium-card group active:scale-[0.98] transition-all hover:border-rose-100 hover:shadow-md cursor-pointer"

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
