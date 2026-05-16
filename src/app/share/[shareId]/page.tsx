import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ shareId: string }>
}

async function getSharedNote(shareId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'
    : 'http://localhost:3000'

  const res = await fetch(`${baseUrl}/api/share/${shareId}`, {
    cache: 'no-store'
  })

  if (!res.ok) return null
  return res.json()
}

export default async function SharedNotePage({ params }: Props) {
  const { shareId } = await params
  const note = await getSharedNote(shareId)

  if (!note) notFound()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-2">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">P</span>
          </div>
          <span className="font-semibold text-sm">Peblo</span>
          <span className="text-muted-foreground text-sm ml-2">— Shared Note</span>
        </div>
      </div>

      {/* Note content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-semibold mb-4">
          {note.title || 'Untitled Note'}
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Last updated {new Date(note.updated_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
        <div className="prose prose-sm max-w-none">
          {note.content ? (
            <p className="text-base leading-relaxed whitespace-pre-wrap">
              {note.content}
            </p>
          ) : (
            <p className="text-muted-foreground">This note has no content.</p>
          )}
        </div>
      </div>
    </div>
  )
}