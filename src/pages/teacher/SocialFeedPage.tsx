
import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { CreatePostForm } from '@/components/social/CreatePostForm';
import { PostCard } from '@/components/social/PostCard';
import { useSocialPosts } from '@/hooks/useSocialPosts';
import { Users, Loader2 } from 'lucide-react';

const TeacherSocialFeedPage = () => {
  const { posts, loading, createPost, addComment, addReaction, deletePost } = useSocialPosts();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <PageHeader
          title="Feed Social - Espace Professeur"
          description="Partagez vos connaissances et connectez-vous avec la communauté éducative"
          icon={Users}
        />

        {/* Formulaire de création de post */}
        <div className="mb-8">
          <CreatePostForm onCreate={createPost} />
        </div>

        {/* Liste des posts */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucun post pour le moment</h3>
              <p className="text-muted-foreground">
                Soyez le premier à partager quelque chose avec la communauté !
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onAddComment={addComment}
                onAddReaction={addReaction}
                onDelete={deletePost}
              />
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherSocialFeedPage;
