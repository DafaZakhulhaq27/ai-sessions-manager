import * as Sentry from '@sentry/nextjs';

interface ErrorInfo {
    message: string;
    stack?: string;
    timestamp: Date;
    userAgent?: string;
    url?: string;
    userId?: string;
    sessionId?: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
}

interface SentryContext {
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
    level?: Sentry.SeverityLevel;
}

class ErrorHandler {
    private errors: ErrorInfo[] = [];

    captureError(error: Error, context?: Partial<ErrorInfo>, sentryContext?: SentryContext): void {
        const errorInfo: ErrorInfo = {
            message: error.message,
            stack: error.stack,
            timestamp: new Date(),
            userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
            url: typeof window !== 'undefined' ? window.location.href : undefined,
            severity: 'medium',
            ...context,
        };

        this.errors.push(errorInfo);
        console.error('Captured error:', errorInfo);

        // Send to Sentry with additional context
        this.sendToSentry(error, errorInfo, sentryContext);

        // Also log locally for development
        this.logError(errorInfo);
    }

    private sendToSentry(error: Error, errorInfo: ErrorInfo, sentryContext?: SentryContext): void {
        // Prepare Sentry context
        const tags = {
            severity: errorInfo.severity,
            component: errorInfo.sessionId ? 'session' : 'global',
            ...sentryContext?.tags,
        };

        const extra = {
            errorInfo,
            timestamp: errorInfo.timestamp.toISOString(),
            ...sentryContext?.extra,
        };

        // Determine Sentry level based on severity
        let level: Sentry.SeverityLevel = 'error';
        switch (errorInfo.severity) {
            case 'low':
                level = 'info';
                break;
            case 'medium':
                level = 'warning';
                break;
            case 'high':
                level = 'error';
                break;
            case 'critical':
                level = 'fatal';
                break;
        }

        // Send to Sentry with context
        Sentry.withScope((scope) => {
            scope.setTags(tags);
            scope.setExtras(extra);
            scope.setLevel(sentryContext?.level || level);

            // Set user if available
            if (errorInfo.userId) {
                scope.setUser({ id: errorInfo.userId });
            }

            Sentry.captureException(error);
        });
    }

    private logError(errorInfo: ErrorInfo): void {
        // Local logging for development
        console.log(`[ERROR LOG] ${errorInfo.timestamp.toISOString()}: ${errorInfo.message}`);
    }

    // Manual message capture for non-error events
    captureMessage(message: string, level: Sentry.SeverityLevel = 'info', context?: Partial<ErrorInfo>): void {
        const errorInfo: ErrorInfo = {
            message,
            timestamp: new Date(),
            userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
            url: typeof window !== 'undefined' ? window.location.href : undefined,
            severity: level === 'fatal' ? 'critical' : level === 'error' ? 'high' : level === 'warning' ? 'medium' : 'low',
            ...context,
        };

        this.errors.push(errorInfo);

        Sentry.withScope((scope) => {
            scope.setTags({
                severity: errorInfo.severity,
                component: context?.sessionId ? 'session' : 'global',
            });
            scope.setExtras({ errorInfo });

            if (context?.userId) {
                scope.setUser({ id: context.userId });
            }

            Sentry.captureMessage(message, level);
        });
    }

    // Set user context for Sentry
    setUser(user: { id: string; email?: string; username?: string }): void {
        Sentry.setUser(user);
    }

    // Clear user context
    clearUser(): void {
        Sentry.setUser(null);
    }

    // Add breadcrumb for better debugging
    addBreadcrumb(breadcrumb: {
        message: string;
        category?: string;
        level?: Sentry.SeverityLevel;
        data?: Record<string, unknown>;
    }): void {
        Sentry.addBreadcrumb({
            message: breadcrumb.message,
            category: breadcrumb.category || 'custom',
            level: breadcrumb.level || 'info',
            data: breadcrumb.data,
            timestamp: Date.now() / 1000,
        });
    }

    getErrors(): ErrorInfo[] {
        return [...this.errors];
    }

    clearErrors(): void {
        this.errors = [];
    }
}

export const errorHandler = new ErrorHandler();