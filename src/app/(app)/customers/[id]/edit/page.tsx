"use client"

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, User, Tag, Trash2, AlertTriangle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'

export default function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const resolvedParams = use(params)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    // Form fields
    const [name, setName] = useState('')
    const [type, setType] = useState('approval')

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const { data, error } = await supabase
                    .from('customers')
                    .select('*')
                    .eq('id', resolvedParams.id)
                    .single()

                if (error) throw error
                if (data) {
                    setName(data.display_name || '')
                    setType(data.current_type || 'approval')
                }
            } catch (err) {
                console.error('Error fetching customer:', err)
                alert('顧客情報の取得に失敗しました。')
                router.back()
            } finally {
                setIsLoading(false)
            }
        }
        fetchCustomer()
    }, [resolvedParams.id, supabase, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return

        setIsSaving(true)
        try {
            const { error } = await supabase
                .from('customers')
                .update({
                    display_name: name.trim(),
                    current_type: type
                })
                .eq('id', resolvedParams.id)

            if (error) throw error

            router.push(`/customers/${resolvedParams.id}`)
        } catch (error) {
            console.error('Error updating customer:', error)
            alert('更新に失敗しました。時間をおいて再試行してください。')
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            // Because of foreign keys (events, ai_recommendations), we must delete them first or rely on CASCADE.
            // Assuming we manually delete events to be safe
            await supabase.from('events').delete().eq('customer_id', resolvedParams.id)
            await supabase.from('ai_recommendations').delete().eq('customer_id', resolvedParams.id)

            const { error } = await supabase
                .from('customers')
                .delete()
                .eq('id', resolvedParams.id)

            if (error) throw error

            router.push('/customers')
        } catch (error) {
            console.error('Error deleting customer:', error)
            alert('削除に失敗しました。')
            setIsDeleting(false)
            setShowDeleteConfirm(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-[100dvh] bg-white items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-muted" />
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-[100dvh] bg-white pb-20">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center justify-between">
                <Link href={`/customers/${resolvedParams.id}`} className="p-2 -ml-2 text-foreground hover:text-black transition-colors">
                    <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
                </Link>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium tracking-widest uppercase text-foreground">Edit Client</span>
                </div>
            </header>

            <div className="flex flex-col gap-10 p-6">
                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    <div>
                        <h1 className="text-2xl font-light tracking-wide text-foreground uppercase mb-2">顧客情報の編集</h1>
                        <p className="text-[11px] text-muted font-light tracking-widest">
                            お客様の基本情報を更新します。
                        </p>
                    </div>

                    <div className="flex flex-col gap-6">
                        {/* Name */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] text-muted font-normal uppercase tracking-widest flex items-center gap-1.5">
                                <User className="w-3 h-3 text-muted" strokeWidth={1.5} /> DISPLAY NAME / 表示名 <span className="text-rose-600">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="田中さん (IT社長)"
                                className="w-full bg-white border border-border rounded-none px-4 py-3 placeholder-muted focus:outline-none focus:border-foreground text-foreground transition-all font-light text-[15px] tracking-wide"
                            />
                        </div>

                        {/* Customer Type */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] text-muted font-normal uppercase tracking-widest flex items-center gap-1.5 mb-1">
                                <Tag className="w-3 h-3 text-muted" strokeWidth={1.5} /> CLIENT TYPE / 顧客タイプ
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { id: 'approval', label: '承認欲求型' },
                                    { id: 'lonely', label: '寂しがり屋型' },
                                    { id: 'control', label: '支配型' },
                                    { id: 'hobby', label: '趣味特化型' },
                                    { id: 'status', label: 'ステータス誇示型' }
                                ].map((t) => (
                                    <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => setType(t.id)}
                                        className={`py-3 px-4 border text-[12px] font-light tracking-wide transition-all ${type === t.id
                                                ? 'border-foreground bg-foreground text-white'
                                                : 'border-border bg-zinc-50 text-muted hover:border-black hover:text-foreground'
                                            }`}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                            <p className="text-[9px] text-muted mt-2 font-light tracking-wide">
                                ※ AI分析を実行すると、タイプは自動で上書きされる場合があります。
                            </p>
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
                                SAVE CHANGES / 変更を保存する
                            </>
                        )}
                    </button>
                </form>

                {/* Danger Zone: Delete Customer */}
                <div className="mt-8 pt-8 border-t border-rose-100 flex flex-col gap-4">
                    <h2 className="text-[10px] font-normal uppercase tracking-widest text-rose-600 flex items-center gap-1.5">
                        <AlertTriangle className="w-3 h-3" strokeWidth={1.5} /> DANGER ZONE / 危険な操作
                    </h2>

                    {!showDeleteConfirm ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="w-full py-4 text-[11px] font-normal tracking-widest uppercase border border-rose-200 text-rose-600 bg-white hover:bg-rose-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                            DELETE CLIENT / 顧客を削除する
                        </button>
                    ) : (
                        <div className="bg-rose-50 border border-rose-200 p-5 flex flex-col gap-4">
                            <p className="text-[11px] text-rose-900 font-light leading-relaxed">
                                この操作は取り消せません。来店履歴やAI分析データを含むすべての情報が永久に削除されます。本当に削除しますか？
                            </p>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    disabled={isDeleting}
                                    className="flex-1 py-3 text-[10px] bg-white border border-rose-200 uppercase tracking-widest font-normal text-rose-600 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="flex-1 py-3 text-[10px] bg-rose-600 uppercase tracking-widest font-normal text-white flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Yes, Delete'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
