"use client"

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { PriorityConfig, defaultPriorityConfig } from '@/lib/utils/priority'
import { ArrowLeft, Save, Loader2, RotateCcw } from 'lucide-react'
import Link from 'next/link'

export default function PrioritySettingsPage() {
    const [config, setConfig] = useState<PriorityConfig | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    const customSettings = user.user_metadata?.priority_settings
                    if (customSettings) {
                        setConfig({ ...defaultPriorityConfig, ...customSettings })
                    } else {
                        setConfig(defaultPriorityConfig)
                    }
                }
            } catch (err) {
                console.error("Error fetching user settings", err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchSettings()
    }, [supabase])

    const handleSave = async () => {
        if (!config) return
        setIsSaving(true)
        try {
            const { error } = await supabase.auth.updateUser({
                data: { priority_settings: config }
            })
            if (error) throw error
            alert('設定を保存しました。')
        } catch (err) {
            console.error(err)
            alert('保存に失敗しました。')
        } finally {
            setIsSaving(false)
        }
    }

    const resetToDefault = () => {
        if (confirm('設定を初期値に戻しますか？')) {
            setConfig(defaultPriorityConfig)
        }
    }

    if (isLoading || !config) {
        return (
            <div className="flex flex-col min-h-[100dvh] bg-white pb-20 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-muted" />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 p-6 pt-12 pb-24 max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-2">
                <Link href="/settings" className="p-2 border border-border bg-white text-muted hover:text-foreground transition-colors active:scale-95">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-xl font-light tracking-wide text-foreground uppercase">Priority Settings / 優先度カスタマイズ</h1>
            </div>

            <p className="text-xs text-muted font-light leading-relaxed">
                ダッシュボードやアクションタブの「お客様の表示順（優先度）」を決める採点ルールを変更できます。お店の戦略に合わせて点数を調整してください。
            </p>

            <section className="premium-card p-6 border border-border bg-white flex flex-col gap-6">
                <div>
                    <h2 className="text-sm tracking-widest uppercase mb-4 pb-2 border-b border-border text-foreground">1. Stage Score / 関係値の基礎点</h2>
                    <p className="text-[10px] text-muted mb-4 uppercase tracking-widest">現在の関係性に応じた基本スコア</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <NumberInput label="興味 (Interest)" value={config.stageScores.interest} onChange={(v) => setConfig({ ...config, stageScores: { ...config.stageScores, interest: v } })} />
                        <NumberInput label="関係構築 (Build)" value={config.stageScores.build} onChange={(v) => setConfig({ ...config, stageScores: { ...config.stageScores, build: v } })} />
                        <NumberInput label="信頼 (Trust)" value={config.stageScores.trust} onChange={(v) => setConfig({ ...config, stageScores: { ...config.stageScores, trust: v } })} />
                        <NumberInput label="依存 (Depend)" value={config.stageScores.depend} onChange={(v) => setConfig({ ...config, stageScores: { ...config.stageScores, depend: v } })} />
                        <NumberInput label="高単価 (High Value)" value={config.stageScores.highvalue} onChange={(v) => setConfig({ ...config, stageScores: { ...config.stageScores, highvalue: v } })} />
                    </div>
                </div>

                <div>
                    <h2 className="text-sm tracking-widest uppercase mb-4 pb-2 border-b border-border text-foreground mt-4">2. Danger Level / 危険度の加点</h2>
                    <p className="text-[10px] text-muted mb-4 uppercase tracking-widest">失客リスクによる緊急優先スコア</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <NumberInput label="Caution (注意)" value={config.dangerScores.caution} onChange={(v) => setConfig({ ...config, dangerScores: { ...config.dangerScores, caution: v } })} />
                        <NumberInput label="Danger (危険)" value={config.dangerScores.danger} onChange={(v) => setConfig({ ...config, dangerScores: { ...config.dangerScores, danger: v } })} />
                        <NumberInput label="Critical (危機的)" value={config.dangerScores.critical} onChange={(v) => setConfig({ ...config, dangerScores: { ...config.dangerScores, critical: v } })} />
                    </div>
                </div>

                <div>
                    <h2 className="text-sm tracking-widest uppercase mb-4 pb-2 border-b border-border text-foreground mt-4">3. Visit Value / 来店回数の評価</h2>
                    <p className="text-[10px] text-muted mb-4 uppercase tracking-widest">累計来店回数×倍率 (最大上限あり)</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <NumberInput label="1回あたりの加点倍率" value={config.visitMultiplier} onChange={(v) => setConfig({ ...config, visitMultiplier: v })} />
                        <NumberInput label="来店回数による加点上限" value={config.visitMaxBonus} onChange={(v) => setConfig({ ...config, visitMaxBonus: v })} />
                    </div>
                </div>

                <div>
                    <h2 className="text-sm tracking-widest uppercase mb-4 pb-2 border-b border-border text-foreground mt-4">4. Recency Bonus / 来店日からの経過ボーナス</h2>
                    <p className="text-[10px] text-muted mb-4 uppercase tracking-widest">直近またはご無沙汰による加点設定</p>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex flex-col gap-2 p-4 border border-border bg-zinc-50">
                            <span className="text-[11px] font-bold tracking-widest text-foreground">感謝・アフターフォロー (直近)</span>
                            <div className="flex items-center gap-4">
                                <NumberInput label="対象日数 (以内)" value={config.recencyScores.recentDays} onChange={(v) => setConfig({ ...config, recencyScores: { ...config.recencyScores, recentDays: v } })} />
                                <NumberInput label="加点額" value={config.recencyScores.recentBonus} onChange={(v) => setConfig({ ...config, recencyScores: { ...config.recencyScores, recentBonus: v } })} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 p-4 border border-border bg-zinc-50">
                            <span className="text-[11px] font-bold tracking-widest text-foreground">呼び戻し (1段階目)</span>
                            <div className="flex items-center gap-4">
                                <NumberInput label="対象日数 (以上)" value={config.recencyScores.awayDays} onChange={(v) => setConfig({ ...config, recencyScores: { ...config.recencyScores, awayDays: v } })} />
                                <NumberInput label="加点額" value={config.recencyScores.awayBonus} onChange={(v) => setConfig({ ...config, recencyScores: { ...config.recencyScores, awayBonus: v } })} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 p-4 border border-border bg-zinc-50">
                            <span className="text-[11px] font-bold tracking-widest text-foreground">長期失客・コールド (2段階目)</span>
                            <div className="flex items-center gap-4">
                                <NumberInput label="対象日数 (以上)" value={config.recencyScores.churnDays} onChange={(v) => setConfig({ ...config, recencyScores: { ...config.recencyScores, churnDays: v } })} />
                                <NumberInput label="加点額" value={config.recencyScores.churnBonus} onChange={(v) => setConfig({ ...config, recencyScores: { ...config.recencyScores, churnBonus: v } })} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-8 border-t border-border pt-6">
                    <button
                        onClick={resetToDefault}
                        className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-normal text-muted hover:text-foreground active:scale-95 transition-all"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset to Default
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="premium-btn text-[11px] px-8 py-3 flex items-center gap-2 hover:premium-btn-hover active:premium-btn-active disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isSaving ? 'SAVING...' : 'SAVE SETTINGS'}
                    </button>
                </div>
            </section>
        </div>
    )
}

function NumberInput({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-[10px] font-normal tracking-widest uppercase text-muted">{label}</label>
            <input
                type="number"
                value={value}
                onChange={e => onChange(Number(e.target.value))}
                className="w-full bg-white border border-border p-2.5 text-sm font-light text-foreground focus:outline-none focus:border-black transition-colors"
            />
        </div>
    )
}
