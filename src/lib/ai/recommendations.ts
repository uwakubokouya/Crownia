import { CustomerType } from './scoring'
import { CustomerStage } from './stage'

export type ActionCategory = 'attack' | 'growth' | 'defense'

export interface ActionCardDef {
    category: ActionCategory
    goal: string
    probability: number
    reason: string
    suggestedMessage: string
    suggestedTime: string
}

export function generateActionCards(type: CustomerType, stage: CustomerStage): ActionCardDef[] {
    const cards: ActionCardDef[] = []

    // 1. Attack (売上UP)
    let attackGoal = 'ボトルのオーダー打診'
    let attackReason = 'タイプごとのデフォルト攻め作戦'
    let attackMsg = 'もっと一緒に飲みたいな🥺'

    if (type === 'approval') {
        attackGoal = '高額ボトルのオーダー'
        attackReason = '承認欲求を高めるために「〇〇さんだけ」と特別感を煽ることで高額ボトルが期待できます。'
        attackMsg = '最近色んな人いるけど、やっぱり〇〇さんの席が一番落ち着くし頼りになるよ🥂'
    } else if (type === 'lonely') {
        attackGoal = '延長の打診'
        attackReason = '寂しさを埋めたいタイプなので、最後まで一緒にいてほしいと甘えることで延長率が高まります。'
        attackMsg = 'もう帰っちゃうの？もう少しだけ一緒にいてほしいな😢'
    } else if (type === 'control') {
        attackGoal = '同伴の打診'
        attackReason = '主導権を握りたいタイプ。お店の外でリードしてもらう形で同伴を誘うと乗り気になります。'
        attackMsg = '〇〇さんが言ってた美味しいお店、私まだ行ったことないから連れてってほしいな✨'
    }

    cards.push({
        category: 'attack',
        goal: attackGoal,
        probability: Math.floor(Math.random() * 20) + 60, // 60-80%
        reason: attackReason,
        suggestedMessage: attackMsg,
        suggestedTime: '21:00-22:00'
    })

    // 2. Growth (昇格)
    let growthGoal = '信頼関係の構築'
    let growthReason = '来店2回目に向けて、まずは趣味や日常の話で共感を生みます。'
    let growthMsg = '今日もお仕事お疲れ様！ゆっくり休んでね💤'

    if (stage === 'trust') {
        growthGoal = '依存段階への確約（本指名固定）'
        growthReason = '信頼段階にあるため、より深いプライベートの悩みなどを打ち明けることで特別感を出します。'
        growthMsg = '実は最近少し悩んでて…〇〇さんにだけは聞いてほしいから、次会った時少し話してもいい？'
    } else if (stage === 'depend') {
        growthGoal = '高単価顧客への育成'
        growthReason = 'すでに依存しているため、特別なイベントや記念日などを理由に大きな投資を促します。'
        growthMsg = '来月私のバースデーなんだけど、〇〇さんにお祝いしてもらえたら一番嬉しいな🌹'
    }

    cards.push({
        category: 'growth',
        goal: growthGoal,
        probability: Math.floor(Math.random() * 15) + 70, // 70-85%
        reason: growthReason,
        suggestedMessage: growthMsg,
        suggestedTime: '15:00-17:00'
    })

    // 3. Defense (維持・防衛)
    let defenseGoal = '失客防止のジャブ'
    let defenseReason = '定期的な連絡で忘れられないようにします。'
    let defenseMsg = '最近急に寒くなったけど体調崩してない？🥲'

    if (type === 'hobby') {
        defenseReason = '共通の趣味に関するニュースなどを送り、自然な口実で連絡を途絶えさせないようにします。'
        defenseMsg = '〇〇の新作発表されたね！見たらすぐ〇〇さんに教えなきゃって思ってLINEしちゃった🎮'
    } else if (type === 'status') {
        defenseReason = '相手の最近の活躍に関する質問などを織り交ぜて自尊心を満たしつつ繋ぎ止めます。'
        defenseMsg = '最近お仕事どう？〇〇さん忙しそうだから無理してないかたまに心配になるよ🥺'
    }

    cards.push({
        category: 'defense',
        goal: defenseGoal,
        probability: Math.floor(Math.random() * 10) + 85, // 85-95%
        reason: defenseReason,
        suggestedMessage: defenseMsg,
        suggestedTime: '19:00-20:00'
    })

    return cards
}
