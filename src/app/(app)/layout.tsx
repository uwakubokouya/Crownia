import { BottomNav } from '@/components/bottom-nav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col h-[100dvh] bg-rose-50/50 text-stone-800 pb-[80px]">
            <main className="flex-1 overflow-y-auto w-full max-w-md mx-auto relative">
                {children}
            </main>
            <BottomNav />
        </div>
    )
}
