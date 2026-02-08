'use client';

import { useEffect } from 'react';
import { errorHandler } from '@/src/infrastructure/services/ErrorHandler';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Capture the error with Sentry
        errorHandler.captureError(error, {
            severity: 'high',
            url: typeof window !== 'undefined' ? window.location.href : undefined,
        }, {
            tags: {
                component: 'error-page',
                ...(error.digest && { errorDigest: error.digest }),
            },
            extra: {
                errorName: error.name,
                errorMessage: error.message,
                errorStack: error.stack,
            },
        });
    }, [error]);

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
                    Something went wrong!
                </h2>

                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                    We&apos;re sorry, but something unexpected happened. Our team has been notified and is working on a fix.
                </p>

                <div className="space-y-3">
                    <button
                        onClick={reset}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Try again
                    </button>

                    <button
                        onClick={() => window.location.href = '/'}
                        className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        Go to homepage
                    </button>
                </div>

                {process.env.NODE_ENV === 'development' && (
                    <details className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Error details (development only)
                        </summary>
                        <pre className="text-xs text-red-600 dark:text-red-400 overflow-auto">
                            {error.stack}
                        </pre>
                    </details>
                )}
            </div>
        </div>
    );
}