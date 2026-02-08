'use server';

import { revalidatePath } from 'next/cache';
import { createMessage, getSession, getMessages } from '@/lib/data';
import { geminiService } from '@/lib/ai';

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

        // Check if session exists
        const session = await getSession(sessionId);
        if (!session) {
            return { error: 'Session not found' };
        }

        // Save user message
        await createMessage(sessionId, content.trim(), 'user');

        // If AI response is requested, generate and save it
        if (generateAIResponse) {
            try {
                // Get conversation history
                const messages = await getMessages(sessionId);

                // Generate AI response
                const aiResponse = await geminiService.getInstance().generateResponse([
                    ...messages.map(msg => ({ role: msg.role as 'user' | 'assistant', content: msg.content })),
                    { role: 'user', content: content.trim() }
                ]);

                // Save AI response
                await createMessage(sessionId, aiResponse, 'assistant');
            } catch (error) {
                console.error('Error generating AI response:', error);
                // Still return success even if AI response fails
            }
        }

        // Revalidate the session page to update the UI
        revalidatePath(`/${sessionId}`);

        return { success: true };
    } catch (error) {
        console.error('Error sending message:', error);
        return { error: 'Failed to send message' };
    }
}