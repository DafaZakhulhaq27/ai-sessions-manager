
'use server';

import { revalidatePath } from 'next/cache';
import { sendMessageUseCase } from '@/src/di';

export async function sendMessage(
    _prevState: { error?: string; success?: boolean } | null,
    formData: FormData
) {
    try {
        const sessionId = formData.get('sessionId') as string;
        const content = formData.get('content') as string;
        const generateAIResponse = formData.get('generateAIResponse') === 'true';

        if (!sessionId || typeof sessionId !== 'string') {
            return { error: 'Session ID is required' };
        }

        if (!content || typeof content !== 'string') {
            return { error: 'Content is required and must be a string' };
        }

        await sendMessageUseCase.execute(sessionId, content.trim(), generateAIResponse);

        // Revalidate the session page to update the UI
        revalidatePath(`/${sessionId}`);

        return { success: true };
    } catch (error) {
        console.error('Error sending message:', error);
        return { error: 'Failed to send message' };
    }
}