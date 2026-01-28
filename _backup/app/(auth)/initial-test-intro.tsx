import { View, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeScreen } from "@/components/layout/SafeScreen";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { FadeInView } from "@/components/ui/FadeInView";
import { Feather } from "@expo/vector-icons";
import { colors } from "@/constants/theme";

export default function InitialTestIntroScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const handleStart = () => {
        router.push("/(auth)/initial-test");
    };

    return (

        <SafeScreen>
            <View className="flex-1 p-6">
                <View className="flex-1 justify-center items-center">
                    <FadeInView delay={100}>
                        <Feather name="target" size={80} color={colors.primary} style={{ marginBottom: 24, alignSelf: 'center' }} />
                    </FadeInView>

                    <Text className="text-3xl font-bold text-center mb-4 text-foreground">
                        {t("onboarding.testIntro.title")}
                    </Text>

                    <Text className="text-xl font-semibold text-center mb-4 text-muted-foreground">
                        {t("onboarding.testIntro.description")}
                    </Text>

                    <Text className="text-base text-center opacity-70 text-muted-foreground">
                        {t("onboarding.testIntro.instruction")}
                    </Text>
                </View>

                <View className="pb-6">
                    <Button onPress={handleStart} size="lg" className="w-full text-lg">
                        <Text className="text-lg font-bold text-primary-foreground">
                            {t("onboarding.testIntro.start")}
                        </Text>
                    </Button>
                </View>
            </View>
        </SafeScreen>
    );
}
