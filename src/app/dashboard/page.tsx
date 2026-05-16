'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { FileText, Archive, Sparkles, Tag, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Stats {
  totalNotes: number
  archivedNotes: number
  aiUsageCount: number
  recentNotes: { id: string; title: string; updated_at: string }[]
  topTags: { name: string; count: number }[]
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient()

      const [notesRes, archivedRes, aiRes, tagsRes] = await Promise.all([
        supabase.from('notes').select('id, title, updated_at').eq('is_archived', false).order('updated_at', { ascending: false }),
        supabase.from('notes').select('id').eq('is_archived', true),
        supabase.from('ai_logs').select('id'),
        supabase.from('note_tags').select('tag_id, tags(name)'),
      ])

      // Count top tags
      const tagCounts: Record<string, number> = {}
      tagsRes.data?.forEach((nt: any) => {
        const name = nt.tags?.name
        if (name) tagCounts[name] = (tagCounts[name] || 0) + 1
      })
      const topTags = Object.entries(tagCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      setStats({
        totalNotes: notesRes.data?.length || 0,
        archivedNotes: archivedRes.data?.length || 0,
        aiUsageCount: aiRes.data?.length || 0,
        recentNotes: notesRes.data?.slice(0, 5) || [],
        topTags,
      })
      setLoading(false)
    }

    fetchStats()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-40">
      <p className="text-sm text-muted-foreground">Loading dashboard...</p>
    </div>
  )

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
      <p className="text-sm text-muted-foreground mb-8">Your notes workspace at a glance</p>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<FileText size={18} />}
          label="Total Notes"
          value={stats?.totalNotes ?? 0}
          color="bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
        />
        <StatCard
          icon={<Archive size={18} />}
          label="Archived"
          value={stats?.archivedNotes ?? 0}
          color="bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
        />
        <StatCard
          icon={<Sparkles size={18} />}
          label="AI Uses"
          value={stats?.aiUsageCount ?? 0}
          color="bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400"
        />
        <StatCard
          icon={<Tag size={18} />}
          label="Unique Tags"
          value={stats?.topTags.length ?? 0}
          color="bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recently edited */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={16} className="text-muted-foreground" />
            <h2 className="font-medium text-sm">Recently Edited</h2>
          </div>
          {stats?.recentNotes.length === 0 && (
            <p className="text-sm text-muted-foreground">No notes yet</p>
          )}
          <div className="space-y-3">
            {stats?.recentNotes.map(note => (
              <div key={note.id} className="flex items-center justify-between gap-4">
                <p className="text-sm truncate">{note.title || 'Untitled Note'}</p>
                <p className="text-xs text-muted-foreground shrink-0">
                  {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Top tags */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Tag size={16} className="text-muted-foreground" />
            <h2 className="font-medium text-sm">Most Used Tags</h2>
          </div>
          {stats?.topTags.length === 0 && (
            <p className="text-sm text-muted-foreground">No tags yet</p>
          )}
          <div className="space-y-2">
            {stats?.topTags.map(tag => (
              <div key={tag.name} className="flex items-center justify-between">
                <span className="text-sm px-2 py-0.5 rounded-full bg-secondary">{tag.name}</span>
                <span className="text-xs text-muted-foreground">{tag.count} {tag.count === 1 ? 'note' : 'notes'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color }: {
  icon: React.ReactNode
  label: string
  value: number
  color: string
}) {
  return (
    <div className="border rounded-lg p-4 flex flex-col gap-3">
      <div className={`w-8 h-8 rounded-md flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-semibold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}