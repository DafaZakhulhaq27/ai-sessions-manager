import { errorHandler } from '@/lib/error-handler';
import * as Sentry from '@sentry/nextjs';

// Mock Sentry
jest.mock('@sentry/nextjs', () => ({
    captureException: jest.fn(),
    captureMessage: jest.fn(),
    withScope: jest.fn((callback: (scope: unknown) => void) => {
        const mockScope = {
            setTags: jest.fn(),
            setExtras: jest.fn(),
            setLevel: jest.fn(),
            setUser: jest.fn(),
        };
        callback(mockScope);
    }),
    setUser: jest.fn(),
    addBreadcrumb: jest.fn(),
    SeverityLevel: {
        fatal: 'fatal',
        error: 'error',
        warning: 'warning',
        info: 'info',
        debug: 'debug',
    },
}));

describe('ErrorHandler', () => {
    beforeEach(() => {
        // Clear all errors before each test
        errorHandler.clearErrors();
        jest.clearAllMocks();
    });

    describe('captureError', () => {
        it('should capture and store error information', () => {
            const error = new Error('Test error');
            const context = {
                userId: 'user123',
                sessionId: 'session456',
                severity: 'high' as const,
            };

            errorHandler.captureError(error, context);

            const errors = errorHandler.getErrors();
            expect(errors).toHaveLength(1);
            expect(errors[0]).toMatchObject({
                message: 'Test error',
                userId: 'user123',
                sessionId: 'session456',
                severity: 'high',
            });
        });

        it('should use default values when context is not provided', () => {
            const error = new Error('Test error');

            errorHandler.captureError(error);

            const errors = errorHandler.getErrors();
            expect(errors).toHaveLength(1);
            expect(errors[0]).toMatchObject({
                message: 'Test error',
                severity: 'medium',
            });
        });

        it('should send error to Sentry with proper context', () => {
            const error = new Error('Test error');
            const context = {
                userId: 'user123',
                severity: 'critical' as const,
            };
            const sentryContext = {
                tags: {
                    component: 'test-component',
                },
                level: 'fatal' as const,
            };

            errorHandler.captureError(error, context, sentryContext);

            expect(Sentry.withScope).toHaveBeenCalled();
            expect(Sentry.captureException).toHaveBeenCalledWith(error);
        });

        it('should map severity levels correctly', () => {
            const mockScope = {
                setTags: jest.fn(),
                setExtras: jest.fn(),
                setLevel: jest.fn(),
                setUser: jest.fn(),
            };
            (Sentry.withScope as jest.Mock).mockImplementation((callback: (scope: unknown) => void) => callback(mockScope));

            // Test low severity
            errorHandler.captureError(new Error('Low error'), { severity: 'low' });
            expect(mockScope.setLevel).toHaveBeenCalledWith('info');

            // Test medium severity
            errorHandler.captureError(new Error('Medium error'), { severity: 'medium' });
            expect(mockScope.setLevel).toHaveBeenCalledWith('warning');

            // Test high severity
            errorHandler.captureError(new Error('High error'), { severity: 'high' });
            expect(mockScope.setLevel).toHaveBeenCalledWith('error');

            // Test critical severity
            errorHandler.captureError(new Error('Critical error'), { severity: 'critical' });
            expect(mockScope.setLevel).toHaveBeenCalledWith('fatal');
        });
    });

    describe('captureMessage', () => {
        it('should capture and store message information', () => {
            const message = 'Test message';
            const context = {
                userId: 'user123',
                sessionId: 'session456',
            };

            errorHandler.captureMessage(message, 'warning', context);

            const errors = errorHandler.getErrors();
            expect(errors).toHaveLength(1);
            expect(errors[0]).toMatchObject({
                message: 'Test message',
                userId: 'user123',
                sessionId: 'session456',
                severity: 'medium', // warning maps to medium
            });
        });

        it('should send message to Sentry with proper context', () => {
            const message = 'Test message';
            const context = {
                userId: 'user123',
            };

            errorHandler.captureMessage(message, 'error', context);

            expect(Sentry.withScope).toHaveBeenCalled();
            expect(Sentry.captureMessage).toHaveBeenCalledWith(message, 'error');
        });
    });

    describe('setUser and clearUser', () => {
        it('should set user context in Sentry', () => {
            const user = {
                id: 'user123',
                email: 'user@example.com',
                username: 'testuser',
            };

            errorHandler.setUser(user);

            expect(Sentry.setUser).toHaveBeenCalledWith(user);
        });

        it('should clear user context in Sentry', () => {
            errorHandler.clearUser();

            expect(Sentry.setUser).toHaveBeenCalledWith(null);
        });
    });

    describe('addBreadcrumb', () => {
        it('should add breadcrumb to Sentry', () => {
            const breadcrumb = {
                message: 'Test breadcrumb',
                category: 'test',
                level: 'info' as const,
                data: { key: 'value' },
            };

            errorHandler.addBreadcrumb(breadcrumb);

            expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({
                message: 'Test breadcrumb',
                category: 'test',
                level: 'info',
                data: { key: 'value' },
                timestamp: expect.any(Number),
            });
        });

        it('should use default values for optional breadcrumb fields', () => {
            const breadcrumb = {
                message: 'Test breadcrumb',
            };

            errorHandler.addBreadcrumb(breadcrumb);

            expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({
                message: 'Test breadcrumb',
                category: 'custom',
                level: 'info',
                data: undefined,
                timestamp: expect.any(Number),
            });
        });
    });

    describe('getErrors and clearErrors', () => {
        it('should return a copy of errors array', () => {
            const error = new Error('Test error');
            errorHandler.captureError(error);

            const errors = errorHandler.getErrors();
            errors.push({ message: 'fake error' } as never); // Try to modify the returned array

            expect(errorHandler.getErrors()).toHaveLength(1);
        });

        it('should clear all errors', () => {
            errorHandler.captureError(new Error('Test error 1'));
            errorHandler.captureError(new Error('Test error 2'));

            expect(errorHandler.getErrors()).toHaveLength(2);

            errorHandler.clearErrors();

            expect(errorHandler.getErrors()).toHaveLength(0);
        });
    });
});