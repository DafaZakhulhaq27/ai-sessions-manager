import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/lib/ai';

export async function POST(request: NextRequest) {
    try {
        const { messages } = await request.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { error: 'Messages array is required' },
                { status: 400 }
            );
        }

        const response = await geminiService.getInstance().generateResponse(messages);
        return NextResponse.json({ response });
    } catch (error) {
        console.error('Error in AI chat API:', error);
        return NextResponse.json(
            { error: 'Failed to generate AI response' },
            { status: 500 }
        );
    }
}