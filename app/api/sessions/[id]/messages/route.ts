import { NextRequest, NextResponse } from 'next/server';
import { getMessages, createMessage, getSession } from '@/lib/data';
import { geminiService } from '@/lib/ai';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const session = await getSession(id);
        if (!session) {
            return NextResponse.json(
                { error: 'Session not found' },
                { status: 404 }
            );
        }

        const messages = await getMessages(id);
        return NextResponse.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json(
            { error: 'Failed to fetch messages' },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { content, generateAIResponse } = await request.json();

        if (!content || typeof content !== 'string') {
            return NextResponse.json(
                { error: 'Content is required and must be a string' },
                { status: 400 }
            );
        }

        const session = await getSession(id);
        if (!session) {
            return NextResponse.json(
                { error: 'Session not found' },
                { status: 404 }
            );
        }

        // Save user message
        const userMessage = await createMessage(id, content, 'user');

        // If AI response is requested, generate and save it
        let aiMessage = null;
        if (generateAIResponse) {
            try {
                // Get conversation history
                const messages = await getMessages(id);

                // Generate AI response
                const aiResponse = await geminiService.getInstance().generateResponse([
                    ...messages.map(msg => ({ role: msg.role as 'user' | 'assistant', content: msg.content })),
                    { role: 'user', content }
                ]);

                // Save AI response
                aiMessage = await createMessage(id, aiResponse, 'assistant');
            } catch (error) {
                console.error('Error generating AI response:', error);
                // Still return the user message even if AI response fails
            }
        }

        return NextResponse.json({
            userMessage,
            aiMessage
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating message:', error);
        return NextResponse.json(
            { error: 'Failed to create message' },
            { status: 500 }
        );
    }
}