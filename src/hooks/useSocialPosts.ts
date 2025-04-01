
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthState } from '@/hooks/useAuthState';

export type SocialPost = {
  id: string;
  author_id: string;
  content: string;
  code_snippet: string | null;
  language: string | null;
  created_at: string;
  // Include author details
  author?: {
    full_name: string | null;
    avatar_url: string | null;
  };
  // Include counts
  comment_count?: number;
  reaction_count?: number;
};

export type Comment = {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  author?: {
    full_name: string | null;
    avatar_url: string | null;
  };
};

export const useSocialPosts = () => {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthState();

  // Fetch all posts with author information
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('social_posts')
        .select(`
          *,
          profiles:author_id (
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to include author details
      const transformedPosts = data.map(post => ({
        ...post,
        author: post.profiles
      }));
      
      // Fetch comment counts for each post
      for (const post of transformedPosts) {
        const { count } = await supabase
          .from('post_comments')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', post.id);
        
        post.comment_count = count || 0;
        
        const { count: reactionCount } = await supabase
          .from('post_reactions')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', post.id);
        
        post.reaction_count = reactionCount || 0;
      }
      
      setPosts(transformedPosts);
    } catch (error: any) {
      console.error('Error fetching posts:', error);
      setError(error.message);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  // Create a new post
  const createPost = async (content: string, codeSnippet?: string, language?: string) => {
    if (!user) {
      toast.error('You must be logged in to create a post');
      return null;
    }
    
    try {
      const { data, error } = await supabase
        .from('social_posts')
        .insert({
          author_id: user.id,
          content,
          code_snippet: codeSnippet || null,
          language: language || null
        })
        .select(`
          *,
          profiles:author_id (
            full_name,
            avatar_url
          )
        `)
        .single();
      
      if (error) throw error;
      
      const newPost = {
        ...data,
        author: data.profiles,
        comment_count: 0,
        reaction_count: 0
      };
      
      setPosts(prev => [newPost, ...prev]);
      toast.success('Post created successfully');
      return newPost;
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
      return null;
    }
  };

  // Fetch comments for a post
  const fetchComments = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .select(`
          *,
          profiles:author_id (
            full_name,
            avatar_url
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      return data.map(comment => ({
        ...comment,
        author: comment.profiles
      }));
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
      return [];
    }
  };

  // Add a comment to a post
  const addComment = async (postId: string, content: string) => {
    if (!user) {
      toast.error('You must be logged in to comment');
      return null;
    }
    
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .insert({
          post_id: postId,
          author_id: user.id,
          content
        })
        .select(`
          *,
          profiles:author_id (
            full_name,
            avatar_url
          )
        `)
        .single();
      
      if (error) throw error;
      
      // Update the comment count for the post
      setPosts(prev => 
        prev.map(post => 
          post.id === postId 
            ? { ...post, comment_count: (post.comment_count || 0) + 1 }
            : post
        )
      );
      
      toast.success('Comment added');
      return {
        ...data,
        author: data.profiles
      };
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
      return null;
    }
  };

  // Add a reaction to a post (like, etc.)
  const addReaction = async (postId: string, reactionType: string = 'like') => {
    if (!user) {
      toast.error('You must be logged in to react to posts');
      return false;
    }
    
    try {
      // Check if user already reacted
      const { data: existingReaction } = await supabase
        .from('post_reactions')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .eq('reaction_type', reactionType)
        .maybeSingle();
      
      if (existingReaction) {
        // Remove the reaction if it exists
        const { error } = await supabase
          .from('post_reactions')
          .delete()
          .eq('id', existingReaction.id);
        
        if (error) throw error;
        
        // Update the reaction count for the post
        setPosts(prev => 
          prev.map(post => 
            post.id === postId 
              ? { ...post, reaction_count: Math.max(0, (post.reaction_count || 0) - 1) }
              : post
          )
        );
        
        toast.success('Reaction removed');
        return false;
      } else {
        // Add the reaction if it doesn't exist
        const { error } = await supabase
          .from('post_reactions')
          .insert({
            post_id: postId,
            user_id: user.id,
            reaction_type: reactionType
          });
        
        if (error) throw error;
        
        // Update the reaction count for the post
        setPosts(prev => 
          prev.map(post => 
            post.id === postId 
              ? { ...post, reaction_count: (post.reaction_count || 0) + 1 }
              : post
          )
        );
        
        toast.success('Reaction added');
        return true;
      }
    } catch (error: any) {
      console.error('Error toggling reaction:', error);
      toast.error('Failed to update reaction');
      return false;
    }
  };

  // Check if user has reacted to a post
  const checkReaction = async (postId: string, reactionType: string = 'like') => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase
        .from('post_reactions')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .eq('reaction_type', reactionType)
        .maybeSingle();
      
      if (error) throw error;
      
      return !!data;
    } catch (error: any) {
      console.error('Error checking reaction:', error);
      return false;
    }
  };

  // Delete a post
  const deletePost = async (postId: string) => {
    if (!user) {
      toast.error('You must be logged in to delete a post');
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('social_posts')
        .delete()
        .eq('id', postId)
        .eq('author_id', user.id);
      
      if (error) throw error;
      
      setPosts(prev => prev.filter(post => post.id !== postId));
      toast.success('Post deleted');
      return true;
    } catch (error: any) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
      return false;
    }
  };

  // Follow/unfollow a user
  const toggleFollow = async (userId: string) => {
    if (!user) {
      toast.error('You must be logged in to follow users');
      return false;
    }
    
    if (userId === user.id) {
      toast.error('You cannot follow yourself');
      return false;
    }
    
    try {
      // Check if already following
      const { data: existingFollow } = await supabase
        .from('user_follows')
        .select('*')
        .eq('follower_id', user.id)
        .eq('following_id', userId)
        .maybeSingle();
      
      if (existingFollow) {
        // Unfollow
        const { error } = await supabase
          .from('user_follows')
          .delete()
          .eq('id', existingFollow.id);
        
        if (error) throw error;
        
        toast.success('Unfollowed user');
        return false;
      } else {
        // Follow
        const { error } = await supabase
          .from('user_follows')
          .insert({
            follower_id: user.id,
            following_id: userId
          });
        
        if (error) throw error;
        
        toast.success('Followed user');
        return true;
      }
    } catch (error: any) {
      console.error('Error toggling follow:', error);
      toast.error('Failed to update follow status');
      return false;
    }
  };

  // Check if the current user is following another user
  const checkFollowing = async (userId: string) => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase
        .from('user_follows')
        .select('*')
        .eq('follower_id', user.id)
        .eq('following_id', userId)
        .maybeSingle();
      
      if (error) throw error;
      
      return !!data;
    } catch (error: any) {
      console.error('Error checking follow status:', error);
      return false;
    }
  };

  // Get follower count for a user
  const getFollowerCount = async (userId: string) => {
    try {
      const { count, error } = await supabase
        .from('user_follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', userId);
      
      if (error) throw error;
      
      return count || 0;
    } catch (error: any) {
      console.error('Error getting follower count:', error);
      return 0;
    }
  };

  // Initialize by fetching posts
  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    fetchComments,
    addComment,
    addReaction,
    checkReaction,
    deletePost,
    toggleFollow,
    checkFollowing,
    getFollowerCount
  };
};
