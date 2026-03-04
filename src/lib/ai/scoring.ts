export type CustomerType = 'approval' | 'lonely' | 'control' | 'hobby' | 'status'

interface ScoringInput {
    visitIntervalDays: number;
    emojiFrequency: number;     // 0-100
    sentenceLengthAvg: number;  // 0-100
    questionFrequency: number;  // 0-100
    replyTimeMins: number;      // 0-1440
    notesKeywords: string[];    // Extracted keywords
    paymentAvg: number;
}

export function predictCustomerType(input: ScoringInput): { type: CustomerType, confidence: number, secondBest: CustomerType } {
    const scores: Record<CustomerType, number> = {
        approval: 0,
        lonely: 0,
        control: 0,
        hobby: 0,
        status: 0,
    }

    // 1. Visit Interval
    if (input.visitIntervalDays < 7) {
        scores.lonely += 20
        scores.control += 10
    } else if (input.visitIntervalDays > 30) {
        scores.hobby += 20
        scores.status += 10
    }

    // 2. LINE Features
    if (input.emojiFrequency > 70) {
        scores.lonely += 15
        scores.approval += 15
    }
    if (input.sentenceLengthAvg > 50) {
        scores.control += 15
        scores.approval += 10
    }
    if (input.questionFrequency > 60) {
        scores.control += 20
        scores.lonely += 10
    }

    // 3. Reply Time
    if (input.replyTimeMins < 10) {
        scores.lonely += 25
        scores.control += 15
    } else if (input.replyTimeMins > 120) {
        scores.status += 15
        scores.hobby += 15
    }

    // 4. Notes Keywords
    if (input.notesKeywords.includes('自慢') || input.notesKeywords.includes('すごい')) {
        scores.approval += 30
        scores.status += 20
    }
    if (input.notesKeywords.includes('寂しい') || input.notesKeywords.includes('会いたい')) {
        scores.lonely += 30
    }
    if (input.notesKeywords.includes('趣味') || input.notesKeywords.includes('ゲーム')) {
        scores.hobby += 30
    }
    if (input.notesKeywords.includes('俺が') || input.notesKeywords.includes('教える')) {
        scores.control += 30
    }
    if (input.notesKeywords.includes('金の話') || input.notesKeywords.includes('社長')) {
        scores.status += 30
        scores.approval += 10
    }

    // 5. Payment Average
    if (input.paymentAvg > 100000) {
        scores.status += 25
        scores.approval += 15
    } else if (input.paymentAvg < 15000) {
        scores.lonely += 10
        scores.hobby += 10
    }

    // Add random variance for realism if scores are zero
    const totalRaw = Object.values(scores).reduce((a, b) => a + b, 0)
    if (totalRaw === 0) {
        scores.approval += 10
        scores.lonely += 5
    }

    // Calculate sorted scores
    const totalScore = Object.values(scores).reduce((sum, val) => sum + val, 0)
    const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a)

    const top = sorted[0]
    const second = sorted[1]

    const confidence = Math.round((top[1] / totalScore) * 100)

    return {
        type: top[0] as CustomerType,
        confidence,
        secondBest: second[0] as CustomerType
    }
}

export type DangerLevel = 'safe' | 'caution' | 'danger' | 'critical'

export function calculateDangerLevel(daysSinceLastVisit: number, usualIntervalDays: number, replyReactionDropped: boolean): DangerLevel {
    let score = 0

    if (daysSinceLastVisit > usualIntervalDays * 1.5) score += 30
    if (daysSinceLastVisit > usualIntervalDays * 2) score += 30
    if (replyReactionDropped) score += 40

    if (score >= 80) return 'critical'
    if (score >= 50) return 'danger'
    if (score >= 30) return 'caution'
    return 'safe'
}
