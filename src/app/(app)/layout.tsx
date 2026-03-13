import { BottomNav } from '@/components/bottom-nav'
import { TutorialOverlay } from '@/components/tutorial-overlay'

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col h-[100dvh] bg-background text-foreground pb-[80px]">
            <main className="flex-1 overflow-y-auto w-full max-w-md mx-auto relative">
                {children}
            </main>
            <BottomNav />
            <TutorialOverlay />
        </div>
    )
}
