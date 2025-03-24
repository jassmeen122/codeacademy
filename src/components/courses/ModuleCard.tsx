
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, Clock, BookOpen } from "lucide-react";
import type { CourseModule } from '@/types/course';

interface ModuleCardProps {
  module: CourseModule;
  isCompleted?: boolean;
}

export const ModuleCard = ({ module, isCompleted = false }: ModuleCardProps) => {
  const navigate = useNavigate();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-lg duration-300 ${isCompleted ? 'border-green-500' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-start gap-2">
          {isCompleted ? (
            <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-1" />
          ) : (
            <Circle className="h-5 w-5 text-gray-300 shrink-0 mt-1" />
          )}
          <div>
            <CardTitle className="text-lg">{module.title}</CardTitle>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(module.difficulty)}`}>
                {module.difficulty}
              </span>
              {module.estimated_duration && (
                <span className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  <Clock className="h-3 w-3" />
                  {module.estimated_duration}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {module.description || `Module ${module.order_index}`}
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          variant={isCompleted ? "outline" : "default"}
          onClick={() => navigate(`/student/modules/${module.id}`)}
        >
          <BookOpen className="mr-2 h-4 w-4" />
          {isCompleted ? 'Review Module' : 'Start Learning'}
        </Button>
      </CardFooter>
    </Card>
  );
};
