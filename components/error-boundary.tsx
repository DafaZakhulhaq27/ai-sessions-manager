'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import * as Sentry from '@sentry/nextjs';
import { errorHandler } from '@/lib/error-handler';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Capture error with our custom error handler
        errorHandler.captureError(error, {
            severity: 'high',
            url: typeof window !== 'undefined' ? window.location.href : undefined,
        }, {
            tags: {
                component: 'error-boundary',
            },
            extra: {
                componentStack: errorInfo.componentStack,
                errorBoundary: true,
            },
        });

        // Also capture with Sentry directly for additional context
        Sentry.withScope((scope) => {
            scope.setTags({
                component: 'error-boundary',
            });
            scope.setExtras({
                componentStack: errorInfo.componentStack,
                errorBoundary: true,
            });
            Sentry.captureException(error);
        });

        // Call custom error handler if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }

        // Store error info for potential display
        this.setState({ errorInfo });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    render() {
        if (this.state.hasError) {
            // If custom fallback is provided, use it
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900 rounded-full mb-4">
                            <svg
                                className="w-6 h-6 text-red-600 dark:text-red-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>

                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 text-center mb-4">
                            Component Error
                        </h2>

                        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                            Something went wrong with this component. Our team has been notified.
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={this.handleReset}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Try Again
                            </button>
                        </div>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Error details (development only)
                                </summary>
                                <pre className="text-xs text-red-600 dark:text-red-400 overflow-auto mb-2">
                                    {this.state.error.stack}
                                </pre>
                                {this.state.errorInfo && (
                                    <pre className="text-xs text-orange-600 dark:text-orange-400 overflow-auto">
                                        {this.state.errorInfo.componentStack}
                                    </pre>
                                )}
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Hook for functional components to use error boundary pattern
export function useErrorHandler() {
    return (error: Error, errorInfo?: Partial<ErrorInfo>) => {
        errorHandler.captureError(error, {
            severity: 'high',
            url: typeof window !== 'undefined' ? window.location.href : undefined,
            ...errorInfo,
        }, {
            tags: {
                component: 'use-error-handler',
            },
        });
    };
}