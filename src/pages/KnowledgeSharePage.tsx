
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreatePostForm } from '@/components/social/CreatePostForm';
import { PostCard } from '@/components/social/PostCard';
import { useSocialPosts } from '@/hooks/useSocialPosts';
import { useAuthState } from '@/hooks/useAuthState';
import { RefreshCw, Users, UserCheck, Inbox, Book, Calendar, Search, Bell, Lightbulb, Code } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/hooks/useNotifications';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const KnowledgeSharePage = () => {
  const {
    posts,
    loading,
    error,
    fetchPosts,
    fetchFollowedPosts,
    createPost,
    addComment,
    addReaction,
    deletePost,
    toggleFollow
  } = useSocialPosts();
  
  const { unreadCount } = useNotifications();
  const { user } = useAuthState();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('for-you');
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();
  
  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    if (activeTab === 'following') {
      await fetchFollowedPosts();
    } else {
      await fetchPosts();
    }
    setRefreshing(false);
  };

  // Navigate to messages
  const navigateToMessages = () => {
    navigate('/student/messages');
  };
  
  // Handle tab change
  const handleTabChange = async (value: string) => {
    setActiveTab(value);
    setRefreshing(true);
    if (value === 'following') {
      await fetchFollowedPosts();
    } else {
      await fetchPosts();
    }
    setRefreshing(false);
  };
  
  // Filter posts by search term
  const filteredPosts = posts.filter(post => {
    if (!filter) return true;
    const searchTerm = filter.toLowerCase();
    return (
      post.content?.toLowerCase().includes(searchTerm) ||
      post.author?.full_name?.toLowerCase().includes(searchTerm) ||
      post.code_snippet?.toLowerCase().includes(searchTerm) ||
      post.language?.toLowerCase().includes(searchTerm)
    );
  });

  // Categorized posts
  const categories = [
    { id: 'all', name: 'All Posts', icon: Book },
    { id: 'code', name: 'Code Snippets', icon: Code },
    { id: 'events', name: 'Events', icon: Calendar },
    { id: 'ideas', name: 'Ideas', icon: Lightbulb },
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Knowledge Share</h1>
          <p className="text-muted-foreground mt-2">
            Share code, ideas, events, and collaborate with others
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left sidebar */}
          <div className="hidden md:block">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Knowledge Hub</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-6">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={user?.avatar_url || ''} alt={user?.full_name || 'User'} />
                    <AvatarFallback>{(user?.full_name || 'U').charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{user?.full_name || 'Guest User'}</div>
                    <div className="text-sm text-muted-foreground">{user?.role || 'Not logged in'}</div>
                  </div>
                </div>
                
                <nav className="space-y-2">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start" 
                    onClick={() => setActiveTab('for-you')}
                  >
                    <Book className="mr-2 h-4 w-4" />
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
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </nav>
                
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  <div className="text-sm font-semibold">Categories</div>
                  
                  {categories.map(category => (
                    <Button 
                      key={category.id}
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => {/* Handle category filter */}}
                    >
                      <category.icon className="mr-2 h-4 w-4" />
                      {category.name}
                    </Button>
                  ))}
                </div>
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
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search posts..."
                  className="pl-8"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-1 ml-2"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            
            <Tabs value={activeTab} onValueChange={handleTabChange}>
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
                ) : filteredPosts.length === 0 ? (
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-center text-gray-500">
                        {filter ? 'No posts match your search' : 'No posts yet. Be the first to post!'}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredPosts.map(post => (
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
                ) : filteredPosts.length === 0 ? (
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-center text-gray-500">
                        {filter ? 'No posts match your search' : 'No posts from people you follow yet. Follow someone or check back later!'}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredPosts.map(post => (
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
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default KnowledgeSharePage;
