
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  CheckCircle, 
  Circle, 
  BookOpen, 
  ArrowLeft, 
  ArrowRight,
  Clock,
  User
} from 'lucide-react';

interface Chapter {
  id: string;
  title: string;
  content: string;
  order_index: number;
  is_published: boolean;
  created_at: string;
}

interface ChapterReaderProps {
  courseId: string;
  userId: string;
}

export const ChapterReader = ({ courseId, userId }: ChapterReaderProps) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [readChapters, setReadChapters] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChapters();
    fetchUserProgress();
  }, [courseId, userId]);

  const fetchChapters = async () => {
    try {
      const { data, error } = await supabase
        .from('course_lessons')
        .select('*')
        .eq('module_id', courseId)
        .eq('is_published', true)
        .order('order_index');
      
      if (error) throw error;
      
      setChapters(data || []);
      if (data && data.length > 0) {
        setCurrentChapter(data[0]);
      }
    } catch (error) {
      console.error('Error fetching chapters:', error);
      toast.error('Erreur lors du chargement des chapitres');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('module_id')
        .eq('user_id', userId)
        .eq('completed', true);
      
      if (error) throw error;
      
      const readIds = new Set(data?.map(p => p.module_id) || []);
      setReadChapters(readIds);
    } catch (error) {
      console.error('Error fetching user progress:', error);
    }
  };

  const markAsRead = async (chapterId: string) => {
    try {
      // Check if progress already exists
      const { data: existingProgress } = await supabase
        .from('user_progress')
        .select('id')
        .eq('user_id', userId)
        .eq('module_id', chapterId)
        .single();

      if (existingProgress) {
        // Update existing record
        const { error } = await supabase
          .from('user_progress')
          .update({
            completed: true,
            last_accessed: new Date().toISOString()
          })
          .eq('id', existingProgress.id);
        
        if (error) throw error;
      } else {
        // Create new record
        const { error } = await supabase
          .from('user_progress')
          .insert({
            user_id: userId,
            module_id: chapterId,
            completed: true,
            last_accessed: new Date().toISOString()
          });
        
        if (error) throw error;
      }
      
      setReadChapters(prev => new Set([...prev, chapterId]));
      toast.success('Chapitre marqué comme lu !');
    } catch (error) {
      console.error('Error marking chapter as read:', error);
      toast.error('Erreur lors de la mise à jour du progrès');
    }
  };

  const renderContent = (content: string) => {
    return (
      <div 
        className="prose max-w-none prose-lg"
        dangerouslySetInnerHTML={{ 
          __html: content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/<u>(.*?)<\/u>/g, '<span style="text-decoration: underline;">$1</span>')
            .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto"><code class="text-sm">$1</code></pre>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-500 underline hover:text-blue-700" target="_blank" rel="noopener noreferrer">$1</a>')
            .replace(/^- (.*)$/gm, '<ul><li>$1</li></ul>')
            .replace(/^1\. (.*)$/gm, '<ol><li>$1</li></ol>')
            .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />')
            .replace(/\n/g, '<br>')
        }} 
      />
    );
  };

  const navigateChapter = (direction: 'prev' | 'next') => {
    if (!currentChapter) return;
    
    const currentIndex = chapters.findIndex(c => c.id === currentChapter.id);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = Math.max(0, currentIndex - 1);
    } else {
      newIndex = Math.min(chapters.length - 1, currentIndex + 1);
    }
    
    setCurrentChapter(chapters[newIndex]);
  };

  const progressPercentage = (readChapters.size / chapters.length) * 100;

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>;
  }

  if (chapters.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">Aucun chapitre disponible pour ce cours</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar avec liste des chapitres */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Progression du cours</CardTitle>
            <div className="space-y-2">
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-xs text-gray-600">
                {readChapters.size} / {chapters.length} chapitres lus
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              {chapters.map((chapter, index) => (
                <button
                  key={chapter.id}
                  onClick={() => setCurrentChapter(chapter)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    currentChapter?.id === chapter.id
                      ? 'bg-blue-50 border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {readChapters.has(chapter.id) ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Circle className="h-4 w-4 text-gray-300" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-1">
                        Chapitre {index + 1}
                      </p>
                      <p className="text-sm font-medium truncate">
                        {chapter.title}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contenu principal */}
      <div className="lg:col-span-3">
        {currentChapter && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">
                      Chapitre {chapters.findIndex(c => c.id === currentChapter.id) + 1}
                    </Badge>
                    {readChapters.has(currentChapter.id) && (
                      <Badge variant="default" className="bg-green-500">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Lu
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-2xl">{currentChapter.title}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      Publié le {new Date(currentChapter.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Contenu du chapitre */}
                <div className="min-h-[400px]">
                  {renderContent(currentChapter.content)}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => navigateChapter('prev')}
                    disabled={chapters.findIndex(c => c.id === currentChapter.id) === 0}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Précédent
                  </Button>

                  <div className="flex gap-2">
                    {!readChapters.has(currentChapter.id) && (
                      <Button 
                        onClick={() => markAsRead(currentChapter.id)}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Marquer comme lu
                      </Button>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => navigateChapter('next')}
                    disabled={chapters.findIndex(c => c.id === currentChapter.id) === chapters.length - 1}
                  >
                    Suivant
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
