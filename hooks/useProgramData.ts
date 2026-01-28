import { useUserStore } from "@/stores/useUserStore";
import { PROGRAM_DATA, DayWorkout, ProgramWeek, ProgramDay } from "../data/program";

export function useProgramData() {
    const { currentWeek, currentDay, currentColumn } = useUserStore();

    const totalWeeks = 6;
    const totalDays = 3;

    const getTodayWorkout = (): DayWorkout | null => {
        const week = PROGRAM_DATA.find((w: ProgramWeek) => w.week === currentWeek);
        if (!week) return null;

        const day = week.days.find((d: ProgramDay) => d.day === currentDay);
        if (!day) return null;

        const columnKey = `column${currentColumn}` as keyof typeof day.columns;
        return day.columns[columnKey];
    };

    const getRestTime = (): number => {
        const week = PROGRAM_DATA.find((w: ProgramWeek) => w.week === currentWeek);
        return week?.restBetweenSets ?? 60;
    };

    const getWorkout = (week: number, day: number, column: 1 | 2 | 3): DayWorkout | null => {
        const w = PROGRAM_DATA.find((data: ProgramWeek) => data.week === week);
        if (!w) return null;
        const d = w.days.find((data: ProgramDay) => data.day === day);
        if (!d) return null;
        const columnKey = `column${column}` as keyof typeof d.columns;
        return d.columns[columnKey];
    };

    return {
        todayWorkout: getTodayWorkout(),
        restTime: getRestTime(),
        totalWeeks,
        totalDays,
        programData: PROGRAM_DATA,
        getWorkout,
    };
}
