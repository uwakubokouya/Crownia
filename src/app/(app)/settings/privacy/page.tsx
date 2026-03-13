"use client"

import { ArrowLeft, ShieldCheck, FileText, ToggleRight, ToggleLeft, Loader2, Save } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function PrivacySettingsPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isConsented, setIsConsented] = useState<boolean>(false)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        const fetchPrivacySetting = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return

                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('is_user_consented_raw')
                    .eq('id', user.id)
                    .single()

                if (error) throw error
                if (profile) {
                    setIsConsented(profile.is_user_consented_raw ?? false)
                }
            } catch (err) {
                console.error('Error fetching privacy settings:', err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchPrivacySetting()
    }, [supabase])

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            const { error } = await supabase
                .from('profiles')
                .update({ is_user_consented_raw: isConsented })
                .eq('id', user.id)

            if (error) throw error
            alert('プライバシー設定を更新しました。')
        } catch (error) {
            console.error('Error updating privacy settings:', error)
            alert('更新に失敗しました。')
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
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/settings" className="p-2 -ml-2 text-foreground hover:text-black transition-colors">
                        <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
                    </Link>
                    <h1 className="text-[13px] font-light tracking-widest uppercase">Privacy & Security</h1>
                </div>
                <ShieldCheck className="w-5 h-5 text-muted" strokeWidth={1.5} />
            </header>

            <div className="flex flex-col gap-8 p-6">
                <div>
                    <h2 className="text-2xl font-light tracking-wide text-foreground uppercase mb-2">プライバシーとセキュリティ</h2>
                    <p className="text-[11px] text-muted font-light tracking-widest leading-relaxed">
                        アカウントのセキュリティとデータの取り扱いに関する設定を管理します。
                    </p>
                </div>

                <div className="flex flex-col gap-6">
                    {/* Consent Toggle */}
                    <div className="premium-card p-5 bg-white border border-border">
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[12px] font-normal tracking-wide text-foreground flex items-center gap-2">
                                    AIパーソナライズ解析の許可
                                </span>
                                <span className="text-[10px] text-muted font-light tracking-widest leading-relaxed">
                                    顧客との会話データ（LINE等）を使用し、あなた専用の接客戦略（AI Priority Score、Action Cards等）を生成・最適化することに同意します。
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsConsented(!isConsented)}
                                className="text-foreground active:scale-95 transition-all mt-1"
                            >
                                {isConsented ? (
                                    <ToggleRight className="w-8 h-8 text-foreground" strokeWidth={1.5} />
                                ) : (
                                    <ToggleLeft className="w-8 h-8 text-muted" strokeWidth={1.5} />
                                )}
                            </button>
                        </div>

                        {!isConsented && (
                            <div className="p-3 bg-red-50 border border-red-100 mt-4 rounded-sm">
                                <p className="text-[10px] text-red-600 font-light tracking-wide leading-relaxed">
                                    【注意】AI解析の許可がオフの場合、新しいLINE解析やAI戦略の生成が行えなくなります。（すでに生成された履歴の閲覧は可能です）
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Policy Links */}
                    <div className="flex flex-col gap-3">
                        <Link href="/privacy" className="flex items-center justify-between p-4 premium-card group active:scale-[0.99] transition-all hover:border-foreground bg-white border border-border">
                            <div className="flex items-center gap-3">
                                <FileText className="w-4 h-4 text-muted group-hover:text-foreground transition-colors" strokeWidth={1.5} />
                                <span className="font-light text-[13px] text-foreground tracking-wide">プライバシーポリシー</span>
                            </div>
                            <svg className="w-4 h-4 text-muted/40 group-hover:text-foreground transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                        </Link>
                        <Link href="/terms" className="flex items-center justify-between p-4 premium-card group active:scale-[0.99] transition-all hover:border-foreground bg-white border border-border">
                            <div className="flex items-center gap-3">
                                <FileText className="w-4 h-4 text-muted group-hover:text-foreground transition-colors" strokeWidth={1.5} />
                                <span className="font-light text-[13px] text-foreground tracking-wide">利用規約</span>
                            </div>
                            <svg className="w-4 h-4 text-muted/40 group-hover:text-foreground transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                        </Link>
                    </div>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="mt-2 w-full bg-foreground text-white border border-foreground py-4 flex items-center justify-center gap-2 font-normal tracking-widest uppercase text-xs transition-all hover:bg-[#222] active:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Save className="w-4 h-4" strokeWidth={1.5} />
                            SAVE SETTINGS / 設定を保存する
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
