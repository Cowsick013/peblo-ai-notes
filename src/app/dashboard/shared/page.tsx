'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { Share2, Copy, X, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'
import { Note } from '@/types'

export default function SharedPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchShared() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .not('share_id', 'is', null)
      .order('updated_at', { ascending: false })

    if (error) { toast.error('Failed to load shared notes'); return }
    setNotes(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchShared() }, [])

  function copyLink(shareId: string) {
    const url = `${window.location.origin}/share/${shareId}`
    navigator.clipboard.writeText(url)
    toast.success('Link copied to clipboard!')
  }

  async function unshare(id: string) {
    const res = await fetch(`/api/notes/${id}/share`, { method: 'DELETE' })
    if (res.ok) {
      setNotes(prev => prev.filter(n => n.id !== id))
      toast.success('Note unshared')
    } else {
      toast.error('Failed to unshare')
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Share2 size={20} />
        <h1 className="text-2xl font-semibold">Shared Notes</h1>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading...</p>}

      {!loading && notes.length === 0 && (
        <div className="flex flex-col items-center justify-center h-60 gap-3 text-muted-foreground">
          <FileText size={36} />
          <p className="text-sm">No shared notes yet</p>
          <p className="text-xs">Open a note and click Share to generate a public link</p>
        </div>
      )}

      <div className="grid gap-3 max-w-2xl">
        {notes.map(note => (
          <div key={note.id} className="border rounded-lg p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{note.title || 'Untitled Note'}</p>
                <p className="text-sm text-muted-foreground truncate mt-0.5">
                  {note.content || 'No content'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Updated {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs gap-1.5"
                  onClick={() => copyLink(note.share_id!)}
                >
                  <Copy size={12} /> Copy link
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs gap-1.5 text-destructive hover:text-destructive"
                  onClick={() => unshare(note.id)}
                >
                  <X size={12} /> Unshare
                </Button>
              </div>
            </div>
            <div className="mt-3 p-2 bg-secondary rounded text-xs text-muted-foreground truncate">
              {window?.location?.origin}/share/{note.share_id}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}