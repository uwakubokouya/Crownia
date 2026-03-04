import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { MessageCircle } from 'lucide-react'

export default async function LoginPage() {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (session) {
        redirect('/dashboard')
    }

    return (
        <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background p-6">
            <div className="w-full max-w-sm rounded-[32px] glass p-8 shadow-[0_8px_32px_rgba(255,180,200,0.2)]">
                <div className="mb-8 flex flex-col items-center text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/20">
                        <MessageCircle className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-primary">Crownia</h1>
                    <p className="mt-2 text-sm text-foreground/60 font-bold tracking-wide">売れっ子キャバ嬢の頭脳 🎀</p>
                </div>

                <div className="space-y-4">
                    <a
                        href="/api/auth/line"
                        className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-[#06C755] px-4 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#05b34c] hover:shadow-[0_0_20px_rgba(6,199,85,0.4)] active:scale-[0.98]"
                    >
                        <span className="relative z-10">LINEでログイン</span>
                    </a>
                </div>

                <p className="mt-8 text-center text-xs text-foreground/50 font-medium">
                    ログインすることで、利用規約およびプライバシーポリシーに同意したものとみなされます。
                </p>
            </div>
        </div>
    )
}
