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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      banners: {
        Row: {
          created_at: string
          id: string
          image: string
          link: string
          subtitle: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          image?: string
          link?: string
          subtitle?: string
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          image?: string
          link?: string
          subtitle?: string
          title?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          image: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          image?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          image?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          code: string
          created_at: string
          discount: number
          expires_at: string
          id: string
          is_active: boolean
        }
        Insert: {
          code: string
          created_at?: string
          discount?: number
          expires_at: string
          id?: string
          is_active?: boolean
        }
        Update: {
          code?: string
          created_at?: string
          discount?: number
          expires_at?: string
          id?: string
          is_active?: boolean
        }
        Relationships: []
      }
      orders: {
        Row: {
          address: string
          created_at: string
          customer_name: string
          email: string
          id: string
          items: Json
          order_id: string
          payment_id: string | null
          phone: string
          status: string
          total: number
          user_id: string | null
        }
        Insert: {
          address: string
          created_at?: string
          customer_name: string
          email: string
          id?: string
          items?: Json
          order_id: string
          payment_id?: string | null
          phone: string
          status?: string
          total: number
          user_id?: string | null
        }
        Update: {
          address?: string
          created_at?: string
          customer_name?: string
          email?: string
          id?: string
          items?: Json
          order_id?: string
          payment_id?: string | null
          phone?: string
          status?: string
          total?: number
          user_id?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          colors: string[]
          created_at: string
          description: string
          id: string
          images: string[]
          in_stock: boolean
          is_fast_selling: boolean
          is_new_arrival: boolean
          name: string
          original_price: number | null
          price: number
          rating: number
          reviews: number
          sizes: string[]
          updated_at: string
        }
        Insert: {
          category?: string
          colors?: string[]
          created_at?: string
          description?: string
          id?: string
          images?: string[]
          in_stock?: boolean
          is_fast_selling?: boolean
          is_new_arrival?: boolean
          name: string
          original_price?: number | null
          price: number
          rating?: number
          reviews?: number
          sizes?: string[]
          updated_at?: string
        }
        Update: {
          category?: string
          colors?: string[]
          created_at?: string
          description?: string
          id?: string
          images?: string[]
          in_stock?: boolean
          is_fast_selling?: boolean
          is_new_arrival?: boolean
          name?: string
          original_price?: number | null
          price?: number
          rating?: number
          reviews?: number
          sizes?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
