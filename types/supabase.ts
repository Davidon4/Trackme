export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'user'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'user'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'user'
          created_at?: string
          updated_at?: string
        }
      }
      signups: {
        Row: {
          id: string
          full_name: string | null
          email: string
          signed_up_at: string
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          signed_up_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          signed_up_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'user' | 'admin'
    }
  }
}
