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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          created_at: string
          doctor_id: string | null
          hospital_id: string
          id: string
          notes: string | null
          patient_id: string
          reason: string | null
          status: string
          updated_at: string
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          created_at?: string
          doctor_id?: string | null
          hospital_id: string
          id?: string
          notes?: string | null
          patient_id: string
          reason?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          created_at?: string
          doctor_id?: string | null
          hospital_id?: string
          id?: string
          notes?: string | null
          patient_id?: string
          reason?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          available_days: string[] | null
          available_hours: string | null
          consultation_fee: number | null
          created_at: string
          experience_years: number | null
          hospital_id: string
          id: string
          name: string
          qualification: string | null
          specialization: string
          updated_at: string
        }
        Insert: {
          available_days?: string[] | null
          available_hours?: string | null
          consultation_fee?: number | null
          created_at?: string
          experience_years?: number | null
          hospital_id: string
          id?: string
          name: string
          qualification?: string | null
          specialization: string
          updated_at?: string
        }
        Update: {
          available_days?: string[] | null
          available_hours?: string | null
          consultation_fee?: number | null
          created_at?: string
          experience_years?: number | null
          hospital_id?: string
          id?: string
          name?: string
          qualification?: string | null
          specialization?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctors_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      emergency_alerts: {
        Row: {
          alert_type: string
          contact_number: string | null
          created_at: string
          description: string | null
          id: string
          location_id: string
          patient_id: string
          patient_location: string | null
          responded_by: string | null
          response_time: string | null
          status: string
        }
        Insert: {
          alert_type: string
          contact_number?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location_id: string
          patient_id: string
          patient_location?: string | null
          responded_by?: string | null
          response_time?: string | null
          status?: string
        }
        Update: {
          alert_type?: string
          contact_number?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location_id?: string
          patient_id?: string
          patient_location?: string | null
          responded_by?: string | null
          response_time?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "emergency_alerts_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emergency_alerts_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emergency_alerts_responded_by_fkey"
            columns: ["responded_by"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      hospitals: {
        Row: {
          address: string
          created_at: string
          email: string | null
          emergency_contact: string | null
          hospital_name: string
          id: string
          is_verified: boolean | null
          location_id: string
          phone: string
          profile_id: string
          specializations: string[] | null
          updated_at: string
        }
        Insert: {
          address: string
          created_at?: string
          email?: string | null
          emergency_contact?: string | null
          hospital_name: string
          id?: string
          is_verified?: boolean | null
          location_id: string
          phone: string
          profile_id: string
          specializations?: string[] | null
          updated_at?: string
        }
        Update: {
          address?: string
          created_at?: string
          email?: string | null
          emergency_contact?: string | null
          hospital_name?: string
          id?: string
          is_verified?: boolean | null
          location_id?: string
          phone?: string
          profile_id?: string
          specializations?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hospitals_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hospitals_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          created_at: string
          district: string | null
          id: string
          name: string
          state: string
          type: string
        }
        Insert: {
          created_at?: string
          district?: string | null
          id?: string
          name: string
          state: string
          type: string
        }
        Update: {
          created_at?: string
          district?: string | null
          id?: string
          name?: string
          state?: string
          type?: string
        }
        Relationships: []
      }
      medical_records: {
        Row: {
          appointment_id: string | null
          created_at: string
          diagnosis: string | null
          doctor_id: string | null
          hospital_id: string
          id: string
          lab_results: string | null
          medications: string[] | null
          notes: string | null
          patient_id: string
          treatment: string | null
          visit_date: string
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string
          diagnosis?: string | null
          doctor_id?: string | null
          hospital_id: string
          id?: string
          lab_results?: string | null
          medications?: string[] | null
          notes?: string | null
          patient_id: string
          treatment?: string | null
          visit_date: string
        }
        Update: {
          appointment_id?: string | null
          created_at?: string
          diagnosis?: string | null
          doctor_id?: string | null
          hospital_id?: string
          id?: string
          lab_results?: string | null
          medications?: string[] | null
          notes?: string | null
          patient_id?: string
          treatment?: string | null
          visit_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "medical_records_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_records_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_records_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          allergies: string[] | null
          blood_group: string | null
          created_at: string
          date_of_birth: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          gender: string | null
          id: string
          medical_conditions: string[] | null
          profile_id: string
          updated_at: string
        }
        Insert: {
          allergies?: string[] | null
          blood_group?: string | null
          created_at?: string
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          gender?: string | null
          id?: string
          medical_conditions?: string[] | null
          profile_id: string
          updated_at?: string
        }
        Update: {
          allergies?: string[] | null
          blood_group?: string | null
          created_at?: string
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          gender?: string | null
          id?: string
          medical_conditions?: string[] | null
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patients_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          id: string
          location_id: string | null
          phone: string | null
          updated_at: string
          user_id: string
          user_type: string
          username: string
        }
        Insert: {
          created_at?: string
          full_name: string
          id?: string
          location_id?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
          user_type: string
          username: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          location_id?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
          user_type?: string
          username?: string
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
