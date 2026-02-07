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

class ErrorHandler {
    private errors: ErrorInfo[] = [];

    captureError(error: Error, context?: Partial<ErrorInfo>): void {
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

        // In a real implementation, you would send this to a monitoring service
        this.logError(errorInfo);
    }

    private logError(errorInfo: ErrorInfo): void {
        // Simulate sending to Sentry-like service
        console.log(`[ERROR LOG] ${errorInfo.timestamp.toISOString()}: ${errorInfo.message}`);
    }

    getErrors(): ErrorInfo[] {
        return [...this.errors];
    }

    clearErrors(): void {
        this.errors = [];
    }
}

export const errorHandler = new ErrorHandler();