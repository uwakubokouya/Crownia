import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default async function LoginPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        redirect('/dashboard')
    }

    return (
        <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-white p-6">
            <div className="w-full max-w-sm p-10 border border-border bg-white">
                <div className="mb-12 flex flex-col items-center text-center">
                    <div className="mb-8 h-36 w-36 relative">
                        <Image
                            src="/logo.png"
                            alt="Crownia Logo"
                            fill
                            className="object-contain mix-blend-darken"
                            priority
                        />
                    </div>
                    <h1 className="text-2xl font-light tracking-widest text-foreground uppercase">Crownia</h1>
                    <p className="mt-3 text-[10px] text-muted font-light tracking-widest uppercase">Intelligence for Top Hostesses</p>
                </div>

                <div className="space-y-4">
                    <a
                        href="/api/auth/line"
                        className="group relative flex w-full items-center justify-center gap-3 bg-white px-4 py-4 text-[11px] font-normal uppercase tracking-widest text-foreground transition-all border border-foreground hover:bg-foreground hover:text-white active:scale-[0.99]"
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
                            <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 3.269 8.846 8.154 9.615.315.069.738.215.845.508.093.269.031.684.016.969-.031.338-.154 1.015-.154 1.015s-.046.261.123.353c.169.092.4.015.4.015.123-.015 1.569-.738 2.061-1.046.508-.308 2.769-1.661 3.83-2.815C21.784 16.538 24 13.684 24 10.304z" />
                        </svg>
                        <span className="relative z-10">CONTINUE WITH LINE</span>
                    </a>
                </div>

                <div className="mt-10 text-center text-[10px] text-muted font-light tracking-wider leading-relaxed">
                    ログインすることで、
                    <Link href="/terms" className="underline hover:text-foreground transition-colors">利用規約</Link>
                    および
                    <br />
                    <Link href="/privacy" className="underline hover:text-foreground transition-colors">プライバシーポリシー</Link>
                    に同意したものとみなされます。
                </div>
            </div>
        </div>
    )
}
