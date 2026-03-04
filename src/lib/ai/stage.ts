export type CustomerStage = 'interest' | 'build' | 'trust' | 'depend' | 'highvalue'

export interface StageHistoryInput {
    currentStage: CustomerStage
    visitCountTotal: number
    visitsLast60Days: number
    intervalsLast2Visits: [number, number] // [Current Interval, Previous Interval]
    paymentTrend: 'up' | 'flat' | 'down'
    hasBottleHistory: boolean
    isFastReplier: boolean
    paymentAvg: number
    isTop20PercentSales: boolean
}

export function evaluateStageTransition(input: StageHistoryInput): {
    shouldUpgrade: boolean,
    newStage?: CustomerStage,
    reason?: string
} {
    // 興味 (interest) -> 信頼 (trust) or 関係構築 (build) based on logic
    // Prompt definition:
    // 信頼への昇格（興味/関係構築→信頼）
    // - 来店3回以上
    // - 来店周期安定: 直近60日以内に2回来店以上, 直近2回来店間隔が20〜45日, 前回間隔との差が±14日以内
    // - 単価上昇傾向: payment平均が前回比で上昇 or 横ばい以上 (up or flat)
    if (input.currentStage === 'interest' || input.currentStage === 'build') {
        const isIntervalStable =
            input.intervalsLast2Visits[0] >= 20 && input.intervalsLast2Visits[0] <= 45 &&
            Math.abs(input.intervalsLast2Visits[0] - input.intervalsLast2Visits[1]) <= 14

        if (
            input.visitCountTotal >= 3 &&
            input.visitsLast60Days >= 2 &&
            isIntervalStable &&
            (input.paymentTrend === 'up' || input.paymentTrend === 'flat')
        ) {
            return {
                shouldUpgrade: true,
                newStage: 'trust',
                reason: '来店周期（20〜45日）が安定し、単価も維持・上昇傾向にあるため「信頼」段階へ昇格しました。'
            }
        }
    }

    // 依存への昇格（信頼→依存）
    // - 直近60日で3回来店以上
    // - ボトル履歴あり
    // - 即レス率が高い
    if (input.currentStage === 'trust') {
        if (
            input.visitsLast60Days >= 3 &&
            input.hasBottleHistory &&
            input.isFastReplier
        ) {
            return {
                shouldUpgrade: true,
                newStage: 'depend',
                reason: '高頻度（直近60日で3回）の来店とボトル履歴、高いLINE反応率により「依存」段階へ昇格しました。'
            }
        }
    }

    // 高単価への昇格（依存→高単価）
    // - 平均単価 >= 70,000円
    // - 月売上貢献 上位20%以内
    // - 直近60日で4回来店以上
    if (input.currentStage === 'depend') {
        if (
            input.paymentAvg >= 70000 &&
            input.isTop20PercentSales &&
            input.visitsLast60Days >= 4
        ) {
            return {
                shouldUpgrade: true,
                newStage: 'highvalue',
                reason: '平均単価7万円超えかつ店全体の売上上位層に組み込んだため、最上位の「高単価」段階へ昇格しました。'
            }
        }
    }

    return { shouldUpgrade: false }
}
