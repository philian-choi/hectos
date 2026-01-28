type EventName =
    | 'view_screen'
    | 'click_button'
    | 'purchase_view'
    | 'purchase_attempt'
    | 'purchase_success'
    | 'purchase_fail'
    | 'workout_start'
    | 'workout_complete'
    | 'initial_test_start'
    | 'initial_test_complete'
    | 'restore_attempt'
    | 'restore_success'
    | 'restore_empty'
    | 'restore_fail';

type EventParams = Record<string, any>;

export const Analytics = {
    track: (name: EventName, params?: EventParams) => {
        if (__DEV__) {
            console.log(`📊 [Analytics] ${name}`, params || '');
        }
        // TODO: Implement actual tracking (e.g. PostHog API via fetch, or SDK)
        // Example: fetch('https://app.posthog.com/capture', { ... })
    },

    identify: (userId: string, traits?: Record<string, any>) => {
        if (__DEV__) {
            console.log(`👤 [Analytics] Identify: ${userId}`, traits || '');
        }
    },

    screen: (screenName: string) => {
        if (__DEV__) {
            console.log(`📱 [Analytics] Screen: ${screenName}`);
        }
    }
};
