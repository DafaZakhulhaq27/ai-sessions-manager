'use client';

import { DarkModeToggle } from '@/components/ui/dark-mode-toggle';
import NewSessionModal from '@/components/new-session-modal';
import Link from 'next/link';

interface HeaderProps {
    title?: string;
    showBackButton?: boolean;
    backHref?: string;
    showNewSessionButton?: boolean;
}

export default function Header({
    title = "AI Sessions Manager",
    showBackButton = false,
    backHref = "/",
    showNewSessionButton = true
}: HeaderProps) {
    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    {showBackButton && (
                        <Link
                            href={backHref}
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
                    )}
                    <h1 className={`${showBackButton ? 'text-xl font-semibold' : 'text-2xl font-bold'} text-gray-900 dark:text-gray-100 truncate`}>
                        {title}
                    </h1>
                </div>
                <div className="flex items-center space-x-4">
                    <DarkModeToggle />
                    {showNewSessionButton && <NewSessionModal />}
                </div>
            </div>
        </header>
    );
}