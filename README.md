# AI Notes Workspace

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

Contributers are both the accounts of the primary developer who will share this link


---

## License

MIT
