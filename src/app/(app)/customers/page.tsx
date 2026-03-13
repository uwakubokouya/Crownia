"use client"

import { Search, Plus, ShieldAlert, Zap, Loader2, Star, Filter } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function CustomersPage() {
    const [customers, setCustomers] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [stageFilter, setStageFilter] = useState<string>('all')
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                const userId = user?.id || 'd1b54ac6-2244-4860-9dc4-177b9dcca967' // Fallback for dev

                const { data, error } = await supabase
                    .from('customers')
                    .select('*')
                    .eq('user_id', userId)
                    .order('created_at', { ascending: false })

                if (error) throw error
                setCustomers(data || [])
            } catch (err) {
                console.error('Error fetching customers:', err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchCustomers()
    }, [])

    const stageLabels: Record<string, string> = {
        interest: '興味',
        build: '関係構築',
        trust: '信頼',
        depend: '依存',
        highvalue: '高単価'
    };

    const toggleFavoriteList = async (e: React.MouseEvent, id: string, currentStatus: boolean) => {
        e.preventDefault()
        try {
            const { error } = await supabase
                .from('customers')
                .update({ is_favorite: !currentStatus })
                .eq('id', id)
            
            if (error) throw error

            setCustomers(prev => prev.map(c => 
                c.id === id ? { ...c, is_favorite: !currentStatus } : c
            ))
        } catch (error) {
            console.error('Failed to toggle favorite', error)
        }
    }

    const filteredCustomers = customers.filter(c => {
        if (showFavoritesOnly && !c.is_favorite) return false
        if (stageFilter !== 'all' && c.stage !== stageFilter) return false
        if (searchQuery && !c.display_name.toLowerCase().includes(searchQuery.toLowerCase())) return false
        return true
    })

    return (
        <div className="flex flex-col gap-8 p-6 pt-12 min-h-screen pb-24">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-light tracking-wide text-foreground uppercase">Clients</h1>
                <Link
                    href="/customers/new"
                    className="flex items-center justify-center bg-foreground text-white p-2 border border-foreground hover:bg-white hover:text-foreground active:scale-[0.95] active:bg-zinc-800 transition-all"
                >
                    <Plus className="w-5 h-5" strokeWidth={1.5} />
                </Link>
            </div>

            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-3 h-4 w-4 text-muted" strokeWidth={1.5} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name..."
                            className="w-full bg-white border border-border rounded-none pl-11 pr-4 py-2.5 placeholder-muted focus:outline-none focus:border-foreground text-foreground transition-all font-light text-[13px] tracking-wide"
                        />
                    </div>
                    <button 
                        onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                        className={`p-2.5 border transition-colors flex items-center justify-center ${showFavoritesOnly ? 'bg-yellow-50 border-yellow-200 text-yellow-600' : 'bg-white border-border text-muted hover:text-foreground hover:border-foreground'}`}
                    >
                        <Star className="w-4 h-4" strokeWidth={1.5} fill={showFavoritesOnly ? "currentColor" : "none"} />
                    </button>
                </div>
                
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    <button 
                        onClick={() => setStageFilter('all')}
                        className={`px-4 py-1.5 text-[10px] uppercase tracking-widest whitespace-nowrap border transition-colors ${stageFilter === 'all' ? 'bg-foreground text-white border-foreground' : 'bg-white text-muted border-border hover:border-foreground'}`}
                    >
                        ALL
                    </button>
                    {Object.entries(stageLabels).map(([val, label]) => (
                        <button 
                            key={val}
                            onClick={() => setStageFilter(val)}
                            className={`px-4 py-1.5 text-[10px] uppercase tracking-widest whitespace-nowrap border transition-colors ${stageFilter === val ? 'bg-foreground text-white border-foreground' : 'bg-white text-muted border-border hover:border-foreground'}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {isLoading ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="w-6 h-6 animate-spin text-muted" />
                    </div>
                ) : customers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center border border-dashed border-border p-6">
                        <p className="text-[13px] font-light text-muted">まだ顧客データがありません。</p>
                        <Link href="/customers/new" className="text-[11px] uppercase tracking-widest bg-white border border-border px-4 py-2 hover:border-foreground transition-colors">
                            REGISTER NEW CLIENT
                        </Link>
                    </div>
                ) : (
                    filteredCustomers.map((c) => (
                        <CustomerCard
                            key={c.id}
                            id={c.id}
                            name={c.display_name}
                            stage={c.stage}
                            stageLabel={stageLabels[c.stage] || c.stage}
                            nextAction={c.danger_level === 'critical' ? '早急なフォローアップが必要です' : 'LINEで探りを入れる'}
                            dangerLevel={c.danger_level}
                            isFavorite={!!c.is_favorite}
                            onToggleFav={(e) => toggleFavoriteList(e, c.id, !!c.is_favorite)}
                        />
                    ))
                )}
            </div>
        </div>
    )
}

function CustomerCard({ id, name, stage, stageLabel, nextAction, dangerLevel, isFavorite, onToggleFav }: { id: string, name: string, stage: string, stageLabel: string, nextAction: string, dangerLevel: string, isFavorite: boolean, onToggleFav: (e: any) => void }) {
    const isCritical = dangerLevel === 'critical'
    const isCaution = dangerLevel === 'caution'

    const stageColors: Record<string, string> = {
        interest: 'bg-white text-muted border-border',
        build: 'bg-white text-foreground border-border',
        trust: 'bg-white text-foreground border-foreground',
        depend: 'bg-rose-50 text-rose-600 border-rose-200 font-medium',
        highvalue: 'bg-white text-foreground border-foreground font-bold'
    }

    return (
        <Link href={`/customers/${id}`} className="premium-card p-5 flex flex-col gap-5 relative overflow-hidden group hover:border-foreground transition-all cursor-pointer active:scale-[0.99] active:bg-zinc-50">
            {isCritical && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-rose-100/50 to-transparent pointer-events-none" />
            )}

            <div className="flex items-start justify-between">
                <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-normal text-foreground tracking-wide">{name}</h3>
                        <button onClick={onToggleFav} className="p-1 hover:bg-zinc-100 text-muted hover:text-yellow-500 transition-colors">
                            <Star className="w-4 h-4" strokeWidth={1.5} fill={isFavorite ? "currentColor" : "none"} color={isFavorite ? "#eab308" : "currentColor"} />
                        </button>
                    </div>
                    <span className={`text-[9px] font-normal px-3 py-1 border tracking-widest uppercase w-fit ${stageColors[stage] || stageColors.interest}`}>
                        {stageLabel}
                    </span>
                </div>

                <div className="flex flex-col gap-2 items-end">
                    {isCritical && (
                        <div className="flex items-center gap-1.5 bg-rose-50 px-2 py-1 text-rose-600 border border-rose-200">
                            <ShieldAlert className="w-3 h-3" strokeWidth={1.5} />
                            <span className="text-[8px] uppercase font-normal tracking-widest">CRITICAL</span>
                        </div>
                    )}
                    {isCaution && (
                        <div className="flex items-center gap-1.5 bg-white px-2 py-1 text-foreground border border-foreground">
                            <AlertTriangle className="w-3 h-3" strokeWidth={1.5} />
                            <span className="text-[8px] uppercase font-normal tracking-widest">CAUTION</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <span className="text-[8px] text-muted font-normal uppercase tracking-widest flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-foreground" strokeWidth={1.5} /> NEXT ACTION / 次のアクション                    </span>
                    <span className="text-xs text-foreground font-light tracking-wide line-clamp-1">{nextAction}</span>
                </div>
            </div>
        </Link>
    )
}

function AlertTriangle(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
        </svg>
    )
}
