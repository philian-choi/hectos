import { View, ScrollView, useColorScheme } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { SafeScreen } from "@/components/layout/SafeScreen";
import { FadeInView } from "@/components/ui/FadeInView";
import { useUserStore, calculateStreak } from "@/stores/useUserStore";
import { colors } from "@/constants/theme";
import { BadgeGrid } from "@/components/ui/BadgeGrid";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { getEarnedBadges, UserStats } from "@/constants/badges";

// RNR Components
import { Text } from "@/components/ui/text";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const WEEKS = [1, 2, 3, 4, 5, 6];

export default function ProgressScreen() {
    const { t } = useTranslation();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const { currentWeek, currentDay, exhaustionTests, totalPushups, completedSessions, isProgramComplete, personalBest, hasFinalTestUnlocked } = useUserStore();

    // Calculate stats for badges
    const stats: UserStats = {
        totalPushups,
        streak: calculateStreak(completedSessions || []),
        currentWeek,
        completedSessions: completedSessions?.length || 0,
        isProgramComplete
    };

    const earnedBadges = getEarnedBadges(stats);

    // Calculate overall progress (Simply based on Current Week/Day)
    const totalDays = 6 * 3; // 18 sessions
    const completedDays = ((currentWeek - 1) * 3) + (currentDay - 1);
    const progressPercent = Math.min(Math.round((completedDays / totalDays) * 100), 100);

    return (

        <SafeScreen>
            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                {/* Header Title */}
                <FadeInView delay={100} className="mb-6">
                    <Text className="text-4xl font-black text-foreground mb-1">
                        {t("progress.title")}
                    </Text>
                    <Text className="text-muted-foreground text-sm font-medium">
                        {t("progress.currentProgress", { week: currentWeek, day: currentDay })}
                    </Text>
                </FadeInView>

                {/* Overall Progress Section (Now using Rings) */}
                <FadeInView delay={200} className="items-center mb-8">
                    <View className="my-4">
                        <ProgressRing
                            progress={progressPercent / 100}
                            size={180}
                            strokeWidth={18}
                            color={colors.primary}
                            backgroundColor={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}
                        >
                            <View className="items-center">
                                <Text className="text-5xl font-black tracking-tighter text-foreground">
                                    {Math.round(progressPercent)}%
                                </Text>
                                <Text className="text-xs font-bold text-muted-foreground mt-1">
                                    {t("progress.completeMessage")}
                                </Text>
                            </View>
                        </ProgressRing>
                    </View>
                </FadeInView>

                {/* Personal Best Section */}
                <FadeInView delay={225} className="mb-6">
                    <Card className="overflow-hidden border-primary/20">
                        <CardContent className="p-4">
                            <View className="flex-row items-center gap-4">
                                <View
                                    style={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: 30,
                                        backgroundColor: isDark ? "rgba(255, 184, 0, 0.15)" : "rgba(255, 184, 0, 0.1)",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Text style={{ fontSize: 28 }}>💪</Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                                        {t("finalTest.personalBest")}
                                    </Text>
                                    <View className="flex-row items-baseline gap-1">
                                        <Text className="text-3xl font-black text-foreground">
                                            {personalBest}
                                        </Text>
                                        <Text className="text-base text-muted-foreground">/ 100</Text>
                                    </View>
                                    {/* Progress bar to 100 */}
                                    <View
                                        className="h-2 rounded-full mt-2 overflow-hidden"
                                        style={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)" }}
                                    >
                                        <View
                                            style={{
                                                width: `${Math.min(personalBest, 100)}%`,
                                                height: "100%",
                                                backgroundColor: colors.primary,
                                                borderRadius: 999,
                                            }}
                                        />
                                    </View>
                                </View>
                            </View>
                        </CardContent>
                    </Card>
                </FadeInView>

                {/* Badge Collection Section */}
                <FadeInView delay={250} className="mb-8">
                    <View className="flex-row justify-between items-center mb-4 px-1">
                        <Text className="text-xl font-bold text-foreground">
                            🏆 뱃지 컬렉션
                        </Text>
                        <Text className="text-muted-foreground font-semibold text-xs">
                            {earnedBadges.length} / 6
                        </Text>
                    </View>
                    <BadgeGrid earnedBadgeIds={earnedBadges} />
                </FadeInView>

                {/* Timeline / Weeks */}
                <View className="pl-2">
                    {WEEKS.map((week, index) => {
                        const isPast = week < currentWeek;
                        const isCurrent = week === currentWeek;
                        const isLocked = week > currentWeek;

                        return (
                            <FadeInView key={week} delay={300 + (index * 50)} className="flex-row mb-4 min-h-[80px]">
                                {/* Timeline Line & Dot */}
                                <View className="items-center w-6 mr-4">
                                    {index !== WEEKS.length - 1 && (
                                        <View className={cn(
                                            "absolute top-6 bottom-[-24px] w-0.5 z-0",
                                            isLocked ? "bg-muted-foreground/20" : "bg-primary"
                                        )} />
                                    )}
                                    <View className={cn(
                                        "w-6 h-6 rounded-full justify-center items-center z-10 border-[4px] border-background",
                                        isCurrent ? "bg-primary" : (isPast ? "bg-primary" : "bg-muted-foreground/20")
                                    )}>
                                        {isPast && <Feather name="check" size={12} color="#FFF" />}
                                    </View>
                                </View>

                                {/* Content Card */}
                                <Card className={cn(
                                    "flex-1 rounded-2xl border-0 shadow-sm",
                                    isLocked && "opacity-50"
                                )}>
                                    <CardContent className="p-4 pt-4">
                                        <View className="flex-row justify-between items-center mb-2">
                                            <Text className="text-base font-bold text-foreground">
                                                {t("progress.week", { week })}
                                            </Text>
                                            <View className="flex-row gap-1.5">
                                                {[1, 2, 3].map(day => {
                                                    // Logic: if past week, all done. if current week, check day.
                                                    let isDone = false;
                                                    let isToday = false;

                                                    if (isPast) isDone = true;
                                                    else if (isCurrent) {
                                                        if (day < currentDay) isDone = true;
                                                        else if (day === currentDay) isToday = true;
                                                    }

                                                    return (
                                                        <View key={day} className={cn(
                                                            "w-6 h-6 rounded-full justify-center items-center",
                                                            isDone ? "bg-green-500" : (isToday ? "border-2 border-primary bg-transparent" : "bg-muted"),
                                                        )}>
                                                            {isDone && <Feather name="check" size={10} color="#FFF" />}
                                                        </View>
                                                    )
                                                })}
                                            </View>
                                        </View>

                                        {/* Test Indicator */}
                                        {[2, 4, 5, 6].includes(week) && (
                                            <View className="flex-row items-center mt-2 gap-2 justify-between">
                                                <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-900/30 gap-1 pl-1 pr-2 py-0.5">
                                                    <Feather name="flag" size={10} color={colors.warning} />
                                                    <Text className="text-[10px] font-bold text-amber-500">{t("progress.exhaustionTest")}</Text>
                                                </Badge>
                                                {/* Done check for test logic roughly */}
                                                {exhaustionTests.some(t => t.week === week) && (
                                                    <Feather name="check-circle" size={14} color={colors.success} />
                                                )}
                                            </View>
                                        )}
                                    </CardContent>
                                </Card>
                            </FadeInView>
                        );
                    })}
                </View>
            </ScrollView>
        </SafeScreen>
    );
}


