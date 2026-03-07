export interface PriorityScoreCustomer {
    id: string;
    display_name: string;
    stage: string;
    danger_level?: string;
    current_type?: string;
    last_visit_date?: string;
    visit_count?: number;
    // For joining data
    next_action?: string;
    priority_category?: string;
    action_goal?: string;
    action_time?: string;
    recommended_time?: string;
}

export interface PriorityConfig {
    stageScores: {
        interest: number;
        build: number;
        trust: number;
        depend: number;
        highvalue: number;
    };
    dangerScores: {
        safe: number;
        caution: number;
        danger: number;
        critical: number;
    };
    visitMultiplier: number;
    visitMaxBonus: number;
    recencyScores: {
        recentDays: number; // <= N days
        recentBonus: number;
        awayDays: number; // >= N days
        awayBonus: number;
        churnDays: number; // >= N days
        churnBonus: number;
    };
}

export const defaultPriorityConfig: PriorityConfig = {
    stageScores: {
        interest: 10,
        build: 20,
        trust: 30,
        depend: 40,
        highvalue: 50
    },
    dangerScores: {
        safe: 0,
        caution: 20,
        danger: 80,
        critical: 120
    },
    visitMultiplier: 5,
    visitMaxBonus: 50,
    recencyScores: {
        recentDays: 3,
        recentBonus: 40,
        awayDays: 30,
        awayBonus: 50,
        churnDays: 90,
        churnBonus: 30
    }
};

export function calculateCustomerPriorityScore(customer: PriorityScoreCustomer, config: PriorityConfig = defaultPriorityConfig): number {
    let score = 0;

    // 1. Stage Score
    score += config.stageScores[customer.stage as keyof typeof config.stageScores] || 0;

    // 2. Danger Level Score (Critical priority)
    if (customer.danger_level) {
        score += config.dangerScores[customer.danger_level as keyof typeof config.dangerScores] || 0;
    }

    // 3. Visit Count Bonus
    const visits = customer.visit_count || 0;
    score += Math.min(visits * config.visitMultiplier, config.visitMaxBonus);

    // 4. Last Visit Recency Score
    if (customer.last_visit_date) {
        const lastVisitDate = new Date(customer.last_visit_date);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - lastVisitDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= config.recencyScores.recentDays) {
            score += config.recencyScores.recentBonus;
        } else if (diffDays >= config.recencyScores.awayDays && diffDays < config.recencyScores.churnDays) {
            score += config.recencyScores.awayBonus;
        } else if (diffDays >= config.recencyScores.churnDays) {
            score += config.recencyScores.churnBonus;
        }
    }

    return score;
}
