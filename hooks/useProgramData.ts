import { useUserStore } from "@/stores/useUserStore";
import { PROGRAM_DATA, DayWorkout } from "@/data/program";

export function useProgramData() {
    const { currentWeek, currentDay, currentColumn } = useUserStore();

    const totalWeeks = 6;
    const totalDays = 3;

    const getTodayWorkout = (): DayWorkout | null => {
        const week = PROGRAM_DATA.find((w) => w.week === currentWeek);
        if (!week) return null;

        const day = week.days.find((d) => d.day === currentDay);
        if (!day) return null;

        const columnKey = `column${currentColumn}` as keyof typeof day.columns;
        return day.columns[columnKey];
    };

    const getRestTime = (): number => {
        const week = PROGRAM_DATA.find((w) => w.week === currentWeek);
        return week?.restBetweenSets ?? 60;
    };

    return {
        todayWorkout: getTodayWorkout(),
        restTime: getRestTime(),
        totalWeeks,
        totalDays,
        programData: PROGRAM_DATA,
    };
}
