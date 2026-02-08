import { getSessionWithMessages } from '@/lib/data';
import { notFound } from 'next/navigation';
import MessageList from '@/components/message-list';
import MessageInput from '@/components/message-input';
import { DarkModeToggle } from '@/components/ui/dark-mode-toggle';
import Link from 'next/link';

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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/"
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </Link>
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {sessionWithMessages.title}
                        </h1>
                    </div>
                    <DarkModeToggle />
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                        Messages
                    </h2>
                    <MessageList messages={sessionWithMessages.messages} />
                </div>

                <MessageInput sessionId={id} />
            </main>
        </div>
    );
}