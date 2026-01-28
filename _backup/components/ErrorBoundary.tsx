import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button } from '@/components/ui/button';
import { SafeScreen } from '@/components/layout/SafeScreen';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import * as Updates from 'expo-updates';
import i18n from '@/lib/i18n';

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log error to analytics service
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    handleRestart = async () => {
        try {
            await Updates.reloadAsync();
        } catch (e) {
            // Fallback reload not supported in dev sometimes
        }
    };

    render() {
        if (this.state.hasError) {
            return (
                <SafeScreen>
                    <View style={styles.container}>
                        <Text style={styles.title}>{i18n.t('error.title')}</Text>
                        <Text style={styles.subtitle}>{i18n.t('error.message')}</Text>

                        <ScrollView style={styles.errorBox}>
                            <Text style={styles.errorText}>
                                {this.state.error?.toString()}
                            </Text>
                        </ScrollView>

                        <Button onPress={this.handleRestart} variant="default">
                            {i18n.t('error.restart')}
                        </Button>
                    </View>
                </SafeScreen>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    title: {
        fontSize: typography.h1.fontSize,
        fontWeight: '800',
        marginBottom: spacing.md,
        color: colors.primary,
    },
    subtitle: {
        fontSize: typography.h4.fontSize,
        color: colors.gray[500],
        marginBottom: spacing.xl,
    },
    errorBox: {
        maxHeight: 200,
        width: '100%',
        backgroundColor: colors.gray[100],
        padding: spacing.md,
        borderRadius: borderRadius.sm,
        marginBottom: spacing.xl,
    },
    errorText: {
        color: colors.error,
        fontFamily: 'Courier',
        fontSize: typography.caption.fontSize,
    }
});

