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
      activity_log: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      alerts: {
        Row: {
          affected_user_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          priority: Database["public"]["Enums"]["message_priority"]
          resolved_at: string | null
          resolved_by: string | null
          status: Database["public"]["Enums"]["alert_status"]
          territory_id: string | null
          title: string
          type: Database["public"]["Enums"]["alert_type"]
          updated_at: string
          visible_to_voters: boolean | null
        }
        Insert: {
          affected_user_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["message_priority"]
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["alert_status"]
          territory_id?: string | null
          title: string
          type: Database["public"]["Enums"]["alert_type"]
          updated_at?: string
          visible_to_voters?: boolean | null
        }
        Update: {
          affected_user_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["message_priority"]
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["alert_status"]
          territory_id?: string | null
          title?: string
          type?: Database["public"]["Enums"]["alert_type"]
          updated_at?: string
          visible_to_voters?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "alerts_affected_user_id_fkey"
            columns: ["affected_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_territory_id_fkey"
            columns: ["territory_id"]
            isOneToOne: false
            referencedRelation: "territories"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_rules: {
        Row: {
          acciones: Json
          activa: boolean | null
          condiciones: Json
          created_at: string | null
          created_by: string | null
          descripcion: string | null
          ejecutada_veces: number | null
          id: string
          nombre: string
          ultima_ejecucion: string | null
          updated_at: string | null
        }
        Insert: {
          acciones: Json
          activa?: boolean | null
          condiciones: Json
          created_at?: string | null
          created_by?: string | null
          descripcion?: string | null
          ejecutada_veces?: number | null
          id?: string
          nombre: string
          ultima_ejecucion?: string | null
          updated_at?: string | null
        }
        Update: {
          acciones?: Json
          activa?: boolean | null
          condiciones?: Json
          created_at?: string | null
          created_by?: string | null
          descripcion?: string | null
          ejecutada_veces?: number | null
          id?: string
          nombre?: string
          ultima_ejecucion?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "automation_rules_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      candidates: {
        Row: {
          apellido: string
          biografia: string | null
          cargo: string
          created_at: string | null
          created_by: string | null
          foto_url: string | null
          id: string
          nombre: string
          partido: string | null
          propuestas: Json | null
          redes_sociales: Json | null
          territorio_id: string | null
          updated_at: string | null
        }
        Insert: {
          apellido: string
          biografia?: string | null
          cargo: string
          created_at?: string | null
          created_by?: string | null
          foto_url?: string | null
          id?: string
          nombre: string
          partido?: string | null
          propuestas?: Json | null
          redes_sociales?: Json | null
          territorio_id?: string | null
          updated_at?: string | null
        }
        Update: {
          apellido?: string
          biografia?: string | null
          cargo?: string
          created_at?: string | null
          created_by?: string | null
          foto_url?: string | null
          id?: string
          nombre?: string
          partido?: string | null
          propuestas?: Json | null
          redes_sociales?: Json | null
          territorio_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidates_territorio_id_fkey"
            columns: ["territorio_id"]
            isOneToOne: false
            referencedRelation: "territories"
            referencedColumns: ["id"]
          },
        ]
      }
      electoral_campaigns: {
        Row: {
          audiencia_objetivo: Json | null
          candidate_id: string | null
          created_at: string | null
          created_by: string | null
          estado: Database["public"]["Enums"]["campaign_status"] | null
          fecha_fin: string | null
          fecha_inicio: string | null
          gasto_actual: number | null
          id: string
          mensaje_principal: string | null
          nombre: string
          presupuesto: number | null
          roi: number | null
          territorio_id: string | null
          tipo: string
          updated_at: string | null
        }
        Insert: {
          audiencia_objetivo?: Json | null
          candidate_id?: string | null
          created_at?: string | null
          created_by?: string | null
          estado?: Database["public"]["Enums"]["campaign_status"] | null
          fecha_fin?: string | null
          fecha_inicio?: string | null
          gasto_actual?: number | null
          id?: string
          mensaje_principal?: string | null
          nombre: string
          presupuesto?: number | null
          roi?: number | null
          territorio_id?: string | null
          tipo: string
          updated_at?: string | null
        }
        Update: {
          audiencia_objetivo?: Json | null
          candidate_id?: string | null
          created_at?: string | null
          created_by?: string | null
          estado?: Database["public"]["Enums"]["campaign_status"] | null
          fecha_fin?: string | null
          fecha_inicio?: string | null
          gasto_actual?: number | null
          id?: string
          mensaje_principal?: string | null
          nombre?: string
          presupuesto?: number | null
          roi?: number | null
          territorio_id?: string | null
          tipo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "electoral_campaigns_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "electoral_campaigns_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "electoral_campaigns_territorio_id_fkey"
            columns: ["territorio_id"]
            isOneToOne: false
            referencedRelation: "territories"
            referencedColumns: ["id"]
          },
        ]
      }
      electoral_interactions: {
        Row: {
          canal: string
          candidate_id: string | null
          costo: number | null
          created_at: string | null
          duracion_minutos: number | null
          efectividad: number | null
          exitosa: boolean | null
          id: string
          mensaje: string | null
          proxima_accion: string | null
          respuesta: string | null
          seguimiento_requerido: boolean | null
          sentiment_level: Database["public"]["Enums"]["sentiment_level"] | null
          sentiment_score: number | null
          tipo_interaccion: Database["public"]["Enums"]["interaction_type"]
          user_id: string | null
          voter_id: string | null
        }
        Insert: {
          canal: string
          candidate_id?: string | null
          costo?: number | null
          created_at?: string | null
          duracion_minutos?: number | null
          efectividad?: number | null
          exitosa?: boolean | null
          id?: string
          mensaje?: string | null
          proxima_accion?: string | null
          respuesta?: string | null
          seguimiento_requerido?: boolean | null
          sentiment_level?:
            | Database["public"]["Enums"]["sentiment_level"]
            | null
          sentiment_score?: number | null
          tipo_interaccion: Database["public"]["Enums"]["interaction_type"]
          user_id?: string | null
          voter_id?: string | null
        }
        Update: {
          canal?: string
          candidate_id?: string | null
          costo?: number | null
          created_at?: string | null
          duracion_minutos?: number | null
          efectividad?: number | null
          exitosa?: boolean | null
          id?: string
          mensaje?: string | null
          proxima_accion?: string | null
          respuesta?: string | null
          seguimiento_requerido?: boolean | null
          sentiment_level?:
            | Database["public"]["Enums"]["sentiment_level"]
            | null
          sentiment_score?: number | null
          tipo_interaccion?: Database["public"]["Enums"]["interaction_type"]
          user_id?: string | null
          voter_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "electoral_interactions_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "electoral_interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "electoral_interactions_voter_id_fkey"
            columns: ["voter_id"]
            isOneToOne: false
            referencedRelation: "electoral_voters"
            referencedColumns: ["id"]
          },
        ]
      }
      electoral_metrics: {
        Row: {
          candidate_id: string | null
          contactos_exitosos: number | null
          conversiones: number | null
          costo_total: number | null
          created_at: string | null
          fecha: string | null
          id: string
          proyeccion_votos: number | null
          roi: number | null
          sentiment_promedio: number | null
          tasa_conversion: number | null
          territory_id: string | null
          total_contactos: number | null
          updated_at: string | null
        }
        Insert: {
          candidate_id?: string | null
          contactos_exitosos?: number | null
          conversiones?: number | null
          costo_total?: number | null
          created_at?: string | null
          fecha?: string | null
          id?: string
          proyeccion_votos?: number | null
          roi?: number | null
          sentiment_promedio?: number | null
          tasa_conversion?: number | null
          territory_id?: string | null
          total_contactos?: number | null
          updated_at?: string | null
        }
        Update: {
          candidate_id?: string | null
          contactos_exitosos?: number | null
          conversiones?: number | null
          costo_total?: number | null
          created_at?: string | null
          fecha?: string | null
          id?: string
          proyeccion_votos?: number | null
          roi?: number | null
          sentiment_promedio?: number | null
          tasa_conversion?: number | null
          territory_id?: string | null
          total_contactos?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "electoral_metrics_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "electoral_metrics_territory_id_fkey"
            columns: ["territory_id"]
            isOneToOne: false
            referencedRelation: "territories"
            referencedColumns: ["id"]
          },
        ]
      }
      electoral_voters: {
        Row: {
          apellido: string
          barrio: string | null
          canal_contacto: string | null
          cedula: string | null
          ciudad: string | null
          comuna: string | null
          created_at: string | null
          direccion: string | null
          edad: number | null
          email: string | null
          estado_civil: string | null
          estrato: number | null
          genero: string | null
          id: string
          intencion_voto: string | null
          nivel_educativo: string | null
          nombre: string
          notas: string | null
          probabilidad_voto: number | null
          profesion: string | null
          status: Database["public"]["Enums"]["voter_status"] | null
          telefono: string | null
          territorio_asignado: string | null
          ultima_interaccion: string | null
          updated_at: string | null
        }
        Insert: {
          apellido: string
          barrio?: string | null
          canal_contacto?: string | null
          cedula?: string | null
          ciudad?: string | null
          comuna?: string | null
          created_at?: string | null
          direccion?: string | null
          edad?: number | null
          email?: string | null
          estado_civil?: string | null
          estrato?: number | null
          genero?: string | null
          id?: string
          intencion_voto?: string | null
          nivel_educativo?: string | null
          nombre: string
          notas?: string | null
          probabilidad_voto?: number | null
          profesion?: string | null
          status?: Database["public"]["Enums"]["voter_status"] | null
          telefono?: string | null
          territorio_asignado?: string | null
          ultima_interaccion?: string | null
          updated_at?: string | null
        }
        Update: {
          apellido?: string
          barrio?: string | null
          canal_contacto?: string | null
          cedula?: string | null
          ciudad?: string | null
          comuna?: string | null
          created_at?: string | null
          direccion?: string | null
          edad?: number | null
          email?: string | null
          estado_civil?: string | null
          estrato?: number | null
          genero?: string | null
          id?: string
          intencion_voto?: string | null
          nivel_educativo?: string | null
          nombre?: string
          notas?: string | null
          probabilidad_voto?: number | null
          profesion?: string | null
          status?: Database["public"]["Enums"]["voter_status"] | null
          telefono?: string | null
          territorio_asignado?: string | null
          ultima_interaccion?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "electoral_voters_territorio_asignado_fkey"
            columns: ["territorio_asignado"]
            isOneToOne: false
            referencedRelation: "territories"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          actual_attendees: number | null
          budget_allocated: number | null
          budget_spent: number | null
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string
          expected_attendees: number | null
          id: string
          location: string | null
          responsible_user_id: string | null
          start_date: string
          status: Database["public"]["Enums"]["event_status"]
          territory_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          actual_attendees?: number | null
          budget_allocated?: number | null
          budget_spent?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date: string
          expected_attendees?: number | null
          id?: string
          location?: string | null
          responsible_user_id?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["event_status"]
          territory_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          actual_attendees?: number | null
          budget_allocated?: number | null
          budget_spent?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string
          expected_attendees?: number | null
          id?: string
          location?: string | null
          responsible_user_id?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["event_status"]
          territory_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_responsible_user_id_fkey"
            columns: ["responsible_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_territory_id_fkey"
            columns: ["territory_id"]
            isOneToOne: false
            referencedRelation: "territories"
            referencedColumns: ["id"]
          },
        ]
      }
      message_recipients: {
        Row: {
          created_at: string
          delivered_at: string | null
          id: string
          message_id: string
          read_at: string | null
          recipient_id: string
          replied_at: string | null
        }
        Insert: {
          created_at?: string
          delivered_at?: string | null
          id?: string
          message_id: string
          read_at?: string | null
          recipient_id: string
          replied_at?: string | null
        }
        Update: {
          created_at?: string
          delivered_at?: string | null
          id?: string
          message_id?: string
          read_at?: string | null
          recipient_id?: string
          replied_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_recipients_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_recipients_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          category: Database["public"]["Enums"]["message_category"]
          content: string
          created_at: string
          id: string
          priority: Database["public"]["Enums"]["message_priority"]
          scheduled_for: string | null
          sender_id: string
          sent_at: string | null
          status: Database["public"]["Enums"]["message_status"]
          subject: string
          territory_id: string | null
          updated_at: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["message_category"]
          content: string
          created_at?: string
          id?: string
          priority?: Database["public"]["Enums"]["message_priority"]
          scheduled_for?: string | null
          sender_id: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["message_status"]
          subject: string
          territory_id?: string | null
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["message_category"]
          content?: string
          created_at?: string
          id?: string
          priority?: Database["public"]["Enums"]["message_priority"]
          scheduled_for?: string | null
          sender_id?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["message_status"]
          subject?: string
          territory_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_territory_id_fkey"
            columns: ["territory_id"]
            isOneToOne: false
            referencedRelation: "territories"
            referencedColumns: ["id"]
          },
        ]
      }
      n8n_workflows: {
        Row: {
          active: boolean | null
          created_at: string
          created_by: string | null
          id: string
          trigger_role: string[] | null
          webhook_url: string | null
          workflow_id: string
          workflow_name: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          created_by?: string | null
          id?: string
          trigger_role?: string[] | null
          webhook_url?: string | null
          workflow_id: string
          workflow_name: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          created_by?: string | null
          id?: string
          trigger_role?: string[] | null
          webhook_url?: string | null
          workflow_id?: string
          workflow_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "n8n_workflows_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          name: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id: string
          name?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          content: Json
          created_at: string
          created_by: string | null
          event_id: string | null
          id: string
          period_end: string | null
          period_start: string | null
          territory_id: string | null
          title: string
          type: Database["public"]["Enums"]["report_type"]
          updated_at: string
        }
        Insert: {
          content: Json
          created_at?: string
          created_by?: string | null
          event_id?: string | null
          id?: string
          period_end?: string | null
          period_start?: string | null
          territory_id?: string | null
          title: string
          type: Database["public"]["Enums"]["report_type"]
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          created_by?: string | null
          event_id?: string | null
          id?: string
          period_end?: string | null
          period_start?: string | null
          territory_id?: string | null
          title?: string
          type?: Database["public"]["Enums"]["report_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_territory_id_fkey"
            columns: ["territory_id"]
            isOneToOne: false
            referencedRelation: "territories"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_bookings: {
        Row: {
          booked_by: string
          created_at: string
          end_date: string
          event_id: string | null
          id: string
          purpose: string | null
          quantity: number | null
          resource_id: string
          start_date: string
          status: string | null
          updated_at: string
        }
        Insert: {
          booked_by: string
          created_at?: string
          end_date: string
          event_id?: string | null
          id?: string
          purpose?: string | null
          quantity?: number | null
          resource_id: string
          start_date: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          booked_by?: string
          created_at?: string
          end_date?: string
          event_id?: string | null
          id?: string
          purpose?: string | null
          quantity?: number | null
          resource_id?: string
          start_date?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_bookings_booked_by_fkey"
            columns: ["booked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resource_bookings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resource_bookings_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          available_quantity: number | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
          quantity: number | null
          responsible_user_id: string | null
          territory_id: string | null
          type: string
          updated_at: string
        }
        Insert: {
          available_quantity?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          quantity?: number | null
          responsible_user_id?: string | null
          territory_id?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          available_quantity?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          quantity?: number | null
          responsible_user_id?: string | null
          territory_id?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "resources_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resources_responsible_user_id_fkey"
            columns: ["responsible_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resources_territory_id_fkey"
            columns: ["territory_id"]
            isOneToOne: false
            referencedRelation: "territories"
            referencedColumns: ["id"]
          },
        ]
      }
      system_config: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          key: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      system_logs: {
        Row: {
          category: string
          details: Json | null
          id: string
          ip_address: unknown | null
          level: string
          message: string
          resolved: boolean | null
          resolved_at: string | null
          resolved_by: string | null
          session_id: string | null
          stack_trace: string | null
          timestamp: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          category: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          level: string
          message: string
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          session_id?: string | null
          stack_trace?: string | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          level?: string
          message?: string
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          session_id?: string | null
          stack_trace?: string | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_by: string | null
          assigned_to: string | null
          completed_at: string | null
          completion_notes: string | null
          created_at: string
          description: string | null
          due_date: string | null
          event_id: string | null
          id: string
          priority: Database["public"]["Enums"]["message_priority"]
          status: string | null
          territory_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          assigned_by?: string | null
          assigned_to?: string | null
          completed_at?: string | null
          completion_notes?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          event_id?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["message_priority"]
          status?: string | null
          territory_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          assigned_by?: string | null
          assigned_to?: string | null
          completed_at?: string | null
          completion_notes?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          event_id?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["message_priority"]
          status?: string | null
          territory_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_territory_id_fkey"
            columns: ["territory_id"]
            isOneToOne: false
            referencedRelation: "territories"
            referencedColumns: ["id"]
          },
        ]
      }
      territories: {
        Row: {
          coordinates: Json | null
          created_at: string
          created_by: string | null
          id: string
          name: string
          parent_id: string | null
          population_estimate: number | null
          responsible_user_id: string | null
          type: Database["public"]["Enums"]["territory_type"]
          updated_at: string
          voter_estimate: number | null
        }
        Insert: {
          coordinates?: Json | null
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          parent_id?: string | null
          population_estimate?: number | null
          responsible_user_id?: string | null
          type: Database["public"]["Enums"]["territory_type"]
          updated_at?: string
          voter_estimate?: number | null
        }
        Update: {
          coordinates?: Json | null
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          population_estimate?: number | null
          responsible_user_id?: string | null
          type?: Database["public"]["Enums"]["territory_type"]
          updated_at?: string
          voter_estimate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "territories_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "territories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "territories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "territories_responsible_user_id_fkey"
            columns: ["responsible_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_hierarchies: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          subordinate_id: string | null
          superior_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          subordinate_id?: string | null
          superior_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          subordinate_id?: string | null
          superior_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_hierarchies_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_hierarchies_subordinate_id_fkey"
            columns: ["subordinate_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_hierarchies_superior_id_fkey"
            columns: ["superior_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      voters: {
        Row: {
          address: string | null
          cedula: string | null
          commitment_level: number | null
          created_at: string
          email: string | null
          id: string
          last_contact: string | null
          name: string
          notes: string | null
          phone: string | null
          registered_by: string | null
          territory_id: string | null
          updated_at: string
          voting_place: string | null
          voting_table: string | null
        }
        Insert: {
          address?: string | null
          cedula?: string | null
          commitment_level?: number | null
          created_at?: string
          email?: string | null
          id?: string
          last_contact?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          registered_by?: string | null
          territory_id?: string | null
          updated_at?: string
          voting_place?: string | null
          voting_table?: string | null
        }
        Update: {
          address?: string | null
          cedula?: string | null
          commitment_level?: number | null
          created_at?: string
          email?: string | null
          id?: string
          last_contact?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          registered_by?: string | null
          territory_id?: string | null
          updated_at?: string
          voting_place?: string | null
          voting_table?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "voters_registered_by_fkey"
            columns: ["registered_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "voters_territory_id_fkey"
            columns: ["territory_id"]
            isOneToOne: false
            referencedRelation: "territories"
            referencedColumns: ["id"]
          },
        ]
      }
      voting_tables: {
        Row: {
          active: boolean | null
          address: string | null
          coordinates: Json | null
          created_at: string
          created_by: string | null
          id: string
          responsible_leader_id: string | null
          table_number: string
          territory_id: string | null
          updated_at: string
          voting_place: string
        }
        Insert: {
          active?: boolean | null
          address?: string | null
          coordinates?: Json | null
          created_at?: string
          created_by?: string | null
          id?: string
          responsible_leader_id?: string | null
          table_number: string
          territory_id?: string | null
          updated_at?: string
          voting_place: string
        }
        Update: {
          active?: boolean | null
          address?: string | null
          coordinates?: Json | null
          created_at?: string
          created_by?: string | null
          id?: string
          responsible_leader_id?: string | null
          table_number?: string
          territory_id?: string | null
          updated_at?: string
          voting_place?: string
        }
        Relationships: [
          {
            foreignKeyName: "voting_tables_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "voting_tables_responsible_leader_id_fkey"
            columns: ["responsible_leader_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "voting_tables_territory_id_fkey"
            columns: ["territory_id"]
            isOneToOne: false
            referencedRelation: "territories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_manage_user: {
        Args: { manager_id: string; target_id: string }
        Returns: boolean
      }
      create_demo_users: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_email: {
        Args: { user_id: string }
        Returns: string
      }
      get_user_subordinates: {
        Args: { user_id: string }
        Returns: {
          subordinate_id: string
          subordinate_name: string
          subordinate_role: string
        }[]
      }
      log_system_event: {
        Args: {
          p_level: string
          p_category: string
          p_message: string
          p_details?: Json
          p_user_id?: string
        }
        Returns: string
      }
    }
    Enums: {
      alert_status: "active" | "resolved" | "dismissed"
      alert_type:
        | "security"
        | "logistics"
        | "political"
        | "emergency"
        | "information"
      campaign_status: "planificada" | "activa" | "pausada" | "completada"
      event_status:
        | "planned"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "cancelled"
      interaction_type:
        | "llamada"
        | "whatsapp"
        | "sms"
        | "email"
        | "presencial"
        | "web"
      message_category:
        | "general"
        | "coordination"
        | "event"
        | "emergency"
        | "campaign"
      message_priority: "low" | "medium" | "high" | "urgent"
      message_status: "draft" | "sent" | "delivered" | "read" | "replied"
      report_type: "daily" | "weekly" | "event" | "incident" | "progress"
      sentiment_level:
        | "muy_negativo"
        | "negativo"
        | "neutral"
        | "positivo"
        | "muy_positivo"
      territory_type:
        | "departamento"
        | "municipio"
        | "corregimiento"
        | "vereda"
        | "barrio"
        | "sector"
      user_role:
        | "desarrollador"
        | "master"
        | "candidato"
        | "lider"
        | "votante"
        | "visitante"
      voter_status: "activo" | "inactivo" | "contactado" | "convertido"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      alert_status: ["active", "resolved", "dismissed"],
      alert_type: [
        "security",
        "logistics",
        "political",
        "emergency",
        "information",
      ],
      campaign_status: ["planificada", "activa", "pausada", "completada"],
      event_status: [
        "planned",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
      ],
      interaction_type: [
        "llamada",
        "whatsapp",
        "sms",
        "email",
        "presencial",
        "web",
      ],
      message_category: [
        "general",
        "coordination",
        "event",
        "emergency",
        "campaign",
      ],
      message_priority: ["low", "medium", "high", "urgent"],
      message_status: ["draft", "sent", "delivered", "read", "replied"],
      report_type: ["daily", "weekly", "event", "incident", "progress"],
      sentiment_level: [
        "muy_negativo",
        "negativo",
        "neutral",
        "positivo",
        "muy_positivo",
      ],
      territory_type: [
        "departamento",
        "municipio",
        "corregimiento",
        "vereda",
        "barrio",
        "sector",
      ],
      user_role: [
        "desarrollador",
        "master",
        "candidato",
        "lider",
        "votante",
        "visitante",
      ],
      voter_status: ["activo", "inactivo", "contactado", "convertido"],
    },
  },
} as const
