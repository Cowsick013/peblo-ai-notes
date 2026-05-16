export interface User {
  id: string
  name: string
  email: string
  created_at: string
}

export interface Note {
  id: string
  user_id: string
  title: string
  content: string
  is_archived: boolean
  share_id: string | null
  created_at: string
  updated_at: string
  tags?: Tag[]
}

export interface Tag {
  id: string
  user_id: string
  name: string
}

export interface AILog {
  id: string
  note_id: string
  user_id: string
  type: 'summary' | 'action_items' | 'suggest_title'
  created_at: string
}