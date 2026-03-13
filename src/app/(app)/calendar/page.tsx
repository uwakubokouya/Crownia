"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, X, Loader2 } from "lucide-react"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, parseISO } from "date-fns"
import { ja } from "date-fns/locale"
import { createBrowserClient } from '@supabase/ssr'

interface CalendarEvent {
    id: string
    title: string
    date: Date
    type: 'manual' | 'visit'
    amount?: number
}

export default function CalendarPage() {
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [events, setEvents] = useState<CalendarEvent[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newEventTitle, setNewEventTitle] = useState("")

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const fetchEvents = async () => {
        setIsLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            const userId = user?.id || 'd1b54ac6-2244-4860-9dc4-177b9dcca967' // Fallback for dev

            // Fetch manual events
            const { data: manualEvents, error: manualError } = await supabase
                .from('calendar_events')
                .select('*')
                .eq('user_id', userId)

            if (manualError && manualError.code !== '42P01') {
                console.error('Error fetching calendar events:', manualError)
            }

            // Fetch visit events
            const { data: visitEvents, error: visitError } = await supabase
                .from('events')
                .select('*, customers(display_name)')
                .eq('user_id', userId)
                .eq('type', 'visit')

            if (visitError) throw visitError

            const formattedEvents: CalendarEvent[] = []

            if (manualEvents) {
                manualEvents.forEach(e => {
                    formattedEvents.push({
                        id: e.id,
                        title: e.title,
                        date: parseISO(e.event_date),
                        type: 'manual'
                    })
                })
            }

            if (visitEvents) {
                visitEvents.forEach(e => {
                    const customerName = e.customers?.display_name || 'お客様'
                    formattedEvents.push({
                        id: e.id,
                        title: `${customerName} 来店`,
                        date: new Date(e.occurred_at),
                        type: 'visit',
                        amount: e.amount
                    })
                })
            }

            setEvents(formattedEvents)
        } catch (error) {
            console.error('Failed to fetch events:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchEvents()
    }, [currentMonth])

    const handleAddEvent = async () => {
        if (!newEventTitle.trim()) return

        try {
            const { data: { user } } = await supabase.auth.getUser()
            const userId = user?.id || 'd1b54ac6-2244-4860-9dc4-177b9dcca967'

            const formattedDate = format(selectedDate, 'yyyy-MM-dd')

            const { error } = await supabase
                .from('calendar_events')
                .insert({
                    user_id: userId,
                    title: newEventTitle.trim(),
                    event_date: formattedDate
                })

            if (error) throw error

            setNewEventTitle("")
            setIsModalOpen(false)
            fetchEvents() // refresh events
        } catch (error) {
            console.error('Failed to add event:', error)
            alert('予定の追加に失敗しました。マイグレーションが完了しているか確認してください。')
        }
    }

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
    const onDateClick = (day: Date) => setSelectedDate(day)

    const renderHeader = () => {
        return (
            <div className="flex items-center justify-between mb-6">
                <button onClick={prevMonth} className="p-2 hover:bg-zinc-100 transition-colors active:scale-95">
                    <ChevronLeft className="h-5 w-5 text-foreground" />
                </button>
                <h2 className="text-xl font-light tracking-widest text-foreground uppercase">
                    {format(currentMonth, "yyyy.MM")}
                </h2>
                <button onClick={nextMonth} className="p-2 hover:bg-zinc-100 transition-colors active:scale-95">
                    <ChevronRight className="h-5 w-5 text-foreground" />
                </button>
            </div>
        )
    }

    const renderDays = () => {
        const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
        return (
            <div className="grid grid-cols-7 mb-2">
                {days.map((day, i) => (
                    <div className="text-center text-[10px] tracking-widest text-muted font-normal" key={i}>
                        {day}
                    </div>
                ))}
            </div>
        )
    }

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth)
        const monthEnd = endOfMonth(monthStart)
        const startDate = startOfWeek(monthStart)
        const endDate = endOfWeek(monthEnd)

        const rows = []
        let days = []
        let day = startDate
        let formattedDate = ""

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, "d")
                const cloneDay = day

                const dayEvents = events.filter(e => isSameDay(e.date, day))
                
                const isSelected = isSameDay(day, selectedDate)
                const isCurrentMonth = isSameMonth(day, monthStart)

                days.push(
                    <div
                        className={`min-h-[80px] p-1 border-t border-r border-border relative cursor-pointer active:bg-zinc-50 transition-colors ${
                            !isCurrentMonth ? "text-muted/40 bg-zinc-50/50" : "text-foreground hover:bg-zinc-50"
                        } ${isSelected ? "bg-zinc-50" : ""} ${i === 0 ? "border-l" : ""} ${day >= endOfWeek(monthEnd) ? "border-b" : ""}`}
                        key={day.toString()}
                        onClick={() => onDateClick(cloneDay)}
                    >
                        <div className="flex justify-between items-start">
                            <span className={`text-[12px] font-light ${isSelected ? "w-5 h-5 flex items-center justify-center bg-foreground text-white rounded-full" : "w-5 h-5 flex items-center justify-center"}`}>{formattedDate}</span>
                            {dayEvents.length > 0 && <span className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1.5 mr-1" />}
                        </div>

                        <div className="flex flex-col gap-1 mt-1 px-0.5 overflow-hidden">
                            {dayEvents.slice(0, 3).map((e, idx) => (
                                <div key={idx} className={`text-[9px] truncate px-1 py-0.5 ${e.type === 'visit' ? 'bg-zinc-100 text-foreground' : 'bg-rose-50 text-rose-700'}`}>
                                    {e.title}
                                </div>
                            ))}
                            {dayEvents.length > 3 && (
                                <div className="text-[8px] text-muted text-center tracking-widest">+ {dayEvents.length - 3} MORE</div>
                            )}
                        </div>
                    </div>
                )
                day = addDays(day, 1)
            }
            rows.push(
                <div className="grid grid-cols-7" key={day.toString()}>
                    {days}
                </div>
            )
            days = []
        }
        return <div className="mb-8">{rows}</div>
    }

    const selectedDayEvents = events.filter(e => isSameDay(e.date, selectedDate))

    return (
        <div className="flex flex-col gap-4 p-6 pt-12 min-h-[100dvh] pb-24 bg-white relative">
            <div className="flex items-center gap-2 mb-2">
                <CalendarIcon className="w-5 h-5 text-foreground" strokeWidth={1.5} />
                <h1 className="text-2xl font-light tracking-wide text-foreground uppercase">Calendar</h1>
            </div>

            {renderHeader()}
            {renderDays()}
            {renderCells()}

            {/* Selected Date Details */}
            <div className="mt-4 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                    <h3 className="text-[13px] tracking-widest uppercase font-light text-foreground">
                        {format(selectedDate, 'yyyy.MM.dd', { locale: ja })} の予定
                    </h3>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-1 text-[10px] tracking-widest uppercase font-normal text-muted hover:text-foreground transition-colors"
                    >
                        <Plus className="w-3 h-3" /> 新規予定
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="w-6 h-6 animate-spin text-muted" />
                    </div>
                ) : selectedDayEvents.length === 0 ? (
                    <div className="text-center p-8 bg-zinc-50 border border-border">
                         <p className="text-[11px] text-muted tracking-wide font-light">予定はありません</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {selectedDayEvents.map(e => (
                            <div key={e.id} className={`p-4 border ${e.type === 'visit' ? 'border-border bg-white' : 'border-rose-200 bg-rose-50'} flex justify-between items-center`}>
                                <span className={`text-[13px] font-light ${e.type === 'visit' ? 'text-foreground' : 'text-rose-900'}`}>{e.title}</span>
                                {e.type === 'visit' && e.amount && (
                                    <span className="text-[11px] text-muted font-normal tracking-wide">¥{new Intl.NumberFormat('ja-JP').format(e.amount)}</span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Event Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                     <div className="bg-white w-full max-w-sm rounded-[1px] shadow-2xl overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-border flex items-center justify-between bg-zinc-50">
                            <h3 className="font-light tracking-widest text-[11px] uppercase">
                                ADD EVENT / 予定追加
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-muted hover:text-black">
                                <X className="w-5 h-5" strokeWidth={1.5} />
                            </button>
                        </div>
                        <div className="p-6 flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-normal tracking-widest uppercase text-muted">Date / 日付</label>
                                <div className="p-3 bg-zinc-50 border border-border text-[13px] font-light text-foreground text-center">
                                    {format(selectedDate, 'yyyy年MM月dd日 (E)', { locale: ja })}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-normal tracking-widest uppercase text-muted">Title / タイトル</label>
                                <input 
                                    type="text" 
                                    value={newEventTitle}
                                    onChange={(e) => setNewEventTitle(e.target.value)}
                                    placeholder="予定を入力してください..."
                                    className="w-full bg-white border border-border p-3 text-[13px] font-light text-foreground focus:outline-none focus:border-foreground transition-colors"
                                />
                            </div>
                            <button 
                                onClick={handleAddEvent}
                                disabled={!newEventTitle.trim()}
                                className="w-full bg-foreground text-white py-3 text-[11px] font-normal tracking-widest uppercase transition-all hover:bg-[#222] active:bg-black active:scale-[0.98] disabled:opacity-50"
                            >
                                追加する
                            </button>
                        </div>
                     </div>
                </div>
            )}
        </div>
    )
}
