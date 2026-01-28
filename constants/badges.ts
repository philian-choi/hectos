export type BadgeId =
    | 'first_step'
    | 'on_fire_3'
    | 'on_fire_7'
    | 'on_fire_30'
    | 'reps_100'
    | 'reps_500'
    | 'reps_1000'
    | 'week_1'
    | 'week_6'
    | 'program_master';

export interface Badge {
    id: BadgeId;
    title: string;
    description: string;
    icon: string; // Emoji for now, can be image later
    condition: (stats: UserStats) => boolean;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface UserStats {
    totalPushups: number;
    streak: number;
    currentWeek: number;
    completedSessions: number;
    isProgramComplete: boolean;
}

export const BADGES: Badge[] = [
    {
        id: 'first_step',
        title: '첫 걸음',
        description: '첫 번째 운동 완료',
        icon: '👟',
        condition: (stats) => stats.completedSessions >= 1,
        tier: 'bronze'
    },
    {
        id: 'week_1',
        title: '작심삼일 탈출',
        description: '1주차 훈련 완료',
        icon: '🌱',
        condition: (stats) => stats.currentWeek > 1,
        tier: 'bronze'
    },
    {
        id: 'on_fire_3',
        title: '폼 미쳤다',
        description: '3일 연속 운동',
        icon: '🔥',
        condition: (stats) => stats.streak >= 3,
        tier: 'silver'
    },
    {
        id: 'week_6',
        title: '끈기의 화신',
        description: '6주 프로그램 완주',
        icon: '🏆',
        condition: (stats) => stats.isProgramComplete,
        tier: 'platinum'
    },
    {
        id: 'reps_100',
        title: '백 개 돌파',
        description: '누적 푸쉬업 100개',
        icon: '💯',
        condition: (stats) => stats.totalPushups >= 100,
        tier: 'silver'
    },
    {
        id: 'reps_1000',
        title: '푸쉬업 마스터',
        description: '누적 푸쉬업 1,000개',
        icon: '👑',
        condition: (stats) => stats.totalPushups >= 1000,
        tier: 'gold'
    }
];

export const getEarnedBadges = (stats: UserStats): BadgeId[] => {
    return BADGES.filter(badge => badge.condition(stats)).map(b => b.id);
};
