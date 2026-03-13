"use client"

import { ArrowLeft, Save, User, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function ProfileSettingsPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [displayName, setDisplayName] = useState('')
    const [email, setEmail] = useState('')

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return

                setEmail(user.email || '')

                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('display_name')
                    .eq('id', user.id)
                    .single()

                if (error) throw error
                if (profile) {
                    setDisplayName(profile.display_name || '')
                }
            } catch (err) {
                console.error('Error fetching profile:', err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchProfile()
    }, [supabase])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            const { error } = await supabase
                .from('profiles')
                .update({ display_name: displayName })
                .eq('id', user.id)

            if (error) throw error
            alert('プロフィールを更新しました。')
        } catch (error) {
            console.error('Error updating profile:', error)
            alert('プロフィールの更新に失敗しました。')
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-[100dvh] bg-white pb-20 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-muted" />
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-[100dvh] bg-white pb-20">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center gap-4">
                <Link href="/settings" className="p-2 -ml-2 text-foreground hover:text-black transition-colors">
                    <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
                </Link>
                <h1 className="text-[13px] font-light tracking-widest uppercase">Profile Settings</h1>
            </header>

            <form onSubmit={handleSave} className="flex flex-col gap-8 p-6">
                <div>
                    <h2 className="text-2xl font-light tracking-wide text-foreground uppercase mb-2">プロフィール設定</h2>
                    <p className="text-[11px] text-muted font-light tracking-widest leading-relaxed">
                        アプリ内で表示されるご自身のお名前を変更できます。
                    </p>
                </div>

                <div className="flex flex-col gap-6">
                    {/* Display Name */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] text-muted font-normal uppercase tracking-widest flex items-center gap-1.5">
                            <User className="w-3 h-3 text-muted" strokeWidth={1.5} /> DISPLAY NAME / 表示名
                        </label>
                        <input
                            type="text"
                            required
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Crownia 太郎"
                            className="w-full bg-white border border-border rounded-none px-4 py-3 placeholder-muted focus:outline-none focus:border-foreground text-foreground transition-all font-light text-[15px] tracking-wide"
                        />
                    </div>

                    {/* Email (Read Only) */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] text-muted font-normal uppercase tracking-widest flex items-center gap-1.5 opacity-60">
                            EMAIL / メールアドレス (変更不可)
                        </label>
                        <input
                            type="email"
                            disabled
                            value={email}
                            className="w-full bg-zinc-50 border border-border rounded-none px-4 py-3 text-muted cursor-not-allowed transition-all font-light text-[13px] tracking-wide"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSaving}
                    className="mt-4 w-full bg-foreground text-white border border-foreground py-4 flex items-center justify-center gap-2 font-normal tracking-widest uppercase text-xs transition-all hover:bg-[#222] active:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Save className="w-4 h-4" strokeWidth={1.5} />
                            SAVE PROFILE / 保存する
                        </>
                    )}
                </button>
            </form>
        </div>
    )
}
