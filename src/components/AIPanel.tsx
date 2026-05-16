'use client'

import { useState } from 'react'
import { Note } from '@/types'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Sparkles, FileText, ListTodo, Heading, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AIPanelProps {
  note: Note
  onTitleSuggest: (title: string) => void
  onClose: () => void
}

interface AIResult {
  summary?: string
  action_items?: string[]
  suggested_title?: string
}

export default function AIPanel({ note, onTitleSuggest, onClose }: AIPanelProps) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AIResult | null>(null)

  async function analyze() {
    if (!note.content || note.content.trim().length < 10) {
      toast.error('Write more content before using AI')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noteId: note.id,
          title: note.title,
          content: note.content,
          type: 'analyze'
        })
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'AI analysis failed')
        return
      }

      setResult(data)
      toast.success('AI analysis complete')
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  function applyTitle() {
    if (result?.suggested_title) {
      onTitleSuggest(result.suggested_title)
      toast.success('Title applied!')
    }
  }

  return (
    <div className="w-80 border-l flex flex-col shrink-0 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-purple-500" />
          <span className="text-sm font-medium">AI Assistant</span>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X size={16} />
        </button>
      </div>

      {/* Analyze button */}
      <div className="p-4 border-b">
        <Button
          className="w-full gap-2"
          onClick={analyze}
          disabled={loading}
        >
          {loading ? (
            <><Loader2 size={14} className="animate-spin" /> Analyzing...</>
          ) : (
            <><Sparkles size={14} /> Analyze Note</>
          )}
        </Button>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Generates summary, action items, and title suggestion
        </p>
      </div>

      {/* Results */}
      {result && (
        <div className="flex-1 p-4 space-y-5">

          {/* Summary */}
          {result.summary && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <FileText size={13} className="text-muted-foreground" />
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Summary</p>
              </div>
              <p className="text-sm leading-relaxed">{result.summary}</p>
            </div>
          )}

          {/* Action items */}
          {result.action_items && result.action_items.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <ListTodo size={13} className="text-muted-foreground" />
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Action Items</p>
              </div>
              <ul className="space-y-1.5">
                {result.action_items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="w-4 h-4 rounded-full bg-secondary flex items-center justify-center text-xs shrink-0 mt-0.5">{i + 1}</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggested title */}
          {result.suggested_title && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Heading size={13} className="text-muted-foreground" />
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Suggested Title</p>
              </div>
              <div className="flex items-center justify-between gap-2 p-2 rounded-md bg-secondary">
                <p className="text-sm">{result.suggested_title}</p>
                <Button size="sm" variant="outline" className="h-6 text-xs shrink-0" onClick={applyTitle}>
                  Apply
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!result && !loading && (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-muted-foreground p-4">
          <Sparkles size={32} />
          <p className="text-sm text-center">Click Analyze to get AI insights on your note</p>
        </div>
      )}
    </div>
  )
}