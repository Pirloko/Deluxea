import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las variables de entorno de Supabase')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos de la base de datos
export type UserRole = 'admin' | 'profile_user' | 'visitor'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: UserRole
          created_at: string
          is_active: boolean
          must_change_password: boolean
        }
        Insert: {
          id: string
          email: string
          role: UserRole
          is_active?: boolean
          must_change_password?: boolean
        }
        Update: {
          email?: string
          role?: UserRole
          is_active?: boolean
          must_change_password?: boolean
        }
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          age: number | null
          title: string | null
          description: string | null
          tags: string[] | null
          category: string | null
          contact_number: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          age?: number | null
          title?: string | null
          description?: string | null
          tags?: string[] | null
          category?: string | null
          contact_number?: string | null
          avatar_url?: string | null
        }
        Update: {
          name?: string
          age?: number | null
          title?: string | null
          description?: string | null
          tags?: string[] | null
          category?: string | null
          contact_number?: string | null
          avatar_url?: string | null
        }
      }
    }
  }
}

