"use client";

import { MessageDTO } from '@/src/application/dtos';
import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageListProps {
    messages: MessageDTO[];
}

export default function MessageList({ messages }: MessageListProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
        <div className="flex-1 overflow-y-auto space-y-4 p-2">
            {messages.map((message) => (
                <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                >
                    <div
                        className={`max-w-[85%] px-4 py-3 rounded-lg ${message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                            }`}
                    >
                        <div className="flex items-center mb-2 border-b border-black/5 dark:border-white/5 pb-1">
                            <span className="text-[10px] uppercase tracking-wider font-bold opacity-70">
                                {message.role === 'user' ? 'You' : 'AI Assistant'}
                            </span>
                            <span className="text-[10px] opacity-40 ml-2">
                                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        <div className={`text-sm leading-relaxed prose prose-sm max-w-none ${message.role === 'user' ? 'prose-invert' : 'dark:prose-invert'}`}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {message.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
}