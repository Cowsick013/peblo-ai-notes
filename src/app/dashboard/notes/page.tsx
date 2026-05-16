'use client'

import { useState, useEffect, useRef } from 'react'
import { useNotes } from '@/hooks/useNotes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Plus, Trash2, Archive, Search, FileText, Sparkles, Share2, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import AIPanel from '@/components/AIPanel'

export default function NotesPage() {
  const [search, setSearch] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [showAI, setShowAI] = useState(false)
  const [sharing, setSharing] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { notes, loading, activeNote, setActiveNote, createNote, updateNote, deleteNote, archiveNote, fetchNotes } = useNotes()

  useEffect(() => {
    if (activeNote) {
      setTitle(activeNote.title)
      setContent(activeNote.content)
    }
  }, [activeNote?.id])

  function handleTitleChange(val: string) {
    setTitle(val)
    if (!activeNote) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      updateNote(activeNote.id, { title: val })
      toast.success('Saved', { duration: 1000 })
    }, 1500)
  }

  function handleContentChange(val: string) {
    setContent(val)
    if (!activeNote) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      updateNote(activeNote.id, { content: val })
      toast.success('Saved', { duration: 1000 })
    }, 1500)
  }

  async function handleShare() {
    if (!activeNote) return
    setSharing(true)
    if (activeNote.share_id) {
      const url = `${window.location.origin}/share/${activeNote.share_id}`
      navigator.clipboard.writeText(url)
      toast.success('Share link copied!')
      setSharing(false)
      return
    }
    const res = await fetch(`/api/notes/${activeNote.id}/share`, { method: 'POST' })
    const data = await res.json()
    if (data.share_id) {
      const url = `${window.location.origin}/share/${data.share_id}`
      navigator.clipboard.writeText(url)
      await fetchNotes()
      toast.success('Share link copied to clipboard!')
    } else {
      toast.error('Failed to generate share link')
    }
    setSharing(false)
  }

  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex h-full -m-4 md:-m-6 overflow-hidden">

      {/* Notes list panel — full width on mobile, fixed width on desktop */}
      {/* Hidden on mobile when a note is active */}
      <div className={cn(
        'border-r flex flex-col shrink-0 bg-background',
        'w-full md:w-72',
        activeNote ? 'hidden md:flex' : 'flex'
      )}>
        <div className="p-3 border-b flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-2.5 top-2.5 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              className="pl-8 h-8 text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Button
            size="sm"
            className="h-8 w-8 p-0 shrink-0"
            onClick={createNote}
            title="New note"
          >
            <Plus size={14} />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && (
            <p className="text-sm text-muted-foreground p-4">Loading...</p>
          )}
          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 gap-2 px-4">
              <FileText size={24} className="text-muted-foreground" />
              <p className="text-sm text-muted-foreground text-center">No notes yet</p>
              <Button size="sm" variant="outline" onClick={createNote}>
                <Plus size={13} className="mr-1" /> Create one
              </Button>
            </div>
          )}
          {filtered.map(note => (
            <div
              key={note.id}
              onClick={() => setActiveNote(note)}
              className={cn(
                'px-3 py-3 border-b cursor-pointer hover:bg-secondary transition-colors',
                activeNote?.id === note.id && 'bg-secondary'
              )}
            >
              <p className="text-sm font-medium truncate">
                {note.title || 'Untitled Note'}
              </p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {note.content || 'No content'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Editor + AI panel — full width on mobile when note is active */}
      <div className={cn(
        'flex-1 flex overflow-hidden',
        !activeNote && 'hidden md:flex'
      )}>

        {/* Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!activeNote ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <FileText size={40} />
              <p className="text-sm">Select a note or create a new one</p>
              <Button variant="outline" size="sm" onClick={createNote}>
                <Plus size={14} className="mr-2" /> New note
              </Button>
            </div>
          ) : (
            <>
              {/* Toolbar */}
              <div className="flex items-center justify-between px-3 md:px-6 py-3 border-b shrink-0">
                <div className="flex items-center gap-2">
                  {/* Back button — mobile only */}
                  <button
                    className="md:hidden text-muted-foreground hover:text-foreground p-1"
                    onClick={() => setActiveNote(null)}
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activeNote.updated_at), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs gap-1"
                    onClick={() => archiveNote(activeNote.id)}
                  >
                    <Archive size={13} />
                    <span className="hidden md:inline">Archive</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className={cn('h-7 px-2 text-xs gap-1', showAI && 'bg-secondary')}
                    onClick={() => setShowAI(prev => !prev)}
                  >
                    <Sparkles size={13} />
                    <span className="hidden md:inline">AI</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className={cn('h-7 px-2 text-xs gap-1', activeNote?.share_id && 'text-blue-500')}
                    onClick={handleShare}
                    disabled={sharing}
                  >
                    <Share2 size={13} />
                    <span className="hidden md:inline">
                      {activeNote?.share_id ? 'Copy link' : 'Share'}
                    </span>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs gap-1 text-destructive hover:text-destructive"
                    onClick={() => deleteNote(activeNote.id)}
                  >
                    <Trash2 size={13} />
                    <span className="hidden md:inline">Delete</span>
                  </Button>
                </div>
              </div>

              {/* Title */}
              <input
                className="px-4 md:px-6 pt-6 pb-2 text-xl md:text-2xl font-semibold bg-transparent border-none outline-none placeholder:text-muted-foreground w-full shrink-0"
                placeholder="Untitled Note"
                value={title}
                onChange={e => handleTitleChange(e.target.value)}
              />

              {/* Content */}
              <textarea
                className="flex-1 px-4 md:px-6 py-2 bg-transparent border-none outline-none resize-none text-sm leading-relaxed placeholder:text-muted-foreground"
                placeholder="Start writing..."
                value={content}
                onChange={e => handleContentChange(e.target.value)}
              />
            </>
          )}
        </div>

        {/* AI Panel */}
        {activeNote && showAI && (
          <AIPanel
            note={activeNote}
            onTitleSuggest={(t) => handleTitleChange(t)}
            onClose={() => setShowAI(false)}
          />
        )}
      </div>
    </div>
  )
}