"use client"

import { ArrowLeft, HelpCircle, Mail, MessageSquare, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function SupportPage() {
    const faqs = [
        {
            q: "AI解析（LINEの分析）がエラーになります",
            a: "AIモデルの一時的な混雑や、通信エラーの可能性があります。「LINE解析」画面からもう一度解析をお試しいただくか、少し時間をおいてから再試行してください。"
        },
        {
            q: "「PGRST204」というエラーが出ます",
            a: "データベース上に必要なカラムが不足しているか、キャッシュが残っている場合に発生します。アップデート直後等に発生する場合は、ブラウザをリロードするか、サポートまでご連絡ください。"
        },
        {
            q: "お気に入り（星マーク）を押しても保存されません",
            a: "現在ご利用のデバイスまたはネットワークの接続状況をご確認ください。問題が解決しない場合、データベースの同期エラーの可能性があります。"
        },
        {
            q: "「現在の売上」が0円のまま変わりません",
            a: "当月の「来店履歴（Visit）」が正しく登録されているか確認してください。会計額（Amount）が0で登録されている場合は売上に反映されません。"
        },
        {
            q: "プラン（上限数）を変更・解約したいです",
            a: "設定（HOME > Settings）画面の「お支払い管理」メニューからStripeのポータルへ移動し、プランの変更やサブスクリプションの解約手続きを行えます。"
        }
    ]

    return (
        <div className="flex flex-col min-h-[100dvh] bg-white pb-20">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/settings" className="p-2 -ml-2 text-foreground hover:text-black transition-colors">
                        <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
                    </Link>
                    <h1 className="text-[13px] font-light tracking-widest uppercase">FAQ & Support</h1>
                </div>
                <HelpCircle className="w-5 h-5 text-muted" strokeWidth={1.5} />
            </header>

            <div className="flex flex-col gap-10 p-6">
                <div>
                    <h2 className="text-2xl font-light tracking-wide text-foreground uppercase mb-2">よくある質問・サポート</h2>
                    <p className="text-[11px] text-muted font-light tracking-widest leading-relaxed">
                        ご利用中の疑問点やトラブルシューティング、サポート窓口をご案内します。
                    </p>
                </div>

                {/* FAQ Section */}
                <section>
                    <h3 className="text-[10px] font-normal tracking-widest uppercase text-muted mb-4 flex items-center gap-2">
                        FAQ / よくある質問
                    </h3>
                    <div className="flex flex-col gap-3">
                        {faqs.map((faq, idx) => (
                            <FAQItem key={idx} question={faq.q} answer={faq.a} />
                        ))}
                    </div>
                </section>

                {/* Contact Section */}
                <section>
                    <h3 className="text-[10px] font-normal tracking-widest uppercase text-muted mb-4 flex items-center gap-2">
                        CONTACT / お問い合わせ
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                        <a href="mailto:support@crownia.com" className="premium-card p-5 bg-zinc-50 border border-border flex items-start gap-4 active:scale-[0.99] transition-all hover:border-black group">
                            <div className="p-3 bg-white border border-border group-hover:bg-foreground group-hover:text-white transition-colors">
                                <Mail className="w-5 h-5" strokeWidth={1.5} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[13px] font-normal tracking-widest text-foreground uppercase">Email Support</span>
                                <span className="text-[11px] font-light text-muted leading-relaxed">
                                    不具合の報告やアカウントに関するご相談はこちらから。通常24時間以内に返信いたします。
                                </span>
                            </div>
                        </a>
                        
                        <a href="#" className="premium-card p-5 bg-zinc-50 border border-border flex items-start gap-4 active:scale-[0.99] transition-all hover:border-black group">
                            <div className="p-3 bg-white border border-border group-hover:bg-foreground group-hover:text-white transition-colors">
                                <MessageSquare className="w-5 h-5" strokeWidth={1.5} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[13px] font-normal tracking-widest text-foreground uppercase">LINE Chat</span>
                                <span className="text-[11px] font-light text-muted leading-relaxed">
                                    操作の不明点に関する簡易的なご質問は、公式LINEチャットサポートが便利です。
                                </span>
                            </div>
                        </a>
                    </div>
                </section>

                {/* System Status (Mock) */}
                <section className="p-6 border border-border flex flex-col items-center justify-center text-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mb-3 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-[12px] font-normal tracking-wide text-foreground">All Systems Operational</span>
                    <span className="text-[9px] text-muted font-light tracking-widest uppercase mt-1">API & AI Models are running smoothly</span>
                </section>
            </div>
        </div>
    )
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="premium-card border border-border bg-white overflow-hidden transition-all">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-50 active:bg-zinc-100 transition-colors"
            >
                <span className={`text-[13px] font-light tracking-wide pr-4 ${isOpen ? 'text-foreground font-normal' : 'text-foreground'}`}>
                    Q. {question}
                </span>
                {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-muted shrink-0" strokeWidth={1.5} />
                ) : (
                    <ChevronDown className="w-4 h-4 text-muted shrink-0" strokeWidth={1.5} />
                )}
            </button>
            {isOpen && (
                <div className="p-4 pt-0 text-[12px] font-light text-muted leading-relaxed border-t border-zinc-100 bg-zinc-50/50 relative">
                    <span className="font-normal text-foreground absolute left-4 top-4">A.</span>
                    <span className="pl-6 block mt-4">{answer}</span>
                </div>
            )}
        </div>
    )
}
