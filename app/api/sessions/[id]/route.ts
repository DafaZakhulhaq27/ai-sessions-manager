import { NextRequest, NextResponse } from 'next/server';
import { getSession, updateSession, deleteSession, getSessionWithMessages } from '@/lib/data';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const url = new URL(request.url);
        const includeMessages = url.searchParams.get('includeMessages') === 'true';

        if (includeMessages) {
            const sessionWithMessages = await getSessionWithMessages(id);
            if (!sessionWithMessages) {
                return NextResponse.json(
                    { error: 'Session not found' },
                    { status: 404 }
                );
            }
            return NextResponse.json(sessionWithMessages);
        } else {
            const session = await getSession(id);
            if (!session) {
                return NextResponse.json(
                    { error: 'Session not found' },
                    { status: 404 }
                );
            }
            return NextResponse.json(session);
        }
    } catch (error) {
        console.error('Error fetching session:', error);
        return NextResponse.json(
            { error: 'Failed to fetch session' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { title } = await request.json();

        if (!title || typeof title !== 'string') {
            return NextResponse.json(
                { error: 'Title is required and must be a string' },
                { status: 400 }
            );
        }

        const existingSession = await getSession(id);
        if (!existingSession) {
            return NextResponse.json(
                { error: 'Session not found' },
                { status: 404 }
            );
        }

        const updatedSession = await updateSession(id, title);
        return NextResponse.json(updatedSession);
    } catch (error) {
        console.error('Error updating session:', error);
        return NextResponse.json(
            { error: 'Failed to update session' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const existingSession = await getSession(id);
        if (!existingSession) {
            return NextResponse.json(
                { error: 'Session not found' },
                { status: 404 }
            );
        }

        await deleteSession(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting session:', error);
        return NextResponse.json(
            { error: 'Failed to delete session' },
            { status: 500 }
        );
    }
}