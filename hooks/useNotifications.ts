
import { useState, useEffect, useRef } from 'react';
import { Platform, Alert } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useTranslation } from 'react-i18next';

// Configure notification handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export function useNotifications() {
    const { t } = useTranslation();
    const [expoPushToken, setExpoPushToken] = useState<string | undefined>('');
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
    const notificationListener = useRef<Notifications.Subscription | null>(null);
    const responseListener = useRef<Notifications.Subscription | null>(null);

    useEffect(() => {
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            // Handle notification tap
            console.log(response);
        });

        return () => {
            notificationListener.current?.remove();
            responseListener.current?.remove();
        };
    }, []);

    const registerForPushNotificationsAsync = async () => {
        let token;

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                // Permission not granted - fail silently or handle UI return
                // Alert.alert('Permission required', 'Please enable notifications specifically for this app in Settings.');
                return;
            }

            // Get token if needed for remote push (optional for local)
            try {
                token = (await Notifications.getExpoPushTokenAsync()).data;
            } catch (e) {
                console.log(e);
            }
        } else {
            console.log('Must use physical device for Push Notifications');
        }

        setExpoPushToken(token);
        return token;
    };

    const scheduleDailyReminder = async (hour = 9, minute = 0) => {
        // Cancel existing to avoid duplicates
        await Notifications.cancelAllScheduledNotificationsAsync();

        await Notifications.scheduleNotificationAsync({
            content: {
                title: "💪 " + t("notifications.daily.title", { defaultValue: "Time to workout!" }),
                body: t("notifications.daily.body", { defaultValue: "Consistent effort brings results. Let's do this!" }),
                sound: true,
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
                hour,
                minute,
                repeats: true,
            },
        });
    };

    const scheduleRetentionNudge = async (secondsFromNow = 7200) => { // Default 2 hours
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "👋 " + t("notifications.nudge.title", { defaultValue: "Don't forget your workout!" }),
                body: t("notifications.nudge.body", { defaultValue: "Day 1 is waiting. Start your journey today." }),
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: secondsFromNow,
                repeats: false,
            },
        });
    };

    return {
        registerForPushNotificationsAsync,
        scheduleDailyReminder,
        scheduleRetentionNudge
    };
}
