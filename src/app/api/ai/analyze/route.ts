import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { noteId, title, content, type } = await request.json()

  if (!content || content.trim().length < 10) {
    return NextResponse.json({ error: 'Note is too short to analyze' }, { status: 400 })
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const prompt = `
You are an AI assistant for a notes app. Analyze the following note and respond ONLY with a valid JSON object, no markdown, no backticks.

Note Title: ${title || 'Untitled'}
Note Content: ${content}

Respond with exactly this JSON structure:
{
  "summary": "A concise 2-3 sentence summary of the note",
  "action_items": ["action item 1", "action item 2"],
  "suggested_title": "A clear and concise title for this note"
}
`

  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)

    // Log AI usage
    await supabase.from('ai_logs').insert({
      note_id: noteId,
      user_id: user.id,
      type: type || 'analyze'
    })

    return NextResponse.json(parsed)
  } catch (err) {
    console.error('Gemini error:', err)
    return NextResponse.json({ error: 'AI analysis failed' }, { status: 500 })
  }
}