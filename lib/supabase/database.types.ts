export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '14.5'
  }
  public: {
    Tables: {
      chapters: {
        Row: {
          created_at: string
          id: string
          label: string
          narration: string | null
          order: number
          scene_id: string
          scroll_anchor_y: number
          source_anchor_id: string | null
        }
        Insert: {
          created_at?: string
          id: string
          label: string
          narration?: string | null
          order: number
          scene_id: string
          scroll_anchor_y: number
          source_anchor_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          narration?: string | null
          order?: number
          scene_id?: string
          scroll_anchor_y?: number
          source_anchor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'chapters_scene_id_fkey'
            columns: ['scene_id']
            isOneToOne: false
            referencedRelation: 'scenes'
            referencedColumns: ['id']
          },
        ]
      }
      hotspots: {
        Row: {
          action_category: string | null
          action_label: string | null
          action_url: string | null
          chapter_id: string | null
          created_at: string
          geometry_r: number
          geometry_x: number
          geometry_y: number
          id: string
          label: string
          priority: string
          scene_id: string
          story_id: string | null
          type: string
          visual_state: string
        }
        Insert: {
          action_category?: string | null
          action_label?: string | null
          action_url?: string | null
          chapter_id?: string | null
          created_at?: string
          geometry_r: number
          geometry_x: number
          geometry_y: number
          id: string
          label: string
          priority: string
          scene_id: string
          story_id?: string | null
          type: string
          visual_state?: string
        }
        Update: {
          action_category?: string | null
          action_label?: string | null
          action_url?: string | null
          chapter_id?: string | null
          created_at?: string
          geometry_r?: number
          geometry_x?: number
          geometry_y?: number
          id?: string
          label?: string
          priority?: string
          scene_id?: string
          story_id?: string | null
          type?: string
          visual_state?: string
        }
        Relationships: [
          {
            foreignKeyName: 'hotspots_chapter_id_fkey'
            columns: ['chapter_id']
            isOneToOne: false
            referencedRelation: 'chapters'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'hotspots_scene_id_fkey'
            columns: ['scene_id']
            isOneToOne: false
            referencedRelation: 'scenes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'hotspots_story_id_fkey'
            columns: ['story_id']
            isOneToOne: false
            referencedRelation: 'stories'
            referencedColumns: ['id']
          },
        ]
      }
      image_metadata: {
        Row: {
          alt_text: string
          asset_path: string
          blur_data_url: string | null
          created_at: string
          credit_line: string | null
          desktop_crop: Json | null
          graphic_level: string
          height: number
          id: string
          is_generated: boolean
          license_type: string | null
          mobile_crop: Json | null
          parallax_blend_mode: string | null
          parallax_factor: number | null
          parallax_opacity: number | null
          reconstruction_label: string | null
          scene_id: string
          source_url: string | null
          variant: string
          width: number
        }
        Insert: {
          alt_text: string
          asset_path: string
          blur_data_url?: string | null
          created_at?: string
          credit_line?: string | null
          desktop_crop?: Json | null
          graphic_level?: string
          height: number
          id: string
          is_generated?: boolean
          license_type?: string | null
          mobile_crop?: Json | null
          parallax_blend_mode?: string | null
          parallax_factor?: number | null
          parallax_opacity?: number | null
          reconstruction_label?: string | null
          scene_id: string
          source_url?: string | null
          variant: string
          width: number
        }
        Update: {
          alt_text?: string
          asset_path?: string
          blur_data_url?: string | null
          created_at?: string
          credit_line?: string | null
          desktop_crop?: Json | null
          graphic_level?: string
          height?: number
          id?: string
          is_generated?: boolean
          license_type?: string | null
          mobile_crop?: Json | null
          parallax_blend_mode?: string | null
          parallax_factor?: number | null
          parallax_opacity?: number | null
          reconstruction_label?: string | null
          scene_id?: string
          source_url?: string | null
          variant?: string
          width?: number
        }
        Relationships: [
          {
            foreignKeyName: 'image_metadata_scene_id_fkey'
            columns: ['scene_id']
            isOneToOne: false
            referencedRelation: 'scenes'
            referencedColumns: ['id']
          },
        ]
      }
      scenes: {
        Row: {
          created_at: string
          default_before_after: string
          id: string
          is_published: boolean
          language: string
          slug: string
          title: string
          translation_group: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_before_after: string
          id: string
          is_published?: boolean
          language?: string
          slug: string
          title: string
          translation_group?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_before_after?: string
          id?: string
          is_published?: boolean
          language?: string
          slug?: string
          title?: string
          translation_group?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      source_registry: {
        Row: {
          acquisition_mode: string | null
          created_at: string
          fetched_at: string | null
          id: string
          published_at: string | null
          publisher: string
          raw_payload: Json | null
          title: string
          url: string
          url_hash: string
        }
        Insert: {
          acquisition_mode?: string | null
          created_at?: string
          fetched_at?: string | null
          id: string
          published_at?: string | null
          publisher: string
          raw_payload?: Json | null
          title: string
          url: string
          url_hash: string
        }
        Update: {
          acquisition_mode?: string | null
          created_at?: string
          fetched_at?: string | null
          id?: string
          published_at?: string | null
          publisher?: string
          raw_payload?: Json | null
          title?: string
          url?: string
          url_hash?: string
        }
        Relationships: []
      }
      stories: {
        Row: {
          body: string
          created_at: string
          graphic_level: string
          id: string
          is_published: boolean
          language: string
          short_summary: string
          title: string
          tone: string
          translation_group: string | null
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string
          graphic_level?: string
          id: string
          is_published?: boolean
          language?: string
          short_summary: string
          title: string
          tone?: string
          translation_group?: string | null
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          graphic_level?: string
          id?: string
          is_published?: boolean
          language?: string
          short_summary?: string
          title?: string
          tone?: string
          translation_group?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      story_sources: {
        Row: {
          ordering: number
          source_id: string
          story_id: string
        }
        Insert: {
          ordering?: number
          source_id: string
          story_id: string
        }
        Update: {
          ordering?: number
          source_id?: string
          story_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'story_sources_source_id_fkey'
            columns: ['source_id']
            isOneToOne: false
            referencedRelation: 'source_registry'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'story_sources_story_id_fkey'
            columns: ['story_id']
            isOneToOne: false
            referencedRelation: 'stories'
            referencedColumns: ['id']
          },
        ]
      }
      timeline_event_sources: {
        Row: {
          event_id: string
          source_id: string
        }
        Insert: {
          event_id: string
          source_id: string
        }
        Update: {
          event_id?: string
          source_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'timeline_event_sources_event_id_fkey'
            columns: ['event_id']
            isOneToOne: false
            referencedRelation: 'timeline_events'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'timeline_event_sources_source_id_fkey'
            columns: ['source_id']
            isOneToOne: false
            referencedRelation: 'source_registry'
            referencedColumns: ['id']
          },
        ]
      }
      timeline_events: {
        Row: {
          created_at: string
          date: string
          event_type: string
          id: string
          is_published: boolean
          scene_anchor_id: string | null
          summary: string
          title: string
          weight: number
        }
        Insert: {
          created_at?: string
          date: string
          event_type: string
          id: string
          is_published?: boolean
          scene_anchor_id?: string | null
          summary: string
          title: string
          weight?: number
        }
        Update: {
          created_at?: string
          date?: string
          event_type?: string
          id?: string
          is_published?: boolean
          scene_anchor_id?: string | null
          summary?: string
          title?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: 'timeline_events_scene_anchor_id_fkey'
            columns: ['scene_anchor_id']
            isOneToOne: false
            referencedRelation: 'scenes'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
