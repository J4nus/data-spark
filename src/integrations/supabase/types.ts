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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      connected_accounts: {
        Row: {
          account_handle: string | null
          account_name: string
          connected_at: string | null
          created_at: string
          expires_at: string | null
          external_account_id: string | null
          id: string
          last_synced_at: string | null
          metadata: Json
          platform: Database["public"]["Enums"]["connected_platform"]
          scopes: string[]
          status: Database["public"]["Enums"]["account_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          account_handle?: string | null
          account_name: string
          connected_at?: string | null
          created_at?: string
          expires_at?: string | null
          external_account_id?: string | null
          id?: string
          last_synced_at?: string | null
          metadata?: Json
          platform: Database["public"]["Enums"]["connected_platform"]
          scopes?: string[]
          status?: Database["public"]["Enums"]["account_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          account_handle?: string | null
          account_name?: string
          connected_at?: string | null
          created_at?: string
          expires_at?: string | null
          external_account_id?: string | null
          id?: string
          last_synced_at?: string | null
          metadata?: Json
          platform?: Database["public"]["Enums"]["connected_platform"]
          scopes?: string[]
          status?: Database["public"]["Enums"]["account_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      content_items: {
        Row: {
          caption: string | null
          connected_account_id: string | null
          created_at: string
          external_post_id: string | null
          id: string
          media_asset_id: string | null
          metadata: Json
          platform: Database["public"]["Enums"]["connected_platform"] | null
          published_at: string | null
          scheduled_for: string | null
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          caption?: string | null
          connected_account_id?: string | null
          created_at?: string
          external_post_id?: string | null
          id?: string
          media_asset_id?: string | null
          metadata?: Json
          platform?: Database["public"]["Enums"]["connected_platform"] | null
          published_at?: string | null
          scheduled_for?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          caption?: string | null
          connected_account_id?: string | null
          created_at?: string
          external_post_id?: string | null
          id?: string
          media_asset_id?: string | null
          metadata?: Json
          platform?: Database["public"]["Enums"]["connected_platform"] | null
          published_at?: string | null
          scheduled_for?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_items_connected_account_id_fkey"
            columns: ["connected_account_id"]
            isOneToOne: false
            referencedRelation: "connected_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_media_asset_id_fkey"
            columns: ["media_asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      manual_notes: {
        Row: {
          body: string | null
          created_at: string
          id: string
          note_date: string
          tags: string[]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          note_date?: string
          tags?: string[]
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          note_date?: string
          tags?: string[]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      media_assets: {
        Row: {
          created_at: string
          duration_seconds: number | null
          external_url: string | null
          height: number | null
          id: string
          kind: Database["public"]["Enums"]["media_kind"]
          metadata: Json
          mime_type: string | null
          size_bytes: number | null
          storage_path: string | null
          tags: string[]
          title: string
          updated_at: string
          user_id: string
          width: number | null
        }
        Insert: {
          created_at?: string
          duration_seconds?: number | null
          external_url?: string | null
          height?: number | null
          id?: string
          kind?: Database["public"]["Enums"]["media_kind"]
          metadata?: Json
          mime_type?: string | null
          size_bytes?: number | null
          storage_path?: string | null
          tags?: string[]
          title: string
          updated_at?: string
          user_id: string
          width?: number | null
        }
        Update: {
          created_at?: string
          duration_seconds?: number | null
          external_url?: string | null
          height?: number | null
          id?: string
          kind?: Database["public"]["Enums"]["media_kind"]
          metadata?: Json
          mime_type?: string | null
          size_bytes?: number | null
          storage_path?: string | null
          tags?: string[]
          title?: string
          updated_at?: string
          user_id?: string
          width?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          handle: string | null
          id: string
          language: string
          timezone: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          handle?: string | null
          id: string
          language?: string
          timezone?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          handle?: string | null
          id?: string
          language?: string
          timezone?: string
          updated_at?: string
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
          role?: Database["public"]["Enums"]["app_role"]
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
    }
    Enums: {
      account_status: "draft" | "connected" | "expired" | "revoked" | "error"
      app_role: "admin" | "user"
      connected_platform: "instagram" | "facebook" | "youtube"
      content_status: "idea" | "draft" | "scheduled" | "published" | "archived"
      media_kind: "image" | "video" | "audio" | "document" | "other"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      account_status: ["draft", "connected", "expired", "revoked", "error"],
      app_role: ["admin", "user"],
      connected_platform: ["instagram", "facebook", "youtube"],
      content_status: ["idea", "draft", "scheduled", "published", "archived"],
      media_kind: ["image", "video", "audio", "document", "other"],
    },
  },
} as const
