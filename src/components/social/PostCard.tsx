
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { SocialPost, Comment } from '@/hooks/useSocialPosts';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, ThumbsUp, MoreVertical, UserCheck, UserMinus, Trash2 } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useAuthState } from '@/hooks/useAuthState';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface PostCardProps {
  post: SocialPost;
  onAddComment: (postId: string, content: string) => Promise<Comment | null>;
  onReaction: (postId: string, reactionType?: string) => Promise<boolean>;
  onDelete: (postId: string) => Promise<boolean>;
  onToggleFollow: (userId: string) => Promise<boolean>;
}

export function PostCard({ post, onAddComment, onReaction, onDelete, onToggleFollow }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const { user } = useAuthState();
  
  const handleToggleComments = async () => {
    setShowComments(!showComments);
    
    if (!showComments && comments.length === 0) {
      setLoadingComments(true);
      try {
        // Assuming there's a fetchComments function in the parent component
        const fetchedComments = await window.supabase
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
          .eq('post_id', post.id)
          .order('created_at', { ascending: true });
        
        if (fetchedComments.data) {
          const formattedComments = fetchedComments.data.map((comment: any) => ({
            id: comment.id,
            post_id: comment.post_id,
            author_id: comment.author_id,
            content: comment.content,
            created_at: comment.created_at,
            author: comment.profiles
          }));
          setComments(formattedComments);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoadingComments(false);
      }
    }
  };
  
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    try {
      const comment = await onAddComment(post.id, newComment);
      if (comment) {
        setComments(prevComments => [...prevComments, comment]);
        setNewComment('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleReaction = async () => {
    const result = await onReaction(post.id);
    setIsLiked(result);
  };
  
  const handleToggleFollow = async () => {
    if (!post.author_id || post.author_id === user?.id) return;
    
    setLoadingFollow(true);
    try {
      const result = await onToggleFollow(post.author_id);
      setIsFollowing(result);
    } finally {
      setLoadingFollow(false);
    }
  };
  
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this post?')) {
      await onDelete(post.id);
    }
  };
  
  // Initialize follow status
  useEffect(() => {
    if (user && post.author_id && post.author_id !== user.id) {
      const checkFollowStatus = async () => {
        try {
          const { data } = await window.supabase
            .from('user_follows')
            .select('id')
            .eq('follower_id', user.id)
            .eq('following_id', post.author_id)
            .maybeSingle();
          
          setIsFollowing(!!data);
        } catch (error) {
          console.error('Error checking follow status:', error);
        }
      };
      
      checkFollowStatus();
    }
  }, [user, post.author_id]);
  
  // Initialize like status
  useEffect(() => {
    if (user) {
      const checkLikeStatus = async () => {
        try {
          const { data } = await window.supabase
            .from('post_reactions')
            .select('id')
            .eq('post_id', post.id)
            .eq('user_id', user.id)
            .eq('reaction_type', 'like')
            .maybeSingle();
          
          setIsLiked(!!data);
        } catch (error) {
          console.error('Error checking like status:', error);
        }
      };
      
      checkLikeStatus();
    }
  }, [user, post.id]);
  
  return (
    <Card className="mb-6">
      <CardContent className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex space-x-3">
            <Avatar>
              <AvatarImage src={post.author?.avatar_url || ''} alt={post.author?.full_name || 'User'} />
              <AvatarFallback>{(post.author?.full_name || 'U').charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{post.author?.full_name || 'Unknown User'}</div>
              <div className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </div>
            </div>
          </div>
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {post.author_id !== user.id && (
                  <DropdownMenuItem onClick={handleToggleFollow}>
                    {isFollowing ? (
                      <>
                        <UserMinus className="mr-2 h-4 w-4" />
                        <span>Unfollow</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="mr-2 h-4 w-4" />
                        <span>Follow</span>
                      </>
                    )}
                  </DropdownMenuItem>
                )}
                
                {post.author_id === user.id && (
                  <DropdownMenuItem className="text-red-500" onClick={handleDelete}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        <div className="mt-3 whitespace-pre-wrap">{post.content}</div>
        
        {post.image_url && (
          <div className="mt-3">
            <img 
              src={post.image_url} 
              alt="Post image" 
              className="rounded-md max-h-96 max-w-full object-contain"
            />
          </div>
        )}
        
        {post.code_snippet && (
          <div className="mt-3">
            <SyntaxHighlighter
              language={post.language || 'javascript'}
              style={vscDarkPlus}
              customStyle={{ borderRadius: '0.5rem' }}
            >
              {post.code_snippet}
            </SyntaxHighlighter>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-3 pt-0 border-t">
        <div className="w-full">
          <div className="flex justify-between mb-2">
            <div className="flex space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-1 ${isLiked ? 'text-primary' : ''}`}
                onClick={handleReaction}
              >
                <ThumbsUp className="h-4 w-4" />
                {post.reaction_count || 0}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
                onClick={handleToggleComments}
              >
                <MessageSquare className="h-4 w-4" />
                {post.comment_count || 0}
              </Button>
            </div>
          </div>
          
          {showComments && (
            <div className="mt-3 space-y-3">
              {loadingComments ? (
                <div className="text-center text-sm text-muted-foreground">Loading comments...</div>
              ) : comments.length > 0 ? (
                comments.map(comment => (
                  <div key={comment.id} className="flex space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.author?.avatar_url || ''} alt={comment.author?.full_name || 'User'} />
                      <AvatarFallback>{(comment.author?.full_name || 'U').charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-muted rounded-lg p-2">
                        <div className="font-medium text-sm">{comment.author?.full_name || 'Unknown User'}</div>
                        <div className="text-sm">{comment.content}</div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-sm text-muted-foreground">No comments yet</div>
              )}
              
              {user && (
                <div className="flex space-x-2 mt-3">
                  <Input
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey && !isSubmitting) {
                        e.preventDefault();
                        handleAddComment();
                      }
                    }}
                  />
                  <Button 
                    size="sm" 
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
