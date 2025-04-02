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
      badges: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          name: string
          points: number
        }
        Insert: {
          created_at?: string
          description: string
          icon: string
          id?: string
          name: string
          points?: number
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          points?: number
        }
        Relationships: []
      }
      certificates: {
        Row: {
          certificate_url: string
          course_id: string
          id: string
          issued_at: string
          user_id: string
        }
        Insert: {
          certificate_url: string
          course_id: string
          id?: string
          issued_at?: string
          user_id: string
        }
        Update: {
          certificate_url?: string
          course_id?: string
          id?: string
          issued_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          created_at: string
          description: string
          end_date: string
          id: string
          points: number
          start_date: string
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          description: string
          end_date: string
          id?: string
          points?: number
          start_date: string
          title: string
          type: string
        }
        Update: {
          created_at?: string
          description?: string
          end_date?: string
          id?: string
          points?: number
          start_date?: string
          title?: string
          type?: string
        }
        Relationships: []
      }
      coding_exercises: {
        Row: {
          created_at: string
          description: string
          difficulty: string | null
          expected_output: string | null
          hints: string[] | null
          id: string
          module_id: string
          starter_code: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          difficulty?: string | null
          expected_output?: string | null
          hints?: string[] | null
          id?: string
          module_id: string
          starter_code?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          difficulty?: string | null
          expected_output?: string | null
          hints?: string[] | null
          id?: string
          module_id?: string
          starter_code?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "coding_exercises_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      coding_quiz: {
        Row: {
          correct_answer: string
          created_at: string | null
          difficulty: string | null
          explanation: string | null
          id: string
          language: string | null
          option1: string
          option2: string
          option3: string
          question: string
        }
        Insert: {
          correct_answer: string
          created_at?: string | null
          difficulty?: string | null
          explanation?: string | null
          id?: string
          language?: string | null
          option1: string
          option2: string
          option3: string
          question: string
        }
        Update: {
          correct_answer?: string
          created_at?: string | null
          difficulty?: string | null
          explanation?: string | null
          id?: string
          language?: string | null
          option1?: string
          option2?: string
          option3?: string
          question?: string
        }
        Relationships: []
      }
      course_lessons: {
        Row: {
          content: string | null
          created_at: string
          id: string
          is_published: boolean | null
          module_id: string
          order_index: number
          requires_completion: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          is_published?: boolean | null
          module_id: string
          order_index: number
          requires_completion?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          is_published?: boolean | null
          module_id?: string
          order_index?: number
          requires_completion?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      course_materials: {
        Row: {
          content_url: string
          course_id: string | null
          created_at: string
          id: string
          order_index: number
          title: string
          type: string
        }
        Insert: {
          content_url: string
          course_id?: string | null
          created_at?: string
          id?: string
          order_index: number
          title: string
          type: string
        }
        Update: {
          content_url?: string
          course_id?: string | null
          created_at?: string
          id?: string
          order_index?: number
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_materials_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_modules: {
        Row: {
          content: string | null
          created_at: string
          description: string | null
          difficulty: string | null
          estimated_duration: string | null
          id: string
          language_id: string
          order_index: number
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          estimated_duration?: string | null
          id?: string
          language_id: string
          order_index: number
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          estimated_duration?: string | null
          id?: string
          language_id?: string
          order_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "programming_languages"
            referencedColumns: ["id"]
          },
        ]
      }
      course_resources: {
        Row: {
          course_id: string | null
          created_at: string | null
          description: string | null
          file_url: string
          id: string
          order_index: number
          title: string
          type: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          file_url: string
          id?: string
          order_index: number
          title: string
          type?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          file_url?: string
          id?: string
          order_index?: number
          title?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_resources_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: Database["public"]["Enums"]["course_category"]
          created_at: string
          description: string | null
          difficulty: Database["public"]["Enums"]["course_difficulty"]
          id: string
          path: Database["public"]["Enums"]["course_path"]
          teacher_id: string
          title: string
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["course_category"]
          created_at?: string
          description?: string | null
          difficulty: Database["public"]["Enums"]["course_difficulty"]
          id?: string
          path: Database["public"]["Enums"]["course_path"]
          teacher_id: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["course_category"]
          created_at?: string
          description?: string | null
          difficulty?: Database["public"]["Enums"]["course_difficulty"]
          id?: string
          path?: Database["public"]["Enums"]["course_path"]
          teacher_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          created_at: string
          description: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          id: string
          status: Database["public"]["Enums"]["exercise_status"]
          teacher_id: string
          time_limit: number | null
          title: string
          type: Database["public"]["Enums"]["exercise_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          id?: string
          status?: Database["public"]["Enums"]["exercise_status"]
          teacher_id: string
          time_limit?: number | null
          title: string
          type: Database["public"]["Enums"]["exercise_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          id?: string
          status?: Database["public"]["Enums"]["exercise_status"]
          teacher_id?: string
          time_limit?: number | null
          title?: string
          type?: Database["public"]["Enums"]["exercise_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercises_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_replies: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          topic_id: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          topic_id: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_replies_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_replies_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "forum_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_topics: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          title: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          title: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_topics_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      internship_applications: {
        Row: {
          cover_letter_url: string | null
          created_at: string
          cv_url: string | null
          id: string
          internship_id: string
          motivation_text: string | null
          status: Database["public"]["Enums"]["application_status"] | null
          student_id: string
          updated_at: string
        }
        Insert: {
          cover_letter_url?: string | null
          created_at?: string
          cv_url?: string | null
          id?: string
          internship_id: string
          motivation_text?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          student_id: string
          updated_at?: string
        }
        Update: {
          cover_letter_url?: string | null
          created_at?: string
          cv_url?: string | null
          id?: string
          internship_id?: string
          motivation_text?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "internship_applications_internship_id_fkey"
            columns: ["internship_id"]
            isOneToOne: false
            referencedRelation: "internship_offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "internship_applications_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      internship_offers: {
        Row: {
          company: string
          created_at: string
          description: string
          duration: string
          end_date: string | null
          id: string
          industry: string
          is_remote: boolean | null
          location: string
          required_skills: string[]
          start_date: string | null
          status: Database["public"]["Enums"]["internship_status"] | null
          title: string
          updated_at: string
        }
        Insert: {
          company: string
          created_at?: string
          description: string
          duration: string
          end_date?: string | null
          id?: string
          industry: string
          is_remote?: boolean | null
          location: string
          required_skills: string[]
          start_date?: string | null
          status?: Database["public"]["Enums"]["internship_status"] | null
          title: string
          updated_at?: string
        }
        Update: {
          company?: string
          created_at?: string
          description?: string
          duration?: string
          end_date?: string | null
          id?: string
          industry?: string
          is_remote?: boolean | null
          location?: string
          required_skills?: string[]
          start_date?: string | null
          status?: Database["public"]["Enums"]["internship_status"] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      language_summaries: {
        Row: {
          content: string
          created_at: string | null
          id: string
          language_id: string
          title: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          language_id: string
          title: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          language_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "language_summaries_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: true
            referencedRelation: "programming_languages"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read: boolean | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read?: boolean | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read?: boolean | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mini_game_scores: {
        Row: {
          completed_at: string
          difficulty: string | null
          id: string
          score: number
          time_taken: number
          user_id: string
        }
        Insert: {
          completed_at?: string
          difficulty?: string | null
          id?: string
          score?: number
          time_taken?: number
          user_id: string
        }
        Update: {
          completed_at?: string
          difficulty?: string | null
          id?: string
          score?: number
          time_taken?: number
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          content: string
          created_at: string
          id: string
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comments: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          post_id: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          post_id: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "social_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_reactions: {
        Row: {
          created_at: string
          id: string
          post_id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          reaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "social_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      private_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read: boolean | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read?: boolean | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read?: boolean | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "private_messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "private_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          points: number | null
          role: Database["public"]["Enums"]["user_role"]
          specialization: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          points?: number | null
          role?: Database["public"]["Enums"]["user_role"]
          specialization?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          points?: number | null
          role?: Database["public"]["Enums"]["user_role"]
          specialization?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      programming_languages: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      quizzes: {
        Row: {
          correct_answer: string
          created_at: string
          explanation: string | null
          id: string
          module_id: string
          option1: string
          option2: string
          option3: string | null
          question: string
        }
        Insert: {
          correct_answer: string
          created_at?: string
          explanation?: string | null
          id?: string
          module_id: string
          option1: string
          option2: string
          option3?: string | null
          question: string
        }
        Update: {
          correct_answer?: string
          created_at?: string
          explanation?: string | null
          id?: string
          module_id?: string
          option1?: string
          option2?: string
          option3?: string | null
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      social_posts: {
        Row: {
          author_id: string
          code_snippet: string | null
          content: string
          created_at: string
          id: string
          image_url: string | null
          language: string | null
          updated_at: string
        }
        Insert: {
          author_id: string
          code_snippet?: string | null
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          language?: string | null
          updated_at?: string
        }
        Update: {
          author_id?: string
          code_snippet?: string | null
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          language?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_internship_preferences: {
        Row: {
          created_at: string
          id: string
          industries: string[] | null
          is_remote: boolean | null
          locations: string[] | null
          student_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          industries?: string[] | null
          is_remote?: boolean | null
          locations?: string[] | null
          student_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          industries?: string[] | null
          is_remote?: boolean | null
          locations?: string[] | null
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_internship_preferences_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_progress: {
        Row: {
          completed_materials: Json | null
          completion_percentage: number | null
          course_id: string | null
          id: string
          last_accessed_at: string
          started_at: string
          student_id: string | null
        }
        Insert: {
          completed_materials?: Json | null
          completion_percentage?: number | null
          course_id?: string | null
          id?: string
          last_accessed_at?: string
          started_at?: string
          student_id?: string | null
        }
        Update: {
          completed_materials?: Json | null
          completion_percentage?: number | null
          course_id?: string | null
          id?: string
          last_accessed_at?: string
          started_at?: string
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activities: {
        Row: {
          activity_data: Json | null
          activity_type: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity: {
        Row: {
          activity_data: Json | null
          activity_type: string
          course_id: string | null
          created_at: string
          id: string
          module_id: string | null
          user_id: string
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          course_id?: string | null
          created_at?: string
          id?: string
          module_id?: string | null
          user_id: string
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          course_id?: string | null
          created_at?: string
          id?: string
          module_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_activity_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_challenges: {
        Row: {
          challenge_id: string
          completed_at: string | null
          created_at: string
          id: string
          status: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          status?: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_challenges_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_challenges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_gamification: {
        Row: {
          badges: string[] | null
          created_at: string | null
          id: string
          last_played_at: string | null
          points: number | null
          user_id: string
        }
        Insert: {
          badges?: string[] | null
          created_at?: string | null
          id?: string
          last_played_at?: string | null
          points?: number | null
          user_id: string
        }
        Update: {
          badges?: string[] | null
          created_at?: string | null
          id?: string
          last_played_at?: string | null
          points?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_language_progress: {
        Row: {
          badge_earned: boolean | null
          id: string
          language_id: string
          last_updated: string | null
          quiz_completed: boolean | null
          summary_read: boolean | null
          user_id: string
        }
        Insert: {
          badge_earned?: boolean | null
          id?: string
          language_id: string
          last_updated?: string | null
          quiz_completed?: boolean | null
          summary_read?: boolean | null
          user_id: string
        }
        Update: {
          badge_earned?: boolean | null
          id?: string
          language_id?: string
          last_updated?: string | null
          quiz_completed?: boolean | null
          summary_read?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_language_progress_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "programming_languages"
            referencedColumns: ["id"]
          },
        ]
      }
      user_metrics: {
        Row: {
          course_completions: number | null
          created_at: string
          exercises_completed: number | null
          id: string
          last_login: string | null
          total_time_spent: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          course_completions?: number | null
          created_at?: string
          exercises_completed?: number | null
          id?: string
          last_login?: string | null
          total_time_spent?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          course_completions?: number | null
          created_at?: string
          exercises_completed?: number | null
          id?: string
          last_login?: string | null
          total_time_spent?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_performance_metrics: {
        Row: {
          id: string
          interactions_count: number | null
          pages_created: number | null
          recorded_at: string
          response_time: number | null
          session_duration: number | null
          site_generation_time: number | null
          user_id: string
        }
        Insert: {
          id?: string
          interactions_count?: number | null
          pages_created?: number | null
          recorded_at?: string
          response_time?: number | null
          session_duration?: number | null
          site_generation_time?: number | null
          user_id: string
        }
        Update: {
          id?: string
          interactions_count?: number | null
          pages_created?: number | null
          recorded_at?: string
          response_time?: number | null
          session_duration?: number | null
          site_generation_time?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_performance_metrics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed: boolean | null
          created_at: string
          exercise_completed: boolean | null
          id: string
          last_accessed: string
          module_id: string
          quiz_score: number | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          exercise_completed?: boolean | null
          id?: string
          last_accessed?: string
          module_id: string
          quiz_score?: number | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          exercise_completed?: boolean | null
          id?: string
          last_accessed?: string
          module_id?: string
          quiz_score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress_reports: {
        Row: {
          completed_steps: Json | null
          completion_percentage: number | null
          estimated_completion_time: number | null
          id: string
          in_progress_steps: Json | null
          pending_steps: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_steps?: Json | null
          completion_percentage?: number | null
          estimated_completion_time?: number | null
          id?: string
          in_progress_steps?: Json | null
          pending_steps?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_steps?: Json | null
          completion_percentage?: number | null
          estimated_completion_time?: number | null
          id?: string
          in_progress_steps?: Json | null
          pending_steps?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_recommendations: {
        Row: {
          created_at: string
          id: string
          is_viewed: boolean | null
          item_id: string
          recommendation_type: string
          relevance_score: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_viewed?: boolean | null
          item_id: string
          recommendation_type: string
          relevance_score?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_viewed?: boolean | null
          item_id?: string
          recommendation_type?: string
          relevance_score?: number | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_custom_resources: {
        Args: {
          lang_id: string
        }
        Returns: Json
      }
      get_default_resources: {
        Args: {
          lang_id: string
        }
        Returns: Json
      }
      get_user_progress_summary: {
        Args: {
          user_uuid: string
        }
        Returns: Json
      }
      upsert_custom_resource: {
        Args: {
          lang_id: string
          teach_id: string
          c_video_url: string
          c_pdf_url: string
          e_video_url: string
          e_pdf_url: string
        }
        Returns: Json
      }
    }
    Enums: {
      application_status: "pending" | "approved" | "rejected"
      course_category:
        | "Programming Fundamentals"
        | "Frontend Development"
        | "Backend Development"
        | "Machine Learning"
        | "Data Analysis"
        | "AI Applications"
      course_difficulty: "Beginner" | "Intermediate" | "Advanced"
      course_path:
        | "Web Development"
        | "Data Science"
        | "Artificial Intelligence"
      difficulty_level: "Beginner" | "Intermediate" | "Advanced"
      exercise_status: "draft" | "published"
      exercise_type: "mcq" | "open_ended" | "coding" | "file_upload"
      internship_status: "open" | "filled" | "closed"
      user_role: "admin" | "teacher" | "student"
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
