
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, User, Calendar, FileText, Play, Edit, Trash2 } from 'lucide-react';
import { useAuthState } from '@/hooks/useAuthState';

interface CoursePublication {
  id: string;
  title: string;
  description: string;
  chapters: string[];
  teacher_name: string;
  teacher_id: string;
  difficulty: string;
  path: string;
  category: string;
  created_at: string;
  file_url?: string;
  video_url?: string;
}

interface CoursePublicationCardProps {
  course: CoursePublication;
  onEdit?: (courseId: string) => void;
  onDelete?: (courseId: string) => void;
  showActions?: boolean;
}

export const CoursePublicationCard = ({ 
  course, 
  onEdit, 
  onDelete, 
  showActions = false 
}: CoursePublicationCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuthState();

  const isOwner = user?.id === course.teacher_id;
  const isAdmin = user?.role === 'admin';

  const handleReadCourse = () => {
    navigate(`/course-publication/${course.id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg duration-300 border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="default" className="mb-2">
            {course.difficulty}
          </Badge>
          <Badge variant="outline">
            {course.category}
          </Badge>
        </div>
        
        <CardTitle className="line-clamp-2 text-xl">
          📘 {course.title}
        </CardTitle>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>🧑‍🏫 Prof : {course.teacher_name}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <p className="text-muted-foreground line-clamp-3 text-sm mb-3">
            📝 <strong>Description :</strong> {course.description}
          </p>
        </div>

        {course.chapters && course.chapters.length > 0 && (
          <div>
            <p className="font-medium text-sm mb-2">📂 Chapitres :</p>
            <div className="space-y-1">
              {course.chapters.slice(0, 3).map((chapter, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></span>
                  <span>{chapter}</span>
                </div>
              ))}
              {course.chapters.length > 3 && (
                <div className="text-xs text-muted-foreground">
                  +{course.chapters.length - 3} autres chapitres...
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(course.created_at)}</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {course.path}
          </Badge>
        </div>

        {(course.file_url || course.video_url) && (
          <div className="flex gap-2">
            {course.file_url && (
              <Badge variant="secondary" className="text-xs">
                <FileText className="h-3 w-3 mr-1" />
                PDF
              </Badge>
            )}
            {course.video_url && (
              <Badge variant="secondary" className="text-xs">
                <Play className="h-3 w-3 mr-1" />
                Vidéo
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex gap-2 w-full">
          <Button 
            onClick={handleReadCourse}
            className="flex-1"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            🔗 Lire le cours
          </Button>
          
          {showActions && (isOwner || isAdmin) && (
            <>
              {isOwner && onEdit && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEdit(course.id)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              
              {(isOwner || isAdmin) && onDelete && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => onDelete(course.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
