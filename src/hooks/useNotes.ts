import { useState, useEffect, useCallback } from 'react'
import { Note } from '@/types'
import { toast } from 'sonner'

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [activeNote, setActiveNote] = useState<Note | null>(null)

  const fetchNotes = useCallback(async () => {
    const res = await fetch('/api/notes')
    const data = await res.json()
    setNotes(data)
    setLoading(false)
  }, [])

  useEffect(() => { fetchNotes() }, [fetchNotes])

  async function createNote() {
    const res = await fetch('/api/notes', { method: 'POST' })
    const note = await res.json()
    setNotes(prev => [note, ...prev])
    setActiveNote(note)
    toast.success('New note created')
  }

  async function updateNote(id: string, fields: Partial<Note>) {
    const res = await fetch(`/api/notes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    })
    const updated = await res.json()
    setNotes(prev => prev.map(n => n.id === id ? updated : n))
    if (activeNote?.id === id) setActiveNote(updated)
  }

  async function deleteNote(id: string) {
    await fetch(`/api/notes/${id}`, { method: 'DELETE' })
    setNotes(prev => prev.filter(n => n.id !== id))
    if (activeNote?.id === id) setActiveNote(null)
    toast.success('Note deleted')
  }

  async function archiveNote(id: string) {
    await updateNote(id, { is_archived: true })
    setNotes(prev => prev.filter(n => n.id !== id))
    if (activeNote?.id === id) setActiveNote(null)
    toast.success('Note archived')
  }

  return {
    notes, loading, activeNote, setActiveNote,
    createNote, updateNote, deleteNote, archiveNote,
    fetchNotes
  }
}