
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

-- Update Supabase schema to include social_posts and related tables
COMMENT ON TABLE public.social_posts IS 'Stores user posts for the social feed';
COMMENT ON TABLE public.post_comments IS 'Stores comments on social posts';
COMMENT ON TABLE public.post_reactions IS 'Stores reactions (likes, etc.) to social posts';
COMMENT ON TABLE public.user_follows IS 'Tracks user follow relationships';
COMMENT ON TABLE public.private_messages IS 'Stores private messages between users';
