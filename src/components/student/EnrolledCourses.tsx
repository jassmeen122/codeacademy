
import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Clock } from "lucide-react";
import type { Course } from "@/types/course";

interface EnrolledCoursesProps {
  courses: Course[];
  loading: boolean;
}

export const EnrolledCourses = ({ courses, loading }: EnrolledCoursesProps) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200" />
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-100 rounded w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
              <div className="h-12 bg-gray-100 rounded" />
              <div className="flex justify-between items-center mt-4">
                <div className="h-4 bg-gray-100 rounded w-1/4" />
                <div className="h-6 bg-gray-100 rounded w-1/3" />
              </div>
            </CardContent>
            <CardFooter>
              <div className="h-10 bg-gray-200 rounded w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="col-span-4 bg-gray-50 rounded-lg p-8 text-center">
        <GraduationCap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-xl font-medium text-gray-800 mb-2">Vous n'êtes inscrit à aucun cours</h3>
        <p className="text-gray-600 mb-6">
          Inscrivez-vous à un cours pour commencer votre apprentissage.
        </p>
        <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          Parcourir les cours
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {courses.slice(0, 4).map((course) => (
        <Card key={course.id} className="overflow-hidden transition-all hover:shadow-lg duration-300">
          <div className="relative">
            <img 
              src={course.image} 
              alt={course.title} 
              className="w-full h-48 object-cover"
            />
            <Badge className="absolute top-4 right-4 bg-primary hover:bg-primary/90">
              {course.language}
            </Badge>
          </div>
          <CardHeader>
            <CardTitle className="line-clamp-1">{course.title}</CardTitle>
            <div className="text-sm text-muted-foreground">
              {course.professor.name} • {course.difficulty}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {course.description}
            </p>
            <div className="flex items-center space-x-2 text-sm font-medium">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Estimated Time: {course.duration}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => navigate(`/student/courses/${course.id}/details`)}
            >
              Get Started
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
