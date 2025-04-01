
/*
 * This file contains type definitions for your Supabase database
 * It can be used by TypeScript utilities to offer better type safety
 */

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'student');
CREATE TYPE difficulty_level AS ENUM ('Beginner', 'Intermediate', 'Advanced', 'Expert');
CREATE TYPE exercise_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE content_path AS ENUM ('frontend', 'backend', 'fullstack', 'mobile', 'devops', 'data', 'ai');
CREATE TYPE content_category AS ENUM ('programming', 'web', 'mobile', 'database', 'cloud', 'tools', 'concepts');
CREATE TYPE internship_status AS ENUM ('open', 'filled', 'closed');
CREATE TYPE application_status AS ENUM ('pending', 'approved', 'rejected');

-- Social tables
CREATE TABLE IF NOT EXISTS public.social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  code_snippet TEXT,
  language TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES social_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.post_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES social_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(post_id, user_id, reaction_type)
);

CREATE TABLE IF NOT EXISTS public.user_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(follower_id, following_id)
);

CREATE TABLE IF NOT EXISTS public.private_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Internship tables 
CREATE TABLE IF NOT EXISTS public.internship_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  description TEXT NOT NULL,
  required_skills TEXT[] NOT NULL,
  industry TEXT NOT NULL,
  location TEXT NOT NULL,
  is_remote BOOLEAN DEFAULT false,
  duration TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  status internship_status DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.internship_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  internship_id UUID REFERENCES internship_offers(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  cv_url TEXT,
  cover_letter_url TEXT,
  motivation_text TEXT,
  status application_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(internship_id, student_id)
);

CREATE TABLE IF NOT EXISTS public.student_internship_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  industries TEXT[],
  locations TEXT[],
  is_remote BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(student_id)
);

-- Update comments for clarity on tables
COMMENT ON TABLE public.social_posts IS 'Stores user posts for the Knowledge Share feature';
COMMENT ON TABLE public.post_comments IS 'Stores comments on Knowledge Share posts';
COMMENT ON TABLE public.post_reactions IS 'Stores reactions (likes, etc.) to Knowledge Share posts';
COMMENT ON TABLE public.user_follows IS 'Tracks user follow relationships in Knowledge Share';
COMMENT ON TABLE public.private_messages IS 'Stores private messages between users in Knowledge Share';
COMMENT ON TABLE public.internship_offers IS 'Stores internship opportunities posted by administrators';
COMMENT ON TABLE public.internship_applications IS 'Stores student applications to internships';
COMMENT ON TABLE public.student_internship_preferences IS 'Stores student preferences for internship notifications';

-- Create function for getting course lessons for modules if it doesn't exist
CREATE OR REPLACE FUNCTION get_course_lessons_for_modules(module_ids UUID[])
RETURNS SETOF course_lessons AS $$
BEGIN
  RETURN QUERY SELECT * FROM course_lessons WHERE module_id = ANY(module_ids) ORDER BY order_index;
END;
$$ LANGUAGE plpgsql;
