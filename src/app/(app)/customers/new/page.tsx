"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'

export default function NewCustomerPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState('')
    const [type, setType] = useState('auto')
    const [memo, setMemo] = useState('')

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return

        setIsLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()

            // Allow bypassing auth in local dev with dummy data
            const userId = user?.id || 'd1b54ac6-2244-4860-9dc4-177b9dcca967' // Fallback UUID for dev if needed

            if (!user && process.env.NODE_ENV !== 'development') {
                throw new Error('Not authenticated')
            }

            const { data, error } = await supabase
                .from('customers')
                .insert([
                    {
                        user_id: userId,
                        display_name: name.trim(),
                        display_name_normalized: name.replace(/\s+/g, '').toLowerCase(),
                        stage: 'interest',
                        current_type: type === 'auto' ? null : type,
                        notes: memo.trim()
                    }
                ])
                .select('id')
                .single()

            if (error) throw error

            if (data) {
                router.push(`/customers/${data.id}`)
            } else {
                router.push('/customers')
            }
        } catch (error) {
            console.error('Error adding customer:', error)
            alert('エラーが発生しました。ログイン状態を確認してください。')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col min-h-[100dvh] bg-white pb-20">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center justify-between">
                <Link href="/customers" className="p-2 -ml-2 text-foreground hover:text-black transition-colors">
                    <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
                </Link>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium tracking-widest uppercase">New Client</span>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8 p-6">
                <div>
                    <h1 className="text-2xl font-light tracking-wide text-foreground uppercase mb-2">新規顧客登録</h1>
                    <p className="text-[11px] text-muted font-light tracking-widest">
                        お客様の基本情報を入力してください。関係値（段階）は自動で「興味」からスタートします。
                    </p>
                </div>

                <div className="flex flex-col gap-6">
                    {/* Name */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] text-muted font-normal uppercase tracking-widest flex items-center gap-1.5">
                            NAME / お名前 <span className="text-rose-600">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="山田 太郎"
                            className="w-full bg-white border border-border rounded-none px-4 py-3 placeholder-muted focus:outline-none focus:border-foreground text-foreground transition-all font-light text-[15px] tracking-wide"
                        />
                    </div>

                    {/* Type */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] text-muted font-normal uppercase tracking-widest">
                            TYPE / 顧客タイプ
                        </label>
                        <div className="relative">
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full appearance-none bg-white border border-border rounded-none px-4 py-3 focus:outline-none focus:border-foreground text-foreground transition-all font-light text-[15px] tracking-wide"
                            >
                                <option value="auto">AIにお任せ (後から自動判定)</option>
                                <option value="approval">承認欲求型 (褒められたい/認められたい)</option>
                                <option value="lonely">寂しがり屋型 (話を聞いてほしい/構ってほしい)</option>
                                <option value="control">支配型 (自分の思い通りにしたい/アドバイスしたい)</option>
                                <option value="hobby">趣味特化型 (共通の趣味で盛り上がりたい/オタク気質)</option>
                                <option value="status">ステータス誇示型 (お金持ちアピール/VIP待遇を好む)</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>

                    {/* Memo */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] text-muted font-normal uppercase tracking-widest">
                            MEMO / 特徴・メモ
                        </label>
                        <textarea
                            value={memo}
                            onChange={(e) => setMemo(e.target.value)}
                            placeholder="職業、趣味、好きな飲み物、家族構成など..."
                            rows={5}
                            className="w-full bg-white border border-border rounded-none px-4 py-3 placeholder-muted focus:outline-none focus:border-foreground text-foreground transition-all font-light text-[13px] tracking-wide resize-none"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading || !name.trim()}
                    className="mt-4 w-full bg-foreground text-white border border-foreground py-4 flex items-center justify-center gap-2 font-normal tracking-widest uppercase text-xs transition-all hover:bg-[#222] active:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Save className="w-4 h-4" strokeWidth={1.5} />
                            REGISTER / 登録する
                        </>
                    )}
                </button>
            </form>
        </div>
    )
}
