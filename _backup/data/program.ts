// 100 Pushups Program Data
// Based on hundredpushups.com

export interface DayWorkout {
    sets: number[];
    lastSetMax: boolean;
}

export interface ProgramDay {
    day: number;
    columns: {
        column1: DayWorkout;
        column2: DayWorkout;
        column3: DayWorkout;
    };
}

export interface WeeklyGoal {
    column1: number;
    column2: number;
    column3: number;
}

export interface ProgramWeek {
    week: number;
    restBetweenSets: number; // seconds
    days: ProgramDay[];
    singleSetTarget: WeeklyGoal; // Target for single-set max this week
}

// Weekly single-set targets to progressively reach 100
// These represent the minimum expected MAX set performance per week
export const WEEKLY_SINGLE_SET_TARGETS: WeeklyGoal[] = [
    { column1: 5, column2: 10, column3: 15 },    // Week 1
    { column1: 8, column2: 15, column3: 20 },    // Week 2
    { column1: 12, column2: 20, column3: 30 },   // Week 3
    { column1: 18, column2: 30, column3: 45 },   // Week 4
    { column1: 25, column2: 40, column3: 60 },   // Week 5
    { column1: 35, column2: 55, column3: 80 },   // Week 6 (prepare for 100)
];


export const PROGRAM_DATA: ProgramWeek[] = [
    // Week 1
    {
        week: 1,
        restBetweenSets: 60,
        singleSetTarget: { column1: 5, column2: 10, column3: 15 },
        days: [
            {
                day: 1,
                columns: {
                    column1: { sets: [2, 3, 2, 2], lastSetMax: true },
                    column2: { sets: [6, 6, 4, 4], lastSetMax: true },
                    column3: { sets: [10, 12, 7, 7], lastSetMax: true },
                },
            },
            {
                day: 2,
                columns: {
                    column1: { sets: [3, 4, 2, 3], lastSetMax: true },
                    column2: { sets: [6, 8, 6, 6], lastSetMax: true },
                    column3: { sets: [10, 12, 8, 8], lastSetMax: true },
                },
            },
            {
                day: 3,
                columns: {
                    column1: { sets: [4, 5, 4, 4], lastSetMax: true },
                    column2: { sets: [8, 10, 7, 7], lastSetMax: true },
                    column3: { sets: [11, 15, 9, 9], lastSetMax: true },
                },
            },
        ],
    },
    // Week 2
    {
        week: 2,
        restBetweenSets: 90,
        singleSetTarget: { column1: 8, column2: 15, column3: 20 },
        days: [
            {
                day: 1,
                columns: {
                    column1: { sets: [4, 6, 4, 4], lastSetMax: true },
                    column2: { sets: [9, 11, 8, 8], lastSetMax: true },
                    column3: { sets: [14, 14, 10, 10], lastSetMax: true },
                },
            },
            {
                day: 2,
                columns: {
                    column1: { sets: [5, 6, 4, 4], lastSetMax: true },
                    column2: { sets: [10, 12, 9, 9], lastSetMax: true },
                    column3: { sets: [14, 16, 12, 12], lastSetMax: true },
                },
            },
            {
                day: 3,
                columns: {
                    column1: { sets: [5, 7, 5, 5], lastSetMax: true },
                    column2: { sets: [12, 13, 10, 10], lastSetMax: true },
                    column3: { sets: [16, 17, 14, 14], lastSetMax: true },
                },
            },
        ],
    },
    // Week 3
    {
        week: 3,
        restBetweenSets: 120,
        singleSetTarget: { column1: 12, column2: 20, column3: 30 },
        days: [
            {
                day: 1,
                columns: {
                    column1: { sets: [10, 12, 7, 7], lastSetMax: true },
                    column2: { sets: [12, 17, 13, 13], lastSetMax: true },
                    column3: { sets: [14, 18, 14, 14], lastSetMax: true },
                },
            },
            {
                day: 2,
                columns: {
                    column1: { sets: [10, 12, 8, 8], lastSetMax: true },
                    column2: { sets: [14, 19, 14, 14], lastSetMax: true },
                    column3: { sets: [20, 25, 15, 15], lastSetMax: true },
                },
            },
            {
                day: 3,
                columns: {
                    column1: { sets: [11, 13, 9, 9], lastSetMax: true },
                    column2: { sets: [16, 21, 15, 15], lastSetMax: true },
                    column3: { sets: [22, 30, 20, 20], lastSetMax: true },
                },
            },
        ],
    },
    // Week 4
    {
        week: 4,
        restBetweenSets: 120,
        singleSetTarget: { column1: 18, column2: 30, column3: 45 },
        days: [
            {
                day: 1,
                columns: {
                    column1: { sets: [12, 14, 11, 10], lastSetMax: true },
                    column2: { sets: [18, 22, 16, 16], lastSetMax: true },
                    column3: { sets: [21, 25, 21, 21], lastSetMax: true },
                },
            },
            {
                day: 2,
                columns: {
                    column1: { sets: [14, 16, 12, 12], lastSetMax: true },
                    column2: { sets: [20, 25, 20, 20], lastSetMax: true },
                    column3: { sets: [25, 29, 25, 25], lastSetMax: true },
                },
            },
            {
                day: 3,
                columns: {
                    column1: { sets: [16, 18, 13, 13], lastSetMax: true },
                    column2: { sets: [23, 28, 23, 23], lastSetMax: true },
                    column3: { sets: [29, 33, 29, 29], lastSetMax: true },
                },
            },
        ],
    },
    // Week 5
    {
        week: 5,
        restBetweenSets: 120,
        singleSetTarget: { column1: 25, column2: 40, column3: 60 },
        days: [
            {
                day: 1,
                columns: {
                    column1: { sets: [17, 19, 15, 15], lastSetMax: true },
                    column2: { sets: [28, 35, 25, 22], lastSetMax: true },
                    column3: { sets: [36, 40, 30, 24], lastSetMax: true },
                },
            },
            {
                day: 2,
                columns: {
                    column1: { sets: [10, 10, 13, 13, 10, 10, 9], lastSetMax: true },
                    column2: { sets: [18, 18, 20, 20, 14, 14, 16], lastSetMax: true },
                    column3: { sets: [19, 19, 22, 22, 18, 18, 22], lastSetMax: true },
                },
            },
            {
                day: 3,
                columns: {
                    column1: { sets: [13, 13, 15, 15, 12, 12, 10], lastSetMax: true },
                    column2: { sets: [18, 18, 20, 20, 17, 17, 20], lastSetMax: true },
                    column3: { sets: [20, 20, 24, 24, 20, 20, 22], lastSetMax: true },
                },
            },
        ],
    },
    // Week 6
    {
        week: 6,
        restBetweenSets: 120,
        singleSetTarget: { column1: 35, column2: 55, column3: 80 },
        days: [
            {
                day: 1,
                columns: {
                    column1: { sets: [25, 30, 20, 15], lastSetMax: true },
                    column2: { sets: [40, 50, 25, 25], lastSetMax: true },
                    column3: { sets: [45, 55, 35, 30], lastSetMax: true },
                },
            },
            {
                day: 2,
                columns: {
                    column1: { sets: [14, 14, 15, 15, 14, 14, 10, 10], lastSetMax: true },
                    column2: { sets: [20, 20, 23, 23, 20, 20, 18, 18], lastSetMax: true },
                    column3: { sets: [22, 22, 30, 30, 24, 24, 18, 18], lastSetMax: true },
                },
            },
            {
                day: 3,
                columns: {
                    column1: { sets: [13, 13, 17, 17, 16, 16, 14, 14], lastSetMax: true },
                    column2: { sets: [22, 22, 30, 30, 25, 25, 18, 18], lastSetMax: true },
                    column3: { sets: [26, 26, 33, 33, 26, 26, 22, 22], lastSetMax: true },
                },
            },
        ],
    },
];
