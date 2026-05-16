'use client'

import { useEffect, useState } from 'react'
import { Note } from '@/types'
import { createClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { Archive, RotateCcw, Trash2, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'

export default function ArchivedPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchArchived() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('is_archived', true)
      .order('updated_at', { ascending: false })

    if (error) {
      toast.error('Failed to load archived notes')
      return
    }
    setNotes(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchArchived() }, [])

  async function unarchive(id: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from('notes')
      .update({ is_archived: false })
      .eq('id', id)

    if (error) { toast.error('Failed to unarchive'); return }
    setNotes(prev => prev.filter(n => n.id !== id))
    toast.success('Note restored to workspace')
  }

  async function deleteNote(id: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)

    if (error) { toast.error('Failed to delete'); return }
    setNotes(prev => prev.filter(n => n.id !== id))
    toast.success('Note permanently deleted')
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Archive size={20} />
        <h1 className="text-2xl font-semibold">Archived</h1>
      </div>

      {loading && (
        <p className="text-sm text-muted-foreground">Loading...</p>
      )}

      {!loading && notes.length === 0 && (
        <div className="flex flex-col items-center justify-center h-60 gap-3 text-muted-foreground">
          <FileText size={36} />
          <p className="text-sm">No archived notes</p>
        </div>
      )}

      <div className="grid gap-3 max-w-2xl">
        {notes.map(note => (
          <div
            key={note.id}
            className="border rounded-lg p-4 flex items-start justify-between gap-4 bg-background"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{note.title || 'Untitled Note'}</p>
              <p className="text-sm text-muted-foreground truncate mt-0.5">
                {note.content || 'No content'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Archived {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs gap-1.5"
                onClick={() => unarchive(note.id)}
              >
                <RotateCcw size={12} /> Restore
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs gap-1.5 text-destructive hover:text-destructive"
                onClick={() => deleteNote(note.id)}
              >
                <Trash2 size={12} /> Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}