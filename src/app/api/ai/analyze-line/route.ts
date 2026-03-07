import { NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { GoogleGenAI, Type, Schema } from '@google/genai'

export async function POST(request: Request) {
    try {
        const { customerId, chatHistory } = await request.json()

        if (!customerId || !chatHistory) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: 'Gemini APIキーが設定されていません。' }, { status: 500 })
        }

        const cookieStore = await cookies()

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        try {
                            cookieStore.set({ name, value, ...options })
                        } catch (error) {
                            // The `set` method was called from a Server Component.
                            // This can be ignored if you have middleware refreshing
                            // user sessions.
                        }
                    },
                    remove(name: string, options: CookieOptions) {
                        try {
                            cookieStore.set({ name, value: '', ...options })
                        } catch (error) {
                            // The `remove` method was called from a Server Component.
                            // This can be ignored if you have middleware refreshing
                            // user sessions.
                        }
                    },
                },
            }
        )

        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // --- Fetch Past Context ---
        const { data: pastSummaries, error: fetchError } = await supabase
            .from('conversation_summaries')
            .select('id, summary_text, created_at, inferred_features')
            .eq('customer_id', customerId)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5)

        if (fetchError) {
            console.error('Failed to fetch past summaries:', fetchError)
        }

        const reversedSummaries = (pastSummaries || []).reverse()
        const contextText = reversedSummaries.length > 0
            ? reversedSummaries.map((s: any) => `[${new Date(s.created_at).toLocaleDateString('ja-JP')}]\n${s.summary_text}`).join('\n\n')
            : '過去の会話サマリはありません。（これが初回の分析です）'

        // --- Gemini AI Processing ---
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

        const schema: Schema = {
            type: Type.OBJECT,
            properties: {
                type: {
                    type: Type.STRING,
                    description: "顧客の分類タイプ。以下のいずれか: 'approval'(承認欲求型), 'lonely'(寂しがり屋型), 'control'(支配型), 'hobby'(趣味特化型), 'status'(ステータス誇示型)"
                },
                stage: {
                    type: Type.STRING,
                    description: "関係性の段階。以下のいずれか: 'interest', 'build', 'trust', 'depend', 'highvalue'"
                },
                dangerLevel: {
                    type: Type.STRING,
                    description: "失客の危険度。以下のいずれか: 'safe', 'caution', 'danger', 'critical'"
                },
                confidence: {
                    type: Type.INTEGER,
                    description: "分析結果の信頼度（0〜100）"
                },
                summaryText: {
                    type: Type.STRING,
                    description: "このLINEトークの会話内容の要約（キャバ嬢の業務に役立つ簡潔なメモ形式）"
                },
                recommendations: {
                    type: Type.ARRAY,
                    description: "顧客との関係性を発展・維持するための3つの具体的な戦略アクション（attack, growth, defense の3種類を1つずつ必ず含めること）",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            category: { type: Type.STRING, description: "'attack' (攻め・売上UP), 'growth' (成長・関係構築), 'defense' (防御・維持) のいずれか" },
                            goal: { type: Type.STRING, description: "この戦略の短期的な目標（例：ボトルのオーダー打診、同伴の確約など）" },
                            probability: { type: Type.INTEGER, description: "このアクションの成功予測確率（0〜100）" },
                            reason: { type: Type.STRING, description: "なぜこのアクションが今のこの顧客に有効なのか、会話の文脈を踏まえた具体的な理由" },
                            suggestedMessage: { type: Type.STRING, description: "具体的にLINEで送るべき推奨メッセージのテキスト（キャバ嬢らしい自然で魅力的な口調で。文中に『明日』など具体的な日付は入れないこと）" },
                            suggestedTime: { type: Type.STRING, description: "このメッセージを送信するのに最適な推奨時間帯（例: 'ASAP', '夕方', '仕事終わり', '夜間', '休日の昼間' など。※『明日の15時』のような特定の日付や時間は絶対に入力せず、時間帯の目安のみにしてください）" }
                        },
                        required: ["category", "goal", "probability", "reason", "suggestedMessage", "suggestedTime"]
                    }
                },
                priorityCategory: {
                    type: Type.STRING,
                    description: "生成した3つの戦略（attack, growth, defense）の中で、現在の顧客状況から判断して『今最も優先して実行すべき重要な戦略』のカテゴリ名を1つ指定してください。"
                },
                nextAction: {
                    type: Type.STRING,
                    description: "次に取るべき具体的な行動（NEXT ACTION）を、キャバ嬢向けの簡潔な1〜2文のアドバイスとして記述してください。会話の文脈に沿ったオリジナルな文章を生成してください。（※『明日』や特定の日時は書かないこと）"
                }
            },
            required: ["type", "stage", "dangerLevel", "confidence", "summaryText", "recommendations", "priorityCategory", "nextAction"]
        };

        const promptText = `
あなたは高級キャバクラの専属AIコンサルタントです。
以下のLINEのトーク履歴を分析し、顧客のプロファイリング（タイプ、現在の関係性ステージ、失客危険度）を行ってください。

【分析ルール】
1. 顧客タイプ (type)
- approval (承認欲求型): 高い頻度で絵文字/スタンプを使用。プレゼントや自慢話が多く、褒められることを好む。
- lonely (寂しがり屋型): 「寂しい」「会いたい」などの発言が多い。夜中・早朝の連絡や、長文が多い。
- control (支配型): 質問が多い。店を決めたり、リードしたがる。「俺が教える」といった発言。
- hobby (趣味特化型): 特定の趣味（ゴルフ、車、ゲームなど）の話題が中心。
- status (ステータス誇示型): IT、経営者など職業の自慢、お金の話、高級品の話が多い。

2. 関係ステージ (stage)
- interest: 連絡先交換直後〜1回来店。当たり障りのない会話。
- build: 1〜2回来店。相手の趣味や仕事などの探り合い。
- trust: 安定した来店。プライベートの悩みなどを話し始めている。
- depend: 完全に依存している。キャバ嬢を一番の理解者として扱っている。
- highvalue: 高単価な特別イベント（同伴・バースデー・高級ボトル）の話題が出ている。

3. 危険度 (dangerLevel)
- safe: 特に問題なし。
- caution: 少し返信が遅い、または冷たい。
- danger: 明らかに不満がある、または競合店の女の子の影がある。
- critical: 激怒している、または長期間音信不通になりそう。

【過去の会話サマリ履歴（古い順）】
${contextText}

【今回の新しいトーク履歴】
${chatHistory}

※過去のサマリ履歴での文脈を踏まえた上で、**現在の最新の状態**としてプロファイリングを行ってください。
今回の会話内容の要約 (summaryText) も、過去の文脈からどう変化・進展したかが分かるように記述してください。

【戦略と推奨メッセージの生成 (recommendations)】
過去の文脈と今回の最新のやり取りを深く分析し、以下の3つのカテゴリごとに具体的かつパーソナライズされた戦略を1つずつ（計3つ）生成してください。
共通化されたようなテンプレート文章は絶対に避け、**直近の話題や相手の言葉遣い（方言や口癖、仕事の内容など）に直接触れる、血の通ったオリジナルなメッセージング**を行ってください。

【★重要ルール（厳守）★】
- ユーザーがいつこのLINEを送信するかは未定のため、推奨メッセージ(suggestedMessage) や NEXT ACTION (nextAction) の文章中には「明日」「今日の夕方」「15時」などの具体的な日付や時刻を**絶対に含めない**でください。
- 代わりに、最適な送信タイミングの目安（例: ASAP, 夕方, 仕事終わり, 夜間など）は \`suggestedTime\` フィールドに「時間帯の目安」として出力してください。

1. attack (攻め): 売上UP、来店やボトルの打診など、積極的な営業アクション。
2. growth (成長): 相手との信頼関係を深めるための、共感やプライベートな相談などのアクション。
3. defense (防御): 相手の熱量を冷まさないため、または他店への浮気を防ぐための繋ぎ止めアクション。
`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: promptText,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: 0.2, // Low temperature for consistent classification
            }
        });

        const rawJsonText = response.text;
        if (!rawJsonText) {
            throw new Error("Gemini API failed to return text.")
        }

        const aiResult = JSON.parse(rawJsonText);

        // Extract last message
        const lines = chatHistory.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0);
        let lastMessage = '会話履歴なし';
        if (lines.length > 0) {
            lastMessage = lines[lines.length - 1];
        }

        // --- Database Updates ---
        // 1. Update customer profile
        const { error: customerError } = await supabase
            .from('customers')
            .update({
                current_type: aiResult.type,
                current_type_confidence: aiResult.confidence,
                stage: aiResult.stage,
                danger_level: aiResult.dangerLevel
            })
            .eq('id', customerId)
            .eq('user_id', user.id);

        if (customerError) throw customerError;

        // 2. Clear old recommendations so they regenerate
        const { error: deleteRecError } = await supabase
            .from('ai_recommendations')
            .delete()
            .eq('customer_id', customerId)
            .eq('user_id', user.id);

        if (deleteRecError) {
            console.error("Failed to delete old recommendations:", deleteRecError)
        }

        // 3. Insert new dynamic recommendations
        if (aiResult.recommendations && Array.isArray(aiResult.recommendations)) {
            const newCards = aiResult.recommendations.map((c: any) => ({
                user_id: user.id,
                customer_id: customerId,
                category: c.category,
                goal: c.goal,
                probability: c.probability,
                reason_lines: [c.reason],
                suggested_message_text: c.suggestedMessage,
                suggested_send_time_window: c.suggestedTime
            }))

            const { error: insertRecError } = await supabase
                .from('ai_recommendations')
                .insert(newCards)

            if (insertRecError) {
                console.error("Failed to insert new recommendations:", insertRecError)
            }
        }

        // 4. Insert raw message to messages table
        const { error: messageError } = await supabase
            .from('messages')
            .insert({
                user_id: user.id,
                customer_id: customerId,
                message_text: chatHistory,
            });

        if (messageError) {
            console.error("Failed to insert raw message:", messageError)
        }

        // 4. Insert specific conversation summary
        const priorityRec = aiResult.recommendations?.find((r: any) => r.category === aiResult.priorityCategory);
        const inferredFeaturesJSON = {
            last_message: lastMessage,
            priority_category: aiResult.priorityCategory,
            next_action: aiResult.nextAction,
            recommended_time: priorityRec?.suggestedTime || 'ASAP'
        };

        const { error: summaryError } = await supabase
            .from('conversation_summaries')
            .insert({
                user_id: user.id,
                customer_id: customerId,
                summary_text: aiResult.summaryText,
                inferred_features: inferredFeaturesJSON,
                is_user_consented_raw: true // User consented to save raw data
            });

        if (summaryError) {
            console.error("Failed to insert conversation summary:", summaryError)
        }

        return NextResponse.json({
            success: true,
            result: {
                ...aiResult,
                lastMessage
            }
        })

    } catch (error: any) {
        console.error('AI Analysis Error:', error)
        return NextResponse.json({ error: error.message || 'Failed to analyze conversation' }, { status: 500 })
    }
}
