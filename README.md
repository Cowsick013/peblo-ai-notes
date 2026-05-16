# Peblo — AI Notes Workspace

A modern, AI-powered notes workspace built with Next.js 15, Supabase, and Google Gemini. Designed to feel like a lightweight Notion with an AI assistant built in.

---

## Features

- Email/password authentication with protected routes
- Create, edit, delete, and archive notes with auto-save
- AI panel — generate summaries, extract action items, suggest titles
- Full-text keyword search and tag filtering
- Public share links for notes (no login required to view)
- Productivity dashboard with stats and activity overview

---

## Tech Stack

- **Frontend** — Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend** — Next.js API Routes
- **Database & Auth** — Supabase (PostgreSQL + RLS)
- **AI** — Google Gemini API
- **Deployment** — Vercel

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/peblo-ai-notes.git
cd peblo-ai-notes
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
src/
├── app/
│   ├── api/          # API routes (notes, ai, share)
│   ├── dashboard/    # Protected dashboard pages
│   ├── share/        # Public share page
│   ├── login/        # Auth pages
│   └── signup/
├── components/       # Reusable UI components
├── hooks/            # Custom React hooks
├── lib/              # Supabase client helpers
└── types/            # TypeScript types
```

-


---

## License

MIT
