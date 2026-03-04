'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, Zap, Settings } from 'lucide-react'

export function BottomNav() {
    const pathname = usePathname()

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-safe">
            <nav className="w-full max-w-md glass px-6 py-3 flex items-center justify-between rounded-t-3xl shadow-[0_-4px_20px_rgba(255,180,200,0.3)] bg-white/80">
                <NavItem href="/dashboard" icon={<Home className="w-6 h-6" />} label="ホーム" active={pathname?.startsWith('/dashboard')} />
                <NavItem href="/customers" icon={<Users className="w-6 h-6" />} label="お客様" active={pathname?.startsWith('/customers')} />
                <NavItem href="/actions" icon={<Zap className="w-6 h-6" />} label="作戦" active={pathname?.startsWith('/actions')} />
                <NavItem href="/settings" icon={<Settings className="w-6 h-6" />} label="設定" active={pathname?.startsWith('/settings')} />
            </nav>
        </div>
    )
}

function NavItem({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
    return (
        <Link href={href} className="flex flex-col items-center gap-1.5 w-16 group outline-none">
            <div className={`p-2 rounded-xl transition-all duration-300 ${active ? 'bg-rose-100 text-rose-500 shadow-sm' : 'text-stone-400 hover:text-stone-600 group-active:scale-95'}`}>
                {icon}
            </div>
            <span className={`text-[10px] font-bold transition-colors ${active ? 'text-rose-500' : 'text-stone-400 group-hover:text-stone-600'}`}>
                {label}
            </span>
        </Link>
    )
}
