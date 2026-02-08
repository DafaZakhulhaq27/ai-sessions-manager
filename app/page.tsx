import { getSessions } from '@/lib/data';
import SessionCard from '@/components/session-card';
import NewSessionModal from '@/components/new-session-modal';
import { DarkModeToggle } from '@/components/ui/dark-mode-toggle';

export default async function HomePage() {
  const sessions = await getSessions();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            AI Sessions Manager
          </h1>
          <div className="flex items-center space-x-4">
            <DarkModeToggle />
            <NewSessionModal />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Your Sessions
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your AI conversation sessions
          </p>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No sessions yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first AI conversation session to get started
            </p>
            <NewSessionModal />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
