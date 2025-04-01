
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreatePostForm } from '@/components/social/CreatePostForm';
import { PostCard } from '@/components/social/PostCard';
import { useSocialPosts } from '@/hooks/useSocialPosts';
import { useAuthState } from '@/hooks/useAuthState';
import { usePrivateMessages } from '@/hooks/usePrivateMessages'; 
import { RefreshCw, Users, UserCheck, Inbox, Book, Calendar, Search, Bell, Lightbulb, Code, TrendingUp, Hash, ThumbsUp, MessageSquare, User, UserPlus, Shield } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/hooks/useNotifications';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';

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
    toggleFollow,
    checkFollowing,
    getFollowerCount
  } = useSocialPosts();
  
  const { unreadCount } = useNotifications();
  const { conversations, getUnreadCount } = usePrivateMessages();
  const [unreadMessages, setUnreadMessages] = useState(0);
  const { user } = useAuthState();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('for-you');
  const [filter, setFilter] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const navigate = useNavigate();
  const [followerCount, setFollowerCount] = useState(0);
  const [followingUsers, setFollowingUsers] = useState([]);
  
  useEffect(() => {
    const fetchUnreadMessages = async () => {
      const count = await getUnreadCount();
      setUnreadMessages(count);
    };
    
    if (user) {
      fetchUnreadMessages();
      if (user.id) {
        getFollowerCount(user.id).then(count => setFollowerCount(count));
      }
    }
  }, [user, getUnreadCount]);
  
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
  const handleTabChange = async (value) => {
    setActiveTab(value);
    setRefreshing(true);
    if (value === 'following') {
      await fetchFollowedPosts();
    } else {
      await fetchPosts();
    }
    setRefreshing(false);
  };
  
  // Filter posts by search term and category
  const filteredPosts = posts.filter(post => {
    if (!filter && activeCategory === 'all') return true;
    
    const matchesSearch = !filter || 
      post.content?.toLowerCase().includes(filter.toLowerCase()) ||
      post.author?.full_name?.toLowerCase().includes(filter.toLowerCase()) ||
      post.code_snippet?.toLowerCase().includes(filter.toLowerCase()) ||
      post.language?.toLowerCase().includes(filter.toLowerCase());
    
    let matchesCategory = true;
    if (activeCategory !== 'all') {
      if (activeCategory === 'code' && !post.code_snippet) {
        matchesCategory = false;
      } else if (activeCategory === 'images' && !post.image_url) {
        matchesCategory = false;
      }
    }
    
    return matchesSearch && matchesCategory;
  });

  // Categorized posts
  const categories = [
    { id: 'all', name: 'All Posts', icon: Book },
    { id: 'code', name: 'Code Snippets', icon: Code },
    { id: 'images', name: 'With Images', icon: Calendar },
    { id: 'trending', name: 'Trending', icon: TrendingUp },
  ];
  
  // Trending topics
  const trendingTopics = [
    { tag: 'JavaScript', count: '1.2k' },
    { tag: 'WebDevelopment', count: '856' },
    { tag: 'ReactJS', count: '712' },
    { tag: 'Python', count: '623' },
    { tag: 'MachineLearning', count: '519' },
    { tag: 'Typescript', count: '487' },
    { tag: 'UI/UX', count: '392' },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 transition-all">
        <div className="container mx-auto py-6 px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">Knowledge Share</h1>
            <p className="text-muted-foreground mt-2">
              Share code, ideas, and collaborate with the developer community
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left sidebar */}
            <div className="hidden md:block">
              <Card className="mb-6 border border-gray-100 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                  <CardTitle className="flex items-center gap-2">
                    <Shield size={18} className="text-primary" />
                    Developer Hub
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Avatar className="h-14 w-14 border-2 border-primary shadow-md">
                      <AvatarImage src={user?.avatar_url || ''} alt={user?.full_name || 'User'} />
                      <AvatarFallback className="bg-primary text-white">{(user?.full_name || 'U').charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{user?.full_name || 'Guest User'}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        {user?.role || 'Not logged in'} 
                        {user && <Badge variant="outline" className="text-xs">{followerCount} followers</Badge>}
                      </div>
                    </div>
                  </div>
                  
                  <nav className="space-y-2">
                    <Button 
                      variant={activeTab === 'for-you' ? "default" : "ghost"}
                      className="w-full justify-start shadow-none" 
                      onClick={() => handleTabChange('for-you')}
                    >
                      <Book className="mr-2 h-4 w-4" />
                      For You
                    </Button>
                    <Button 
                      variant={activeTab === 'following' ? "default" : "ghost"}
                      className="w-full justify-start shadow-none" 
                      onClick={() => handleTabChange('following')}
                    >
                      <UserCheck className="mr-2 h-4 w-4" />
                      Following
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start relative" 
                      onClick={navigateToMessages}
                    >
                      <Inbox className="mr-2 h-4 w-4" />
                      Messages
                      {unreadMessages > 0 && (
                        <Badge variant="destructive" className="ml-auto text-xs h-5 min-w-5 flex items-center justify-center">
                          {unreadMessages}
                        </Badge>
                      )}
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start relative"
                      onClick={() => navigate('/student/notifications')}
                    >
                      <Bell className="mr-2 h-4 w-4" />
                      Notifications
                      {unreadCount > 0 && (
                        <Badge variant="destructive" className="ml-auto text-xs h-5 min-w-5 flex items-center justify-center">
                          {unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </nav>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-4">
                    <div className="text-sm font-semibold flex items-center gap-2">
                      <Hash size={14} />
                      Categories
                    </div>
                    
                    {categories.map(category => (
                      <Button 
                        key={category.id}
                        variant={activeCategory === category.id ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setActiveCategory(category.id)}
                      >
                        <category.icon className="mr-2 h-4 w-4" />
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-gray-100 dark:border-gray-800 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp size={18} className="text-primary" />
                    Trending Topics
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[300px]">
                    <div className="p-4 space-y-0">
                      {trendingTopics.map((topic, index) => (
                        <div 
                          key={index}
                          className="py-3 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors px-3 rounded-md cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-sm flex items-center">
                              <Hash size={14} className="mr-1 text-primary" />
                              {topic.tag}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <MessageSquare size={10} />
                              {topic.count} posts
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
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
                    className="pl-8 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center gap-1 ml-2 shadow-sm"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
              
              <Tabs value={activeTab} onValueChange={handleTabChange}>
                <div className="mb-6">
                  <TabsList className="w-full bg-gray-100 dark:bg-gray-800 p-1">
                    <TabsTrigger value="for-you" className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">
                      <Book className="mr-2 h-4 w-4" />
                      For You
                    </TabsTrigger>
                    <TabsTrigger value="following" className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">
                      <UserCheck className="mr-2 h-4 w-4" />
                      Following
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="for-you" className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CreatePostForm onSubmit={createPost} />
                    
                    {loading && !refreshing ? (
                      <Card className="border border-gray-100 dark:border-gray-800 shadow-lg">
                        <CardContent className="flex justify-center p-6">
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                            <p>Loading posts...</p>
                          </div>
                        </CardContent>
                      </Card>
                    ) : error ? (
                      <Card className="border border-red-100 dark:border-red-900 shadow-lg">
                        <CardContent className="p-6">
                          <p className="text-center text-red-500 flex items-center justify-center gap-2">
                            <span className="rounded-full bg-red-100 dark:bg-red-900 p-1">⚠️</span>
                            Error loading posts: {error}
                          </p>
                        </CardContent>
                      </Card>
                    ) : filteredPosts.length === 0 ? (
                      <Card className="border border-gray-100 dark:border-gray-800 shadow-lg">
                        <CardContent className="p-6">
                          <div className="text-center space-y-2">
                            <p className="text-muted-foreground">
                              {filter || activeCategory !== 'all' ? 'No posts match your search' : 'No posts yet. Be the first to post!'}
                            </p>
                            {(filter || activeCategory !== 'all') && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => { setFilter(''); setActiveCategory('all'); }}
                              >
                                Clear filters
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="space-y-4">
                        {filteredPosts.map((post, index) => (
                          <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <PostCard 
                              post={post}
                              onAddComment={addComment}
                              onReaction={addReaction}
                              onDelete={deletePost}
                              onToggleFollow={toggleFollow}
                            />
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="following" className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CreatePostForm onSubmit={createPost} />
                    
                    {!user ? (
                      <Card className="border border-gray-100 dark:border-gray-800 shadow-lg">
                        <CardContent className="p-6">
                          <div className="text-center space-y-4">
                            <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 w-12 h-12 mx-auto flex items-center justify-center">
                              <User size={24} className="text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground">
                              Sign in to see posts from people you follow
                            </p>
                            <Button onClick={() => navigate('/auth')}>
                              Sign In
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ) : loading && !refreshing ? (
                      <Card className="border border-gray-100 dark:border-gray-800 shadow-lg">
                        <CardContent className="flex justify-center p-6">
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                            <p>Loading posts...</p>
                          </div>
                        </CardContent>
                      </Card>
                    ) : error ? (
                      <Card className="border border-red-100 dark:border-red-900 shadow-lg">
                        <CardContent className="p-6">
                          <p className="text-center text-red-500 flex items-center justify-center gap-2">
                            <span className="rounded-full bg-red-100 dark:bg-red-900 p-1">⚠️</span>
                            Error loading posts: {error}
                          </p>
                        </CardContent>
                      </Card>
                    ) : filteredPosts.length === 0 ? (
                      <Card className="border border-gray-100 dark:border-gray-800 shadow-lg">
                        <CardContent className="p-6">
                          <div className="text-center space-y-4">
                            <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 w-12 h-12 mx-auto flex items-center justify-center">
                              <UserPlus size={24} className="text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground">
                              {filter ? 'No posts match your search' : 'No posts from people you follow yet. Follow someone or check back later!'}
                            </p>
                            {filter && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setFilter('')}
                              >
                                Clear search
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="space-y-4">
                        {filteredPosts.map((post, index) => (
                          <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <PostCard 
                              post={post}
                              onAddComment={addComment}
                              onReaction={addReaction}
                              onDelete={deletePost}
                              onToggleFollow={toggleFollow}
                            />
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default KnowledgeSharePage;
