import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Clock, 
  UserCheck, 
  ExternalLink, 
  FileText,
  Download,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";
import { useProgressTracking } from '@/hooks/useProgressTracking';

export interface CourseResource {
  pdf: boolean;
  presentation: boolean;
}

export interface FreeCourse {
  id: string;
  language: string;
  title: string;
  description: string;
  image: string;
  youtubeUrl: string;
  difficulty: string;
  estimatedHours: number;
  students: number;
  category: string;
  resources: CourseResource;
}

interface CourseCardProps {
  course: FreeCourse;
  progress?: number;
  onProgressUpdate: (courseId: string, progress: number) => void;
}

export const CourseCard = ({ course, progress, onProgressUpdate }: CourseCardProps) => {
  const navigate = useNavigate();
  const { trackVideoProgress } = useProgressTracking();
  
  const downloadResource = (courseId: string, resourceType: 'pdf' | 'presentation') => {
    // In a real app, this would download actual files
    toast.success(`Downloading ${resourceType} for ${courseId} course`);
  };

  const handleWatchCourse = async () => {
    // Update progress if not started
    if (!progress) {
      onProgressUpdate(course.id, 5);
    }
    
    // Track video progress (simulating full completion since we're opening in a new tab)
    await trackVideoProgress(course.id, course.language, 100, false);
    
    // Open YouTube in new tab
    window.open(course.youtubeUrl, '_blank');
  };

  return (
    <Card key={course.id} className="overflow-hidden flex flex-col">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={course.image}
          alt={course.language}
          className="object-cover w-full h-full"
        />
        <div className="absolute top-2 right-2">
          <Badge className="bg-primary">{course.language}</Badge>
        </div>
        {progress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
            <div 
              className="h-full bg-green-500" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
      
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{course.title}</CardTitle>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4 mr-1" />
          {course.category}
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-muted-foreground mb-4">{course.description}</p>
        
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {course.estimatedHours} hours
          </div>
          <div className="flex items-center">
            <UserCheck className="h-4 w-4 mr-1" />
            {course.students.toLocaleString()} students
          </div>
        </div>
        
        {progress !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Your progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Resources */}
        <div className="mt-4 space-y-2">
          <h4 className="font-medium">Free Resources:</h4>
          <div className="flex gap-2">
            {course.resources.pdf && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={() => downloadResource(course.id, 'pdf')}
              >
                <FileText className="h-4 w-4" />
                PDF Notes
              </Button>
            )}
            {course.resources.presentation && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={() => downloadResource(course.id, 'presentation')}
              >
                <Download className="h-4 w-4" />
                Slides
              </Button>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2 pt-2">
        <Button 
          className="flex-1"
          onClick={handleWatchCourse}
        >
          Watch Course
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
        <Button 
          variant="outline"
          onClick={() => navigate(`/student/courses/${course.id}/discussion`)}
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
