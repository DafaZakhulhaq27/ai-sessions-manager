'use server';

import { revalidatePath } from 'next/cache';
import { createSession } from '@/lib/data';

export async function createNewSession(_prevState: { error?: string; success?: boolean; session?: any } | null, formData: FormData) {
    try {
        const title = formData.get('title') as string;

        if (!title || typeof title !== 'string') {
            return { error: 'Title is required and must be a string' };
        }

        const session = await createSession(title.trim());

        // Revalidate the sessions list to update the UI
        revalidatePath('/');

        // Return the session data instead of redirecting
        return { success: true, session };
    } catch (error) {
        console.error('Error creating session:', error);
        return { error: 'Failed to create session' };
    }
}