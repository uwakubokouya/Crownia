'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, Zap, Settings } from 'lucide-react'

export function BottomNav() {
    const pathname = usePathname()

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-safe bg-white border-t border-border">
            <nav className="w-full max-w-md bg-white px-8 py-3 flex items-center justify-between">
                <NavItem href="/dashboard" icon={<Home strokeWidth={1.5} className="w-[22px] h-[22px]" />} label="HOME" active={pathname?.startsWith('/dashboard')} />
                <NavItem href="/customers" icon={<Users strokeWidth={1.5} className="w-[22px] h-[22px]" />} label="CLIENTS" active={pathname?.startsWith('/customers')} />
                <NavItem href="/actions" icon={<Zap strokeWidth={1.5} className="w-[22px] h-[22px]" />} label="STRATEGY" active={pathname?.startsWith('/actions')} />
                <NavItem href="/settings" icon={<Settings strokeWidth={1.5} className="w-[22px] h-[22px]" />} label="SETTINGS" active={pathname?.startsWith('/settings')} />
            </nav>
        </div>
    )
}

function NavItem({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
    return (
        <Link href={href} className="flex flex-col items-center gap-1.5 w-16 group outline-none">
            <div className={`transition-all duration-300 ${active ? 'text-foreground' : 'text-muted hover:text-foreground group-active:scale-95'}`}>
                {icon}
            </div>
            <span className={`text-[9px] font-medium tracking-widest transition-colors ${active ? 'text-foreground' : 'text-muted group-hover:text-foreground'}`}>
                {label}
            </span>
        </Link>
    )
}
