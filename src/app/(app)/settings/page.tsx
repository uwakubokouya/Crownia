'use client'

import { User, CreditCard, ShieldCheck, HelpCircle, LogOut } from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
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
                        <h2 className="text-3xl font-black text-foreground/80">Basic</h2>
                        <span className="text-sm text-foreground/40 font-bold mb-1">/ 月</span>
                    </div>
                    <p className="text-xs text-foreground/60 font-bold leading-relaxed mb-6">
                        すべての基本AI機能をご利用いただけます ✨<br />もっと詳しい売上予測やLTV分析はProプランで。
                    </p>
                    <button
                        onClick={async () => {
                            try {
                                const res = await fetch('/api/stripe/checkout', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_placeholder' }) // Ensure this env var exists in Vercel
                                })
                                const data = await res.json()
                                if (data.url) {
                                    window.location.href = data.url
                                } else if (data.error) {
                                    alert(`エラー: ${data.error}`)
                                } else {
                                    alert('不明なエラーが発生しました')
                                }
                            } catch (e: any) {
                                console.error(e)
                                alert(`通信エラー: ${e.message}`)
                            }
                        }}
                        className="w-full bg-gradient-to-r from-primary to-rose-400 hover:from-primary/90 hover:to-rose-400/90 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-primary/30 active:scale-[0.98]"
                    >
                        Proプランにアップグレード 💖
                    </button>
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
