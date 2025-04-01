
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ThumbsUp, MessageSquare, Share2, MoreVertical, Trash2, UserPlus, UserCheck } from 'lucide-react';
import { SocialPost, Comment } from '@/hooks/useSocialPosts';
import { useAuthState } from '@/hooks/useAuthState';
import { formatDistanceToNow } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface PostCardProps {
  post: SocialPost;
  onAddComment: (postId: string, content: string) => Promise<Comment | null>;
  onReaction: (postId: string) => Promise<boolean>;
  onDelete: (postId: string) => Promise<boolean>;
  onToggleFollow: (userId: string) => Promise<boolean>;
}

export function PostCard({ post, onAddComment, onReaction, onDelete, onToggleFollow }: PostCardProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuthState();
  
  const isAuthor = user?.id === post.author_id;
  
  // Fetch comments when showing comments section
  useEffect(() => {
    const fetchComments = async () => {
      if (showComments) {
        // This function would need to be passed as a prop or imported from a context
        const { fetchComments } = await import('@/hooks/useSocialPosts');
        const result = await fetchComments(post.id);
        setComments(result);
      }
    };
    
    fetchComments();
  }, [showComments, post.id]);
  
  // Check if user has liked the post
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (user) {
        // This function would need to be passed as a prop or imported from a context
        const { checkReaction } = await import('@/hooks/useSocialPosts');
        const result = await checkReaction(post.id);
        setIsLiked(result);
      }
    };
    
    const checkFollowStatus = async () => {
      if (user && post.author_id !== user.id) {
        // This function would need to be passed as a prop or imported from a context
        const { checkFollowing } = await import('@/hooks/useSocialPosts');
        const result = await checkFollowing(post.author_id);
        setIsFollowing(result);
      }
    };
    
    checkLikeStatus();
    checkFollowStatus();
  }, [user, post.id, post.author_id]);
  
  const handleLike = async () => {
    const result = await onReaction(post.id);
    setIsLiked(result);
  };
  
  const handleToggleFollow = async () => {
    const result = await onToggleFollow(post.author_id);
    setIsFollowing(result);
  };
  
  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    
    setSubmitting(true);
    const comment = await onAddComment(post.id, newComment);
    if (comment) {
      setComments(prev => [...prev, comment]);
      setNewComment('');
      setShowComments(true);
    }
    setSubmitting(false);
  };
  
  const handleDeletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await onDelete(post.id);
    }
  };

  // Format code snippet if present
  const formatCodeSnippet = () => {
    if (!post.code_snippet) return null;
    
    return (
      <div className="mt-4 bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto">
        <pre>
          <code>{post.code_snippet}</code>
        </pre>
      </div>
    );
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage 
                src={post.author?.avatar_url || ''} 
                alt={post.author?.full_name || 'User'} 
              />
              <AvatarFallback>
                {(post.author?.full_name || 'U').charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{post.author?.full_name || 'Anonymous'}</div>
              <div className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {!isAuthor && user && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleFollow}
                className="flex items-center gap-1"
              >
                {isFollowing ? <UserCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            )}
            
            {isAuthor && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    className="text-red-600 cursor-pointer flex items-center"
                    onClick={handleDeletePost}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Post
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="whitespace-pre-line">{post.content}</div>
        {formatCodeSnippet()}
      </CardContent>
      
      <CardFooter className="flex flex-col p-0">
        <div className="flex items-center justify-between px-6 py-2">
          <div className="text-sm text-gray-500">
            {post.reaction_count || 0} {post.reaction_count === 1 ? 'like' : 'likes'} • {post.comment_count || 0} {post.comment_count === 1 ? 'comment' : 'comments'}
          </div>
        </div>
        
        <Separator />
        
        <div className="flex justify-between px-6 py-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`flex items-center gap-1 ${isLiked ? 'text-blue-600' : ''}`} 
            onClick={handleLike}
          >
            <ThumbsUp className="h-4 w-4" />
            {isLiked ? 'Liked' : 'Like'}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1" 
            onClick={() => setShowComments(!showComments)}
          >
            <MessageSquare className="h-4 w-4" />
            Comment
          </Button>
          
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
        
        {showComments && (
          <div className="px-6 py-3">
            <Separator className="mb-4" />
            
            <div className="space-y-4">
              {comments.map(comment => (
                <div key={comment.id} className="flex space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={comment.author?.avatar_url || ''} 
                      alt={comment.author?.full_name || 'User'} 
                    />
                    <AvatarFallback>
                      {(comment.author?.full_name || 'U').charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                      <div className="font-semibold text-sm">
                        {comment.author?.full_name || 'Anonymous'}
                      </div>
                      <div className="text-sm mt-1">{comment.content}</div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              ))}
              
              {user && (
                <div className="flex space-x-3 mt-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={user.avatar_url || ''} 
                      alt={user.full_name || 'User'} 
                    />
                    <AvatarFallback>
                      {(user.full_name || 'U').charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Textarea 
                      placeholder="Write a comment..." 
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[60px]"
                    />
                    <Button 
                      onClick={handleSubmitComment} 
                      disabled={!newComment.trim() || submitting}
                      size="sm"
                    >
                      Post
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
