import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ shareId: string }> }
) {
  const supabase = await createServerSupabaseClient()
  const { shareId } = await params

  const { data, error } = await supabase
    .from('notes')
    .select('id, title, content, created_at, updated_at')
    .eq('share_id', shareId)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Note not found' }, { status: 404 })
  }

  return NextResponse.json(data)
}