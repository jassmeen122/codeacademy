
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

-- Update comments for clarity on tables
COMMENT ON TABLE public.social_posts IS 'Stores user posts for the Knowledge Share feature';
COMMENT ON TABLE public.post_comments IS 'Stores comments on Knowledge Share posts';
COMMENT ON TABLE public.post_reactions IS 'Stores reactions (likes, etc.) to Knowledge Share posts';
COMMENT ON TABLE public.user_follows IS 'Tracks user follow relationships in Knowledge Share';
COMMENT ON TABLE public.private_messages IS 'Stores private messages between users in Knowledge Share';

-- Create function for getting course lessons for modules if it doesn't exist
CREATE OR REPLACE FUNCTION get_course_lessons_for_modules(module_ids UUID[])
RETURNS SETOF course_lessons AS $$
BEGIN
  RETURN QUERY SELECT * FROM course_lessons WHERE module_id = ANY(module_ids) ORDER BY order_index;
END;
$$ LANGUAGE plpgsql;
