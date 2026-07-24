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
      bid_items: {
        Row: {
          bid_id: string
          cost_type: string | null
          created_at: string | null
          foreign_spend: number | null
          frames: number | null
          id: string
          quantity: number | null
          item_code: string
          thumbnail: string | null
          updated_at: string | null
          vendor_notes: string | null
          vfx_work_requirements: string | null
        }
        Insert: {
          bid_id: string
          cost_type?: string | null
          created_at?: string | null
          foreign_spend?: number | null
          frames?: number | null
          id?: string
          quantity?: number | null
          item_code: string
          thumbnail?: string | null
          updated_at?: string | null
          vendor_notes?: string | null
          vfx_work_requirements?: string | null
        }
        Update: {
          bid_id?: string
          cost_type?: string | null
          created_at?: string | null
          foreign_spend?: number | null
          frames?: number | null
          id?: string
          quantity?: number | null
          item_code?: string
          thumbnail?: string | null
          updated_at?: string | null
          vendor_notes?: string | null
          vfx_work_requirements?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bid_item_bid_id_fkey"
            columns: ["bid_id"]
            isOneToOne: false
            referencedRelation: "bids"
            referencedColumns: ["id"]
          },
        ]
      }
      bid_tasks: {
        Row: {
          bid_item_id: string
          created_at: string
          duration_days: number | null
          id: string
          notes: string | null
          task_id: number
        }
        Insert: {
          bid_item_id: string
          created_at?: string
          duration_days?: number | null
          id?: string
          notes?: string | null
          task_id: number
        }
        Update: {
          bid_item_id?: string
          created_at?: string
          duration_days?: number | null
          id?: string
          notes?: string | null
          task_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "bid_tasks_bid_item_id_fkey"
            columns: ["bid_item_id"]
            isOneToOne: false
            referencedRelation: "bid_item"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bid_tasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      bids: {
        Row: {
          created_at: string
          currency: string
          id: string
          name: string
          notes: string | null
          project_id: string
          status: string
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          currency?: string
          id?: string
          name: string
          notes?: string | null
          project_id: string
          status?: string
          updated_at?: string
          version?: number
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          name?: string
          notes?: string | null
          project_id?: string
          status?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "bids_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_members: {
        Row: {
          created_at: string
          project_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          project_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          project_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      project_statuses: {
        Row: {
          colour: string
          id: number
          name: string
        }
        Insert: {
          colour: string
          id?: never
          name: string
        }
        Update: {
          colour?: string
          id?: never
          name?: string
        }
        Relationships: []
      }
      project_task_rates: {
        Row: {
          created_at: string
          daily_rate: number
          id: string
          project_id: string
          task_id: number
        }
        Insert: {
          created_at?: string
          daily_rate?: number
          id?: string
          project_id: string
          task_id: number
        }
        Update: {
          created_at?: string
          daily_rate?: number
          id?: string
          project_id?: string
          task_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_rates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_rates_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          code: string
          created_at: string
          created_by: string | null
          current_award: number | null
          foreign_spend: number | null
          id: string
          name: string
          item_count: number | null
          status_id: number
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          created_by?: string | null
          current_award?: number | null
          foreign_spend?: number | null
          id?: string
          name: string
          item_count?: number | null
          status_id: number
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string | null
          current_award?: number | null
          foreign_spend?: number | null
          id?: string
          name?: string
          item_count?: number | null
          status_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_project_status"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "project_statuses"
            referencedColumns: ["id"]
          },
        ]
      }
      item_statuses: {
        Row: {
          colour: string
          id: number
          name: string
        }
        Insert: {
          colour: string
          id?: number
          name: string
        }
        Update: {
          colour?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      items: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          project_id: string
          thumbnail: string | null
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          project_id: string
          thumbnail?: string | null
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          project_id?: string
          thumbnail?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          active: boolean
          category: string
          colour: string
          created_at: string
          id: number
          name: string
          short_name: string
          sort_order: number
        }
        Insert: {
          active?: boolean
          category: string
          colour: string
          created_at?: string
          id?: number
          name: string
          short_name: string
          sort_order: number
        }
        Update: {
          active?: boolean
          category?: string
          colour?: string
          created_at?: string
          id?: number
          name?: string
          short_name?: string
          sort_order?: number
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          display_name: string
          email: string | null
          id: string
          updated_at: string
          user_group: Database["public"]["Enums"]["user_group"] | null
        }
        Insert: {
          created_at?: string
          display_name: string
          email?: string | null
          id: string
          updated_at?: string
          user_group?: Database["public"]["Enums"]["user_group"] | null
        }
        Update: {
          created_at?: string
          display_name?: string
          email?: string | null
          id?: string
          updated_at?: string
          user_group?: Database["public"]["Enums"]["user_group"] | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_edit_project: { Args: { project_uuid: string }; Returns: boolean }
      can_view_bid: { Args: { bid_uuid: string }; Returns: boolean }
      can_view_bid_item: { Args: { bid_item_uuid: string }; Returns: boolean }
      can_view_project: { Args: { project_uuid: string }; Returns: boolean }
    }
    Enums: {
      user_group: "admin" | "user"
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
      user_group: ["admin", "user"],
    },
  },
} as const
