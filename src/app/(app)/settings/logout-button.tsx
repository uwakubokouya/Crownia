'use client'

import { LogOut } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
    const router = useRouter()

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 w-full p-4 border border-border bg-white text-muted hover:bg-zinc-50 hover:text-foreground transition-all active:scale-[0.99] active:bg-zinc-100 font-light tracking-widest uppercase cursor-pointer"
        >
            <LogOut className="w-4 h-4" strokeWidth={1.5} />
            <span className="text-[11px]">ログアウト</span>
        </button>
    )
}
