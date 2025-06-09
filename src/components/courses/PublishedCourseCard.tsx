
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, User, PlayCircle, FileText } from 'lucide-react';
import type { PublishedCourse } from '@/types/course';

interface PublishedCourseCardProps {
  course: PublishedCourse;
  onEnroll?: (courseId: string) => void;
  onContinue?: (courseId: string) => void;
}

export const PublishedCourseCard = ({ 
  course, 
  onEnroll, 
  onContinue 
}: PublishedCourseCardProps) => {
  const navigate = useNavigate();

  const handleCourseAction = () => {
    if (course.is_enrolled) {
      onContinue?.(course.id);
      navigate(`/student/courses/${course.id}/content`);
    } else {
      onEnroll?.(course.id);
    }
  };

  const progressPercentage = course.progress_percentage || 0;
  const isCompleted = progressPercentage === 100;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg duration-300 border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge variant={isCompleted ? "default" : "secondary"}>
            {isCompleted ? "Terminé" : course.is_enrolled ? "En cours" : "Nouveau"}
          </Badge>
          <Badge variant="outline">{course.difficulty}</Badge>
        </div>
        
        <CardTitle className="line-clamp-2 text-xl">{course.title}</CardTitle>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>{course.teacher_name || "Enseignant"}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground line-clamp-3 text-sm">
          {course.description}
        </p>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4 text-primary" />
            <span>{course.total_chapters || 0} chapitres</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-primary" />
            <span>{course.duration}</span>
          </div>
        </div>

        {course.is_enrolled && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progression</span>
              <span className="font-medium">{progressPercentage}% terminé</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="text-xs text-muted-foreground">
              {course.completed_chapters || 0} sur {course.total_chapters || 0} chapitres terminés
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            {course.path}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {course.category}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex gap-2 w-full">
          <Button 
            onClick={handleCourseAction}
            className="flex-1"
            variant={course.is_enrolled ? "outline" : "default"}
          >
            {course.is_enrolled ? (
              <>
                <PlayCircle className="h-4 w-4 mr-2" />
                Continuer
              </>
            ) : (
              <>
                <BookOpen className="h-4 w-4 mr-2" />
                Commencer
              </>
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(`/student/courses/${course.id}/details`)}
          >
            <FileText className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
