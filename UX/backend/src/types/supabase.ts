export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      booked_item: {
        Row: {
          booking_id: string
          created_at: string
          id: string
          item_id: string
          quantity: number
          user_id: string
        }
        Insert: {
          booking_id: string
          created_at?: string
          id?: string
          item_id: string
          quantity: number
          user_id: string
        }
        Update: {
          booking_id?: string
          created_at?: string
          id?: string
          item_id?: string
          quantity?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "booked_item_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["booking_id"]
          },
          {
            foreignKeyName: "booked_item_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "booked_item_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_id: string
          created_at: string | null
          end_date: string
          item_id: string
          start_date: string
          status: string
          user_id: string
        }
        Insert: {
          booking_id?: string
          created_at?: string | null
          end_date: string
          item_id?: string
          start_date: string
          status: string
          user_id?: string
        }
        Update: {
          booking_id?: string
          created_at?: string | null
          end_date?: string
          item_id?: string
          start_date?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      categories: {
        Row: {
          category_id: string
          category_name: string | null
          created_at: string | null
          description: string | null
        }
        Insert: {
          category_id?: string
          category_name?: string | null
          created_at?: string | null
          description?: string | null
        }
        Update: {
          category_id?: string
          category_name?: string | null
          created_at?: string | null
          description?: string | null
        }
        Relationships: []
      }
      item_tags: {
        Row: {
          created_at: string
          item_id: string
          tag_id: string | null
        }
        Insert: {
          created_at?: string
          item_id: string
          tag_id?: string | null
        }
        Update: {
          created_at?: string
          item_id?: string
          tag_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "item_tags_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: true
            referencedRelation: "items"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "item_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["tag_id"]
          },
        ]
      }
      items: {
        Row: {
          category_id: string
          created_at: string | null
          description: string | null
          image_path: string | null
          item_id: string
          item_name: string
          location: string
          quantity: number
        }
        Insert: {
          category_id: string
          created_at?: string | null
          description?: string | null
          image_path?: string | null
          item_id?: string
          item_name: string
          location: string
          quantity: number
        }
        Update: {
          category_id?: string
          created_at?: string | null
          description?: string | null
          image_path?: string | null
          item_id?: string
          item_name?: string
          location?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["category_id"]
          },
        ]
      }
      roles: {
        Row: {
          id: string
          role_title: string
        }
        Insert: {
          id?: string
          role_title: string
        }
        Update: {
          id?: string
          role_title?: string
        }
        Relationships: []
      }
      system_logs: {
        Row: {
          action: string | null
          created_at: string | null
          details: string | null
          log_id: string
          user_id: string
        }
        Insert: {
          action?: string | null
          created_at?: string | null
          details?: string | null
          log_id?: string
          user_id?: string
        }
        Update: {
          action?: string | null
          created_at?: string | null
          details?: string | null
          log_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "system_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      tags: {
        Row: {
          created_at: string | null
          description: string | null
          tag_id: string
          tag_name: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          tag_id?: string
          tag_name?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          tag_id?: string
          tag_name?: string | null
        }
        Relationships: []
      }
      test: {
        Row: {
          created_at: string
          id: number
          text: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          text?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          text?: string | null
        }
        Relationships: []
      }
      test_data: {
        Row: {
          Content_summary: string | null
          Description: string | null
          id: string
          quantity: number | null
          Storage_details: string | null
          Storage_location: string | null
        }
        Insert: {
          Content_summary?: string | null
          Description?: string | null
          id?: string
          quantity?: number | null
          Storage_details?: string | null
          Storage_location?: string | null
        }
        Update: {
          Content_summary?: string | null
          Description?: string | null
          id?: string
          quantity?: number | null
          Storage_details?: string | null
          Storage_location?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          role_id: string
          user_id: string
        }
        Insert: {
          role_id: string
          user_id: string
        }
        Update: {
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      users: {
        Row: {
          display_name: string | null
          email: string
          user_id: string
        }
        Insert: {
          display_name?: string | null
          email?: string
          user_id?: string
        }
        Update: {
          display_name?: string | null
          email?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: {
          p_user_id: string
        }
        Returns: string
      }
      is_user_admin: {
        Args: {
          p_user_id: string
        }
        Returns: boolean
      }
      update_user_role: {
        Args: {
          p_user_id: string
          p_role_title: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
