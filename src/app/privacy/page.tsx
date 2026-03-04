import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
    return (
        <div className="flex flex-col min-h-[100dvh] bg-white pb-20">
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center justify-between">
                <Link href="/login" className="p-2 -ml-2 text-foreground hover:text-black transition-colors">
                    <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
                </Link>
                <span className="font-light tracking-widest text-[12px] uppercase text-foreground">Privacy Policy</span>
                <div className="w-9"></div>
            </header>

            <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto w-full pt-10">
                <h1 className="text-2xl font-light tracking-widest text-foreground uppercase mb-6 text-center">プライバシーポリシー</h1>

                <div className="text-[12px] text-foreground font-light leading-relaxed space-y-6">
                    <section>
                        <h2 className="text-[13px] font-normal tracking-widest uppercase mb-3">1. 個人情報の収集方法</h2>
                        <p>
                            当社は、ユーザーが利用登録をする際に氏名、生年月日、住所、電話番号、メールアドレス、銀行口座番号、クレジットカード番号、運転免許証番号などの個人情報をお尋ねすることがあります。LINEログインを利用される場合は、LINEアカウントの情報も連携されます。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[13px] font-normal tracking-widest uppercase mb-3">2. 個人情報を収集・利用する目的</h2>
                        <p>
                            当社が個人情報を収集・利用する目的は、以下のとおりです。<br />
                            ・本サービスの提供・運営のため<br />
                            ・ユーザーからのお問い合わせに回答するため（本人確認を行うことを含む）<br />
                            ・重要なお知らせなど必要に応じたご連絡のため
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[13px] font-normal tracking-widest uppercase mb-3">3. プライバシーポリシーの変更</h2>
                        <p>
                            本ポリシーの内容は、法令その他本ポリシーに別段の定めのある事項を除いて、ユーザーに通知することなく、変更することができるものとします。当社が別途定める場合を除いて、変更後のプライバシーポリシーは、本ウェブサイトに掲載したときから効力を生じるものとします。
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
