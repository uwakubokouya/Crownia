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
                humanNature: {
                    type: Type.STRING,
                    description: "プロの視点で分析したこの顧客の人間性・本質的な特徴。表面的な会話内容ではなく、会話の行間から読み取れる性格、価値観、キャバクラに求めているものなどを2〜3文で鋭く記述してください。"
                }
            },
            required: ["type", "stage", "dangerLevel", "confidence", "humanNature"]
        };

        const promptText = `
あなたは高級キャバクラの専属AIコンサルタントです。
以下のLINEのトーク履歴を分析し、顧客のプロファイリング（タイプ、現在の関係性ステージ、失客危険度）**のみ**を行ってください。

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
プロの目線から深く推察した顧客の人間性・本質 (humanNature) を必ず生成してください。
今回は戦略やアクションの提案は不要です。純粋な「性格・人間性分析」のみに集中してください。
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

        // 2. We DO NOT touch ai_recommendations or messages here.
        // This is purely for character analysis, so we only update the summary's inferred_features.
        // Let's find the latest summary and update it.
        const { data: latestSummary } = await supabase
            .from('conversation_summaries')
            .select('id, inferred_features')
            .eq('customer_id', customerId)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        if (latestSummary) {
            const updatedFeatures = {
                ...(latestSummary.inferred_features || {}),
                human_nature: aiResult.humanNature
            }

            const { error: summaryError } = await supabase
                .from('conversation_summaries')
                .update({ inferred_features: updatedFeatures })
                .eq('id', latestSummary.id)

            if (summaryError) {
                console.error("Failed to update conversation summary with human nature:", summaryError)
            }
        } else {
            // First time analysis, just create a basic wrapper
             const { error: summaryError } = await supabase
                .from('conversation_summaries')
                .insert({
                    user_id: user.id,
                    customer_id: customerId,
                    summary_text: "（性格分析のみのデータ）",
                    inferred_features: { human_nature: aiResult.humanNature },
                    is_user_consented_raw: true 
                });
             if (summaryError) console.error(summaryError);
        }

        return NextResponse.json({
            success: true,
            result: {
                ...aiResult
            }
        })

    } catch (error: any) {
        console.error('AI Analysis Error:', error)
        const errorMessage = error.message || 'Failed to analyze conversation'
        return NextResponse.json({ error: errorMessage, details: String(error) }, { status: 500 })
    }
}
