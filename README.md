# AI Sessions Manager

A modern AI chat session management application built with Next.js and Domain Driven Design (DDD) architecture. This application allows users to create, manage, and interact with AI-powered chat sessions using Google's Gemini AI.

## 🚀 Live Demo

Check out the live application: [https://ai-sessions-manager-l1y5.vercel.app/](https://ai-sessions-manager-l1y5.vercel.app/)

## 📹 Video Demo

[Coming Soon] - Video demonstration of the application features and usage.

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Markdown** - Markdown rendering with syntax highlighting
- **Tailwind Typography** - Beautiful typography for markdown content

### Backend & Database
- **Drizzle ORM** - Type-safe SQL toolkit
- **PostgreSQL** - Primary database
- **Supabase** - Backend-as-a-Service for database hosting

### AI & APIs
- **Google Gemini AI** - AI model for chat functionality
- **Server-Sent Events** - Real-time streaming responses

### Development & Testing
- **Jest** - Testing framework
- **React Testing Library** - Component testing utilities
- **ESLint** - Code linting
- **TypeScript** - Static type checking

### Monitoring & Error Tracking
- **Sentry** - Error tracking and performance monitoring

## 🏗️ Architecture

This project implements **Domain Driven Development (DDD)** architecture with clear separation of concerns:

```
src/
├── domain/                 # Core business logic
│   ├── entities/          # Business entities (Message, Session)
│   ├── repositories/      # Repository interfaces
│   └── services/         # Domain services (IAIService)
├── application/           # Application use cases
│   ├── dtos/             # Data transfer objects
│   └── use-cases/        # Business use cases
├── infrastructure/        # External concerns
│   ├── db/               # Database configuration & schema
│   ├── repositories/     # Repository implementations
│   └── services/         # External service implementations
└── presentation/         # UI layer (Next.js pages, components)
```

### Key DDD Concepts Implemented

1. **Entities**: Core business objects with identity (`Message`, `Session`)
2. **Repositories**: Abstractions for data persistence
3. **Use Cases**: Application-specific business rules
4. **Services**: Domain and infrastructure services
5. **Dependency Injection**: Clean separation between layers

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- PostgreSQL database (or Supabase account)
- Google Gemini AI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-sessions-manager.git
cd ai-sessions-manager
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
# Sentry DSN for error tracking (optional)
SENTRY_DSN=your_sentry_dsn
NEXT_PUBLIC_SENTRY_DSN=your_public_sentry_dsn

# Google Gemini AI API Key
GOOGLE_AI_API_KEY=your_gemini_api_key

# Supabase Configuration
DATABASE_URL=your_supabase_database_url

# Google Gemini AI Model
GOOGLE_AI_MODEL=gemini-flash-latest
```

5. Set up the database:
```bash
npm run db:setup
```

6. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

7. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
ai-sessions-manager/
├── app/                    # Next.js App Router pages
│   ├── [id]/              # Dynamic session pages
│   ├── actions/           # Server actions
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
├── src/                   # DDD architecture implementation
│   ├── domain/           # Domain layer
│   ├── application/      # Application layer
│   └── infrastructure/   # Infrastructure layer
├── tests/                # Test files
├── public/               # Static assets
└── lib/                  # Utility libraries
```

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 🗄️ Database Commands

```bash
# Generate database migrations
npm run db:generate

# Push schema changes to database
npm run db:push

# Open Drizzle Studio (database GUI)
npm run db:studio
```

## 🚀 Deployment

The easiest way to deploy this app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Google Gemini AI](https://ai.google.dev/) - AI model provider
- [Drizzle ORM](https://orm.drizzle.team/) - Type-safe SQL toolkit
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Supabase](https://supabase.com/) - Backend-as-a-Service
