
import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useSocialPosts } from '@/hooks/useSocialPosts';
import { CreatePostForm } from '@/components/social/CreatePostForm';
import { PostCard } from '@/components/social/PostCard';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  TrendingUp,
  Users,
  Sparkles
} from 'lucide-react';

const KnowledgeSharePage = () => {
  const {
    posts,
    loading,
    createPost,
    addComment,
    addReaction,
    deletePost,
    toggleFollow,
    fetchFollowedPosts
  } = useSocialPosts();

  const handleCreatePost = async (content: string, codeSnippet?: string, language?: string, imageUrl?: string) => {
    return await createPost(content, codeSnippet, language, imageUrl);
  };

  const handleComment = async (postId: string, content: string) => {
    return await addComment(postId, content);
  };

  const handleReaction = async (postId: string, reactionType?: string) => {
    return await addReaction(postId, reactionType);
  };

  const handleDelete = async (postId: string) => {
    return await deletePost(postId);
  };

  const handleToggleFollow = async (userId: string) => {
    return await toggleFollow(userId);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6 animate-fade-in">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 animate-slide-in-right">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  Partage de Connaissances
                  <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
                </h1>
                <p className="text-gray-600">Partagez vos découvertes et apprenez des autres</p>
              </div>
            </div>
          </div>

          {/* Tabs for different feeds */}
          <Tabs defaultValue="all" className="w-full mb-6 animate-scale-in">
            <TabsList className="grid w-full grid-cols-2 hover-scale">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Tous les posts
              </TabsTrigger>
              <TabsTrigger value="following" className="flex items-center gap-2" onClick={fetchFollowedPosts}>
                <Users className="h-4 w-4" />
                Mes abonnements
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              {/* Create Post Form */}
              <div className="animate-fade-in">
                <CreatePostForm onSubmit={handleCreatePost} />
              </div>

              {/* Posts List */}
              <div className="space-y-6">
                {posts.length === 0 ? (
                  <div className="text-center py-12 animate-scale-in">
                    <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Aucun post pour le moment</h3>
                    <p className="text-gray-500 mb-4">Soyez le premier à partager vos connaissances !</p>
                    <Button className="hover-scale">
                      Créer le premier post
                    </Button>
                  </div>
                ) : (
                  posts.map((post, index) => (
                    <div 
                      key={post.id} 
                      className="animate-fade-in hover-scale"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <PostCard
                        post={post}
                        onAddComment={handleComment}
                        onReaction={handleReaction}
                        onDelete={handleDelete}
                        onToggleFollow={handleToggleFollow}
                      />
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="following" className="space-y-6">
              {/* Create Post Form */}
              <div className="animate-fade-in">
                <CreatePostForm onSubmit={handleCreatePost} />
              </div>

              {/* Followed Posts List */}
              <div className="space-y-6">
                {posts.length === 0 ? (
                  <div className="text-center py-12 animate-scale-in">
                    <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Aucun post de vos abonnements</h3>
                    <p className="text-gray-500 mb-4">Suivez d'autres utilisateurs pour voir leurs posts ici !</p>
                    <Button className="hover-scale" onClick={() => window.location.reload()}>
                      Découvrir des utilisateurs
                    </Button>
                  </div>
                ) : (
                  posts.map((post, index) => (
                    <div 
                      key={post.id} 
                      className="animate-fade-in hover-scale"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <PostCard
                        post={post}
                        onAddComment={handleComment}
                        onReaction={handleReaction}
                        onDelete={handleDelete}
                        onToggleFollow={handleToggleFollow}
                      />
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default KnowledgeSharePage;
