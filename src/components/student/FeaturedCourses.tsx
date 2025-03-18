
import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Book } from "lucide-react";
import type { Course } from "@/types/course";

interface FeaturedCoursesProps {
  courses: Course[];
}

export const FeaturedCourses = ({ courses }: FeaturedCoursesProps) => {
  const navigate = useNavigate();

  return (
    <div className="mb-12">
      <div className="flex items-center mb-6">
        <Book className="text-primary mr-2 h-5 w-5" />
        <h2 className="text-2xl font-bold">Featured Programming Courses</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden transition-all hover:shadow-lg duration-300">
            <div className="relative">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-48 object-cover"
              />
              <Badge className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600">
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
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">8 semaines</div>
                <Badge variant="outline">{course.path}</Badge>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => navigate(`/student/courses/${course.id}/details`)}
              >
                Voir Détails
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
