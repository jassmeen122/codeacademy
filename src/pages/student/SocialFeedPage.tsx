
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreatePostForm } from '@/components/social/CreatePostForm';
import { PostCard } from '@/components/social/PostCard';
import { useSocialPosts } from '@/hooks/useSocialPosts';
import { useAuthState } from '@/hooks/useAuthState';
import { RefreshCw, Users, UserCheck, Inbox } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';

const SocialFeedPage = () => {
  const {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    addComment,
    addReaction,
    deletePost,
    toggleFollow
  } = useSocialPosts();
  const { user } = useAuthState();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('for-you');
  const navigate = useNavigate();
  
  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  // Navigate to messages
  const navigateToMessages = () => {
    navigate('/student/messages');
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left sidebar */}
          <div className="hidden md:block">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Social Hub</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start" 
                    onClick={() => setActiveTab('for-you')}
                  >
                    For You
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start" 
                    onClick={() => setActiveTab('following')}
                  >
                    <UserCheck className="mr-2 h-4 w-4" />
                    Following
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start" 
                    onClick={navigateToMessages}
                  >
                    <Inbox className="mr-2 h-4 w-4" />
                    Messages
                  </Button>
                </nav>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Trending Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="font-semibold">#JavaScript</div>
                    <div className="text-sm text-gray-500">1.2k posts</div>
                  </div>
                  <div>
                    <div className="font-semibold">#WebDevelopment</div>
                    <div className="text-sm text-gray-500">856 posts</div>
                  </div>
                  <div>
                    <div className="font-semibold">#ReactJS</div>
                    <div className="text-sm text-gray-500">712 posts</div>
                  </div>
                  <div>
                    <div className="font-semibold">#Python</div>
                    <div className="text-sm text-gray-500">623 posts</div>
                  </div>
                  <div>
                    <div className="font-semibold">#MachineLearning</div>
                    <div className="text-sm text-gray-500">519 posts</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main feed */}
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Social Feed</h1>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-1"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="mb-6">
                <TabsList className="w-full">
                  <TabsTrigger value="for-you" className="flex-1">For You</TabsTrigger>
                  <TabsTrigger value="following" className="flex-1">Following</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="for-you" className="mt-0">
                <CreatePostForm onSubmit={createPost} />
                
                {loading && !refreshing ? (
                  <Card>
                    <CardContent className="flex justify-center p-6">
                      <p>Loading posts...</p>
                    </CardContent>
                  </Card>
                ) : error ? (
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-center text-red-500">
                        Error loading posts: {error}
                      </p>
                    </CardContent>
                  </Card>
                ) : posts.length === 0 ? (
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-center text-gray-500">
                        No posts yet. Be the first to post!
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  posts.map(post => (
                    <PostCard 
                      key={post.id}
                      post={post}
                      onAddComment={addComment}
                      onReaction={addReaction}
                      onDelete={deletePost}
                      onToggleFollow={toggleFollow}
                    />
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="following" className="mt-0">
                <CreatePostForm onSubmit={createPost} />
                
                {!user ? (
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-center text-gray-500">
                        Sign in to see posts from people you follow
                      </p>
                    </CardContent>
                  </Card>
                ) : loading && !refreshing ? (
                  <Card>
                    <CardContent className="flex justify-center p-6">
                      <p>Loading posts...</p>
                    </CardContent>
                  </Card>
                ) : error ? (
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-center text-red-500">
                        Error loading posts: {error}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-center text-gray-500">
                        This feature will show posts from people you follow. Coming soon!
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SocialFeedPage;
