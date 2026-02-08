'use server';

import { revalidatePath } from 'next/cache';
import { createSessionUseCase } from '@/src/di';

export async function createNewSession(_prevState: { error?: string; success?: boolean; session?: any } | null, formData: FormData) {
    try {
        const title = formData.get('title') as string;

        if (!title || typeof title !== 'string') {
            return { error: 'Title is required and must be a string' };
        }

        const session = await createSessionUseCase.execute(title.trim());

        // Revalidate the sessions list to update the UI
        revalidatePath('/');

        // Return the session data (DTO)
        const sessionDto = {
            id: session.id,
            title: session.title,
            createdAt: session.createdAt,
            updatedAt: session.updatedAt
        };

        return { success: true, session: sessionDto };
    } catch (error) {
        console.error('Error creating session:', error);
        return { error: 'Failed to create session' };
    }
}