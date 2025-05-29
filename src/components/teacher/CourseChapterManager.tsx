
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RichTextEditor } from './RichTextEditor';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  BookOpen, 
  Users,
  CheckCircle,
  Clock
} from 'lucide-react';

interface Chapter {
  id: string;
  title: string;
  content: string;
  module_id: string;
  is_published: boolean;
  order_index: number;
  requires_completion: boolean;
  created_at: string;
  updated_at: string;
}

interface CourseChapterManagerProps {
  courseId: string;
}

export const CourseChapterManager = ({ courseId }: CourseChapterManagerProps) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [readingStats, setReadingStats] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchChapters();
    fetchReadingStats();
  }, [courseId]);

  const fetchChapters = async () => {
    try {
      const { data, error } = await supabase
        .from('course_lessons')
        .select('*')
        .eq('module_id', courseId) // Using module_id as course reference
        .order('order_index');
      
      if (error) throw error;
      setChapters(data || []);
    } catch (error) {
      console.error('Error fetching chapters:', error);
      toast.error('Erreur lors du chargement des chapitres');
    } finally {
      setLoading(false);
    }
  };

  const fetchReadingStats = async () => {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('module_id, completed')
        .eq('completed', true);
      
      if (error) throw error;
      
      const stats: Record<string, number> = {};
      data?.forEach(progress => {
        stats[progress.module_id] = (stats[progress.module_id] || 0) + 1;
      });
      
      setReadingStats(stats);
    } catch (error) {
      console.error('Error fetching reading stats:', error);
    }
  };

  const handleSaveChapter = async (chapterData: any) => {
    try {
      const nextOrderIndex = Math.max(...chapters.map(c => c.order_index), 0) + 1;
      
      if (editingChapter) {
        // Update existing chapter
        const { error } = await supabase
          .from('course_lessons')
          .update({
            title: chapterData.title,
            content: chapterData.content,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingChapter.id);
        
        if (error) throw error;
        toast.success('Chapitre mis à jour');
      } else {
        // Create new chapter
        const { error } = await supabase
          .from('course_lessons')
          .insert({
            title: chapterData.title,
            content: chapterData.content,
            module_id: courseId,
            order_index: nextOrderIndex,
            is_published: false,
            requires_completion: true
          });
        
        if (error) throw error;
        toast.success('Chapitre créé');
      }
      
      fetchChapters();
      setShowEditor(false);
      setEditingChapter(null);
    } catch (error) {
      console.error('Error saving chapter:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const togglePublished = async (chapter: Chapter) => {
    try {
      const { error } = await supabase
        .from('course_lessons')
        .update({ is_published: !chapter.is_published })
        .eq('id', chapter.id);
      
      if (error) throw error;
      
      toast.success(chapter.is_published ? 'Chapitre dépublié' : 'Chapitre publié');
      fetchChapters();
    } catch (error) {
      console.error('Error toggling publish status:', error);
      toast.error('Erreur lors de la publication');
    }
  };

  const deleteChapter = async (chapterId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce chapitre ?')) return;
    
    try {
      const { error } = await supabase
        .from('course_lessons')
        .delete()
        .eq('id', chapterId);
      
      if (error) throw error;
      
      toast.success('Chapitre supprimé');
      fetchChapters();
    } catch (error) {
      console.error('Error deleting chapter:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>;
  }

  if (showEditor) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {editingChapter ? 'Modifier le chapitre' : 'Nouveau chapitre'}
          </h3>
          <Button
            variant="outline"
            onClick={() => {
              setShowEditor(false);
              setEditingChapter(null);
            }}
          >
            Annuler
          </Button>
        </div>
        
        <RichTextEditor
          courseId={courseId}
          onSave={handleSaveChapter}
          initialContent={editingChapter}
        />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Chapitres du Cours
          </CardTitle>
          <Button onClick={() => setShowEditor(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Chapitre
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {chapters.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Aucun chapitre créé pour le moment</p>
            <p className="text-sm">Cliquez sur "Nouveau Chapitre" pour commencer</p>
          </div>
        ) : (
          <div className="space-y-4">
            {chapters.map((chapter, index) => (
              <Card key={chapter.id} className="border">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-500">
                          Chapitre {index + 1}
                        </span>
                        <Badge variant={chapter.is_published ? "default" : "secondary"}>
                          {chapter.is_published ? "Publié" : "Brouillon"}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-lg mb-2">{chapter.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{readingStats[chapter.id] || 0} lectures</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            Créé le {new Date(chapter.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingChapter(chapter);
                          setShowEditor(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={chapter.is_published ? "secondary" : "default"}
                        size="sm"
                        onClick={() => togglePublished(chapter)}
                      >
                        {chapter.is_published ? (
                          <>
                            <Eye className="h-4 w-4 mr-1" />
                            Publié
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Publier
                          </>
                        )}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteChapter(chapter.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
