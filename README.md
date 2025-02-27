# Supabase AI Chatbot

A React-based AI chatbot application using Supabase for authentication and data storage.

## Features

- Chat interface with AI assistant
- Chat history management
- User authentication
- Data persistence with Supabase

## Getting Started

### Prerequisites

- Node.js
- Supabase account

### Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
4. Connect to Supabase by clicking the "Connect to Supabase" button in the top right
5. Run the migrations to set up the database schema
6. Start the development server:
   ```
   npm run dev
   ```

## Project Structure

- `/src/components` - React components
- `/src/lib` - Utility functions and API clients
- `/src/types` - TypeScript type definitions
- `/supabase/migrations` - SQL migrations for Supabase

## Deployment

Build the application for production:

```
npm run build
```

## License

MIT