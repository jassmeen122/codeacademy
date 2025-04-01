
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Trash2, Edit, Eye } from "lucide-react";
import type { SocialPost } from "@/hooks/useSocialPosts";

const PostManagementPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        navigate('/');
        return;
      }

      fetchPosts();
    } catch (error) {
      console.error('Error checking user role:', error);
      navigate('/auth');
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
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
            avatar_url,
            email
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
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('social_posts')
        .delete()
        .eq('id', postId);
      
      if (error) throw error;
      
      toast.success('Post deleted successfully');
      setPosts(prev => prev.filter(post => post.id !== postId));
      setConfirmDelete(null);
    } catch (error: any) {
      console.error('Error deleting post:', error);
      toast.error(`Failed to delete post: ${error.message}`);
    }
  };

  const handleViewPost = (post: SocialPost) => {
    setSelectedPost(post);
  };

  const filteredPosts = posts.filter(post => 
    post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Post Management</h1>
            <p className="text-gray-600">Manage and moderate user posts across the platform</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by content, author name, or email..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Author</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Interactions</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell>
                          <div className="font-medium">{post.author?.full_name || "Unknown"}</div>
                          <div className="text-sm text-gray-500">{post.author?.email}</div>
                        </TableCell>
                        <TableCell>
                          <div className="truncate max-w-xs">{post.content}</div>
                          {post.code_snippet && (
                            <Badge variant="outline" className="mt-1">Has code</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(post.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{post.comment_count} comments</Badge>
                            <Badge variant="secondary">{post.reaction_count} reactions</Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewPost(post)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setConfirmDelete(post.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No posts found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Post View Dialog */}
        {selectedPost && (
          <Dialog open={!!selectedPost} onOpenChange={(open) => !open && setSelectedPost(null)}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Post Detail</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-2">
                  <div className="font-bold">Author:</div>
                  <div>{selectedPost.author?.full_name || "Unknown"}</div>
                  <div className="ml-2 text-gray-500">({selectedPost.author?.email})</div>
                </div>

                <div className="space-y-2">
                  <div className="font-bold">Content:</div>
                  <div className="whitespace-pre-wrap p-4 rounded-md bg-gray-100">{selectedPost.content}</div>
                </div>

                {selectedPost.code_snippet && (
                  <div className="space-y-2">
                    <div className="font-bold">Code Snippet ({selectedPost.language || 'unknown'}):</div>
                    <pre className="p-4 bg-gray-900 text-white rounded-md overflow-x-auto">
                      {selectedPost.code_snippet}
                    </pre>
                  </div>
                )}

                {selectedPost.image_url && (
                  <div className="space-y-2">
                    <div className="font-bold">Image:</div>
                    <img 
                      src={selectedPost.image_url} 
                      alt="Post image" 
                      className="max-h-64 object-contain rounded-md" 
                    />
                  </div>
                )}

                <div className="flex justify-between">
                  <div>
                    <div className="font-bold">Created at:</div>
                    <div>{new Date(selectedPost.created_at).toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="font-bold">Last updated:</div>
                    <div>{new Date(selectedPost.updated_at).toLocaleString()}</div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div>
                    <div className="font-bold">Comments:</div>
                    <div>{selectedPost.comment_count}</div>
                  </div>
                  <div>
                    <div className="font-bold">Reactions:</div>
                    <div>{selectedPost.reaction_count}</div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="destructive" onClick={() => {
                  setConfirmDelete(selectedPost.id);
                  setSelectedPost(null);
                }}>
                  Delete Post
                </Button>
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!confirmDelete} onOpenChange={(open) => !open && setConfirmDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Are you sure you want to delete this post? This action cannot be undone.</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDelete(null)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => confirmDelete && handleDeletePost(confirmDelete)}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default PostManagementPage;
