import Link from 'next/link';
import { SessionDTO } from '@/src/application/dtos';

interface SessionCardProps {
    session: SessionDTO;
}

export default function SessionCard({ session }: SessionCardProps) {
    return (
        <Link
            href={`/${session.id}`}
            className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-700"
        >
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {session.title}
                </h3>
            </div>

            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <span>Updated: {session.updatedAt.toLocaleDateString()}</span>
            </div>

            <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 font-medium">
                <span>View Session</span>
                <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </div>
        </Link>
    );
}