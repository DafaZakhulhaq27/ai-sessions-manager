import { getSessionWithMessages } from '@/lib/data';
import { notFound } from 'next/navigation';
import MessageList from '@/components/message-list';
import MessageInput from '@/components/message-input';
import Header from '@/components/header';

export default async function SessionPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const sessionWithMessages = await getSessionWithMessages(id);

    if (!sessionWithMessages) {
        notFound();
    }

    return (
        <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            <Header
                title={sessionWithMessages.title}
                showBackButton={true}
                showNewSessionButton={false}
            />

            <main className="flex-1 container mx-auto px-4 py-6 flex flex-col overflow-hidden">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4 flex-1 flex flex-col overflow-hidden">
                    <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 flex-shrink-0">
                        Messages
                    </h2>
                    <MessageList messages={sessionWithMessages.messages} />
                </div>

                <div className="flex-shrink-0">
                    <MessageInput sessionId={id} />
                </div>
            </main>
        </div>
    );
}