import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
    return (
        <div className="flex flex-col min-h-[100dvh] bg-white pb-20">
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center justify-between">
                <Link href="/login" className="p-2 -ml-2 text-foreground hover:text-black transition-colors">
                    <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
                </Link>
                <span className="font-light tracking-widest text-[12px] uppercase text-foreground">Terms of Service</span>
                <div className="w-9"></div>
            </header>

            <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto w-full pt-10">
                <h1 className="text-2xl font-light tracking-widest text-foreground uppercase mb-6 text-center">利用規約</h1>

                <div className="text-[12px] text-foreground font-light leading-relaxed space-y-6">
                    <section>
                        <h2 className="text-[13px] font-normal tracking-widest uppercase mb-3">1. はじめに</h2>
                        <p>
                            本利用規約（以下「本規約」といいます）は、Crownia（以下「本サービス」といいます）の提供条件および本サービスの利用者（以下「ユーザー」といいます）と運営者との間の権利義務関係を定めるものです。本サービスの利用に際しては、本規約の全文をお読みいただいたうえで、本規約に同意いただく必要があります。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[13px] font-normal tracking-widest uppercase mb-3">2. 料金および支払方法</h2>
                        <p>
                            ユーザーは、本サービスの有料プランを利用する場合、別途定める利用料金を、当社が指定する方法により支払うものとします。遅延損害金等についても別途定めます。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[13px] font-normal tracking-widest uppercase mb-3">3. 禁止事項</h2>
                        <p>
                            ユーザーは、本サービスの利用にあたり、以下の各号のいずれかに該当する行為または該当すると運営者が判断する行為をしてはなりません。<br />
                            (1) 法令に違反する行為または犯罪行為に関連する行為<br />
                            (2) 当社、本サービスの他の利用者またはその他の第三者に対する詐欺または脅迫行為<br />
                            (3) 公序良俗に反する行為<br />
                            (4) 本サービスのネットワークまたはシステム等に過度な負荷をかける行為
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[13px] font-normal tracking-widest uppercase mb-3">4. 免責事項</h2>
                        <p>
                            運営者は、本サービスがユーザーの特定の目的に適合すること、期待する機能・商品的価値・正確性・有用性を有すること等を明示的にも黙示的にも保証しません。
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
