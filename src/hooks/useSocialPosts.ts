
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
  image_url: string | null;
  created_at: string;
  updated_at: string;
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
      
      const { data: postsData, error: postsError } = await supabase
        .from('social_posts')
        .select(`
          id,
          author_id,
          content,
          code_snippet,
          language,
          image_url,
          created_at,
          updated_at,
          profiles:author_id (
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });
      
      if (postsError) throw postsError;
      
      if (!postsData) {
        setPosts([]);
        return;
      }
      
      // Transform the data to include author details
      const transformedPosts: SocialPost[] = postsData.map((post: any) => ({
        id: post.id,
        author_id: post.author_id,
        content: post.content,
        code_snippet: post.code_snippet,
        language: post.language,
        image_url: post.image_url,
        created_at: post.created_at,
        updated_at: post.updated_at,
        author: post.profiles,
        comment_count: 0,
        reaction_count: 0
      }));
      
      // Fetch comment counts for each post
      for (const post of transformedPosts) {
        const { count: commentCount, error: commentError } = await supabase
          .from('post_comments')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', post.id);
        
        if (!commentError) {
          post.comment_count = commentCount || 0;
        }
        
        const { count: reactionCount, error: reactionError } = await supabase
          .from('post_reactions')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', post.id);
        
        if (!reactionError) {
          post.reaction_count = reactionCount || 0;
        }
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

  // Fetch posts from followed users only
  const fetchFollowedPosts = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // First get list of followed users
      const { data: followsData, error: followsError } = await supabase
        .from('user_follows')
        .select('following_id')
        .eq('follower_id', user.id);
      
      if (followsError) throw followsError;
      
      if (!followsData || followsData.length === 0) {
        setPosts([]);
        setLoading(false);
        return;
      }
      
      const followedIds = followsData.map(f => f.following_id);
      
      // Then fetch posts from those users
      const { data: postsData, error: postsError } = await supabase
        .from('social_posts')
        .select(`
          id,
          author_id,
          content,
          code_snippet,
          language,
          image_url,
          created_at,
          updated_at,
          profiles:author_id (
            full_name,
            avatar_url
          )
        `)
        .in('author_id', followedIds)
        .order('created_at', { ascending: false });
      
      if (postsError) throw postsError;
      
      if (!postsData) {
        setPosts([]);
        return;
      }
      
      // Transform the data
      const transformedPosts: SocialPost[] = await Promise.all(postsData.map(async (post: any) => {
        // Get comment count
        const { count: commentCount } = await supabase
          .from('post_comments')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', post.id);
        
        // Get reaction count
        const { count: reactionCount } = await supabase
          .from('post_reactions')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', post.id);
        
        return {
          id: post.id,
          author_id: post.author_id,
          content: post.content,
          code_snippet: post.code_snippet,
          language: post.language,
          image_url: post.image_url,
          created_at: post.created_at,
          updated_at: post.updated_at,
          author: post.profiles,
          comment_count: commentCount || 0,
          reaction_count: reactionCount || 0
        };
      }));
      
      setPosts(transformedPosts);
    } catch (error: any) {
      console.error('Error fetching followed posts:', error);
      setError(error.message);
      toast.error('Failed to load posts from people you follow');
    } finally {
      setLoading(false);
    }
  };

  // Create a new post
  const createPost = async (content: string, codeSnippet?: string, language?: string, imageUrl?: string) => {
    if (!user) {
      toast.error('You must be logged in to create a post');
      return null;
    }
    
    try {
      const newPost = {
        author_id: user.id,
        content,
        code_snippet: codeSnippet || null,
        language: language || null,
        image_url: imageUrl || null
      };
      
      const { data, error } = await supabase
        .from('social_posts')
        .insert(newPost)
        .select(`
          id,
          author_id,
          content,
          code_snippet,
          language,
          image_url,
          created_at,
          updated_at,
          profiles:author_id (
            full_name,
            avatar_url
          )
        `)
        .single();
      
      if (error) throw error;
      
      if (!data) throw new Error("Couldn't retrieve the new post");
      
      const createdPost: SocialPost = {
        id: data.id,
        author_id: data.author_id,
        content: data.content,
        code_snippet: data.code_snippet,
        language: data.language,
        image_url: data.image_url,
        created_at: data.created_at,
        updated_at: data.updated_at,
        author: data.profiles,
        comment_count: 0,
        reaction_count: 0
      };
      
      setPosts(prev => [createdPost, ...prev]);
      toast.success('Post created successfully');
      return createdPost;
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
      return null;
    }
  };

  // Add a comment to a post
  const addComment = async (postId: string, content: string) => {
    if (!user) {
      toast.error('You must be logged in to comment');
      return null;
    }
    
    try {
      const newComment = {
        post_id: postId,
        author_id: user.id,
        content
      };
      
      const { data, error } = await supabase
        .from('post_comments')
        .insert(newComment)
        .select(`
          id,
          post_id,
          author_id,
          content,
          created_at,
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
      
      if (!data) throw new Error("Couldn't retrieve the new comment");
      
      const createdComment: Comment = {
        id: data.id,
        post_id: data.post_id,
        author_id: data.author_id,
        content: data.content,
        created_at: data.created_at,
        author: data.profiles
      };
      
      toast.success('Comment added');
      return createdComment;
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
      return null;
    }
  };

  // Fetch comments for a post
  const fetchComments = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .select(`
          id,
          post_id,
          author_id,
          content,
          created_at,
          profiles:author_id (
            full_name,
            avatar_url
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      if (!data) return [];
      
      const comments: Comment[] = data.map(comment => ({
        id: comment.id,
        post_id: comment.post_id,
        author_id: comment.author_id,
        content: comment.content,
        created_at: comment.created_at,
        author: comment.profiles
      }));
      
      return comments;
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
      return [];
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
      const { data: existingReaction, error: checkError } = await supabase
        .from('post_reactions')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .eq('reaction_type', reactionType)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingReaction) {
        // Remove the reaction if it exists
        const { error: deleteError } = await supabase
          .from('post_reactions')
          .delete()
          .eq('id', existingReaction.id);
        
        if (deleteError) throw deleteError;
        
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
        const { error: insertError } = await supabase
          .from('post_reactions')
          .insert({
            post_id: postId,
            user_id: user.id,
            reaction_type: reactionType
          });
        
        if (insertError) throw insertError;
        
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
        .select('id')
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
      const { data: existingFollow, error: checkError } = await supabase
        .from('user_follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', userId)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingFollow) {
        // Unfollow
        const { error: deleteError } = await supabase
          .from('user_follows')
          .delete()
          .eq('id', existingFollow.id);
        
        if (deleteError) throw deleteError;
        
        toast.success('Unfollowed user');
        return false;
      } else {
        // Follow
        const { error: insertError } = await supabase
          .from('user_follows')
          .insert({
            follower_id: user.id,
            following_id: userId
          });
        
        if (insertError) throw insertError;
        
        toast.success('Followed user');
        return true;
      }
    } catch (error: any) {
      console.error('Error toggling follow:', error);
      toast.error('Failed to update follow status');
      return false;
    }
  };

  // Check if user is following another user
  const checkFollowing = async (userId: string) => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase
        .from('user_follows')
        .select('id')
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
        .select('id', { count: 'exact', head: true })
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
    fetchFollowedPosts,
    createPost,
    addComment,
    fetchComments,
    addReaction,
    checkReaction,
    deletePost,
    toggleFollow,
    checkFollowing,
    getFollowerCount
  };
};
