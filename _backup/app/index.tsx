import { Redirect } from "expo-router";
import { useUserStore } from "@/stores/useUserStore";

export default function Index() {
    const hasCompletedOnboarding = useUserStore(
        (state) => state.hasCompletedOnboarding
    );

    // 온보딩 완료 여부에 따라 라우팅
    if (!hasCompletedOnboarding) {
        return <Redirect href="/(auth)/welcome" />;
    }

    return <Redirect href="/(tabs)" />;
}
