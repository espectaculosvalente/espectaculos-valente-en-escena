export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      contact_messages: {
        Row: {
          created_at: string
          email: string
          entity: string | null
          id: string
          is_read: boolean
          lang: string
          message: string
          name: string
          phone: string | null
          show_name: string | null
        }
        Insert: {
          created_at?: string
          email: string
          entity?: string | null
          id?: string
          is_read?: boolean
          lang?: string
          message: string
          name: string
          phone?: string | null
          show_name?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          entity?: string | null
          id?: string
          is_read?: boolean
          lang?: string
          message?: string
          name?: string
          phone?: string | null
          show_name?: string | null
        }
        Relationships: []
      }
      materials: {
        Row: {
          content: Json
          cover_url: string | null
          created_at: string
          file_url: string | null
          id: string
          section: string
          show_id: string | null
          sort_order: number
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          content?: Json
          cover_url?: string | null
          created_at?: string
          file_url?: string | null
          id?: string
          section?: string
          show_id?: string | null
          sort_order?: number
          status?: string
          type?: string
          updated_at?: string
        }
        Update: {
          content?: Json
          cover_url?: string | null
          created_at?: string
          file_url?: string | null
          id?: string
          section?: string
          show_id?: string | null
          sort_order?: number
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "materials_show_id_fkey"
            columns: ["show_id"]
            isOneToOne: false
            referencedRelation: "shows"
            referencedColumns: ["id"]
          },
        ]
      }
      people: {
        Row: {
          content: Json
          created_at: string
          id: string
          links: string | null
          name: string
          photo_url: string | null
          slug: string
          sort_order: number
          status: string
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          links?: string | null
          name?: string
          photo_url?: string | null
          slug: string
          sort_order?: number
          status?: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          links?: string | null
          name?: string
          photo_url?: string | null
          slug?: string
          sort_order?: number
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      shows: {
        Row: {
          artist: string | null
          category: string | null
          content: Json
          created_at: string
          dossier_url: string | null
          featured: boolean
          gallery: string[]
          id: string
          image_url: string | null
          kind: string
          press_url: string | null
          slug: string
          sort_order: number
          status: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          artist?: string | null
          category?: string | null
          content?: Json
          created_at?: string
          dossier_url?: string | null
          featured?: boolean
          gallery?: string[]
          id?: string
          image_url?: string | null
          kind: string
          press_url?: string | null
          slug: string
          sort_order?: number
          status?: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          artist?: string | null
          category?: string | null
          content?: Json
          created_at?: string
          dossier_url?: string | null
          featured?: boolean
          gallery?: string[]
          id?: string
          image_url?: string | null
          kind?: string
          press_url?: string | null
          slug?: string
          sort_order?: number
          status?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      site_images: {
        Row: {
          key: string
          updated_at: string
          url: string
        }
        Insert: {
          key: string
          updated_at?: string
          url: string
        }
        Update: {
          key?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          value?: string
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      site_texts: {
        Row: {
          key: string
          lang: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          lang: string
          updated_at?: string
          value: string
        }
        Update: {
          key?: string
          lang?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          category: string
          content: Json
          cover_url: string | null
          created_at: string
          id: string
          show_id: string | null
          sort_order: number
          status: string
          updated_at: string
          url: string | null
        }
        Insert: {
          category?: string
          content?: Json
          cover_url?: string | null
          created_at?: string
          id?: string
          show_id?: string | null
          sort_order?: number
          status?: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          category?: string
          content?: Json
          cover_url?: string | null
          created_at?: string
          id?: string
          show_id?: string | null
          sort_order?: number
          status?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "videos_show_id_fkey"
            columns: ["show_id"]
            isOneToOne: false
            referencedRelation: "shows"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_team: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "editor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor"],
    },
  },
} as const
