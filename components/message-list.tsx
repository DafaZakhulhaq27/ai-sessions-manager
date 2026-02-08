import { Message } from '@/lib/schema';

interface MessageListProps {
    messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
    if (messages.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <svg
                    className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                </svg>
                <p>No messages yet. Start a conversation!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {messages.map((message) => (
                <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                >
                    <div
                        className={`max-w-[80%] px-4 py-3 rounded-lg ${message.role === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                            }`}
                    >
                        <div className="flex items-center mb-1">
                            <span className="text-xs font-medium opacity-75">
                                {message.role === 'user' ? 'You' : 'AI Assistant'}
                            </span>
                            <span className="text-xs opacity-50 ml-2">
                                {message.createdAt.toLocaleString()}
                            </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}