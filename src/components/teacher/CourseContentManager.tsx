
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UniversalContentEditor } from './UniversalContentEditor';
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
  Clock,
  FileText
} from 'lucide-react';

interface CourseContent {
  id: string;
  title: string;
  content: string;
  content_type: string;
  course_id: string;
  is_published: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

interface CourseContentManagerProps {
  courseId: string;
}

export const CourseContentManager = ({ courseId }: CourseContentManagerProps) => {
  const [contents, setContents] = useState<CourseContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingContent, setEditingContent] = useState<CourseContent | null>(null);

  useEffect(() => {
    fetchContents();
  }, [courseId]);

  const fetchContents = async () => {
    try {
      const { data, error } = await supabase
        .from('course_content')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index');
      
      if (error) throw error;
      setContents(data || []);
    } catch (error) {
      console.error('Error fetching course content:', error);
      toast.error('Erreur lors du chargement du contenu');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContent = async (contentData: any) => {
    try {
      const nextOrderIndex = Math.max(...contents.map(c => c.order_index), 0) + 1;
      
      if (editingContent) {
        // Update existing content
        const { error } = await supabase
          .from('course_content')
          .update({
            title: contentData.title,
            content: contentData.content,
            content_type: contentData.content_type,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingContent.id);
        
        if (error) throw error;
        toast.success('Contenu mis à jour');
      } else {
        // Create new content
        const { error } = await supabase
          .from('course_content')
          .insert({
            title: contentData.title,
            content: contentData.content,
            content_type: contentData.content_type,
            course_id: courseId,
            order_index: nextOrderIndex,
            is_published: false
          });
        
        if (error) throw error;
        toast.success('Contenu créé');
      }
      
      fetchContents();
      setShowEditor(false);
      setEditingContent(null);
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const togglePublished = async (content: CourseContent) => {
    try {
      const { error } = await supabase
        .from('course_content')
        .update({ is_published: !content.is_published })
        .eq('id', content.id);
      
      if (error) throw error;
      
      toast.success(content.is_published ? 'Contenu dépublié' : 'Contenu publié');
      fetchContents();
    } catch (error) {
      console.error('Error toggling publish status:', error);
      toast.error('Erreur lors de la publication');
    }
  };

  const deleteContent = async (contentId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce contenu ?')) return;
    
    try {
      const { error } = await supabase
        .from('course_content')
        .delete()
        .eq('id', contentId);
      
      if (error) throw error;
      
      toast.success('Contenu supprimé');
      fetchContents();
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'chapter': return 'Chapitre';
      case 'module': return 'Module';
      case 'summary': return 'Résumé';
      case 'lesson': return 'Leçon';
      default: return type;
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'chapter': return 'bg-blue-100 text-blue-800';
      case 'module': return 'bg-green-100 text-green-800';
      case 'summary': return 'bg-yellow-100 text-yellow-800';
      case 'lesson': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
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
            {editingContent ? 'Modifier le contenu' : 'Nouveau contenu'}
          </h3>
          <Button
            variant="outline"
            onClick={() => {
              setShowEditor(false);
              setEditingContent(null);
            }}
          >
            Annuler
          </Button>
        </div>
        
        <UniversalContentEditor
          contentType="course"
          courseId={courseId}
          onSave={handleSaveContent}
          initialContent={editingContent}
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
            Contenu du Cours
          </CardTitle>
          <Button onClick={() => setShowEditor(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Contenu
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {contents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Aucun contenu créé pour le moment</p>
            <p className="text-sm">Cliquez sur "Nouveau Contenu" pour commencer</p>
          </div>
        ) : (
          <div className="space-y-4">
            {contents.map((content, index) => (
              <Card key={content.id} className="border">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-500">
                          #{index + 1}
                        </span>
                        <Badge className={getContentTypeColor(content.content_type)}>
                          {getContentTypeLabel(content.content_type)}
                        </Badge>
                        <Badge variant={content.is_published ? "default" : "secondary"}>
                          {content.is_published ? "Publié" : "Brouillon"}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-lg mb-2">{content.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            Créé le {new Date(content.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingContent(content);
                          setShowEditor(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={content.is_published ? "secondary" : "default"}
                        size="sm"
                        onClick={() => togglePublished(content)}
                      >
                        {content.is_published ? (
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
                        onClick={() => deleteContent(content.id)}
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
