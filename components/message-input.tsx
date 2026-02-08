'use client';

import { useState, useActionState, startTransition, useEffect } from 'react';
import { sendMessage } from '@/app/actions/messages';

interface MessageInputProps {
    sessionId: string;
}

export default function MessageInput({ sessionId }: MessageInputProps) {
    const [content, setContent] = useState('');
    const [state, action, pending] = useActionState(sendMessage, null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        const formData = new FormData();
        formData.append('sessionId', sessionId);
        formData.append('content', content.trim());
        formData.append('generateAIResponse', 'true');

        startTransition(() => {
            action(formData);
        });
    };

    // Clear the input field when the message is successfully sent
    useEffect(() => {
        if (state?.success) {
            setContent('');
        }
    }, [state]);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Your message
                    </label>
                    <textarea
                        id="message"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                        placeholder="Type your message here..."
                        disabled={pending}
                    />
                </div>

                {state?.error && (
                    <div className="text-red-600 dark:text-red-400 text-sm">
                        {state.error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={pending || !content.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    {pending ? 'Sending...' : 'Send Message'}
                </button>
            </form>
        </div>
    );
}