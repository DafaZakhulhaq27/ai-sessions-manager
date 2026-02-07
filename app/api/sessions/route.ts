import { NextRequest, NextResponse } from 'next/server';
import { getSessions, createSession } from '@/lib/data';

export async function GET() {
    try {
        const sessions = await getSessions();
        return NextResponse.json(sessions);
    } catch (error) {
        console.error('Error fetching sessions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch sessions' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { title } = await request.json();

        if (!title || typeof title !== 'string') {
            return NextResponse.json(
                { error: 'Title is required and must be a string' },
                { status: 400 }
            );
        }

        const session = await createSession(title);
        return NextResponse.json(session, { status: 201 });
    } catch (error) {
        console.error('Error creating session:', error);
        return NextResponse.json(
            { error: 'Failed to create session' },
            { status: 500 }
        );
    }
}