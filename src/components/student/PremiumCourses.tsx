
import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Clock } from "lucide-react";
import type { Course } from "@/types/course";

interface PremiumCoursesProps {
  courses: Course[];
}

export const PremiumCourses = ({ courses }: PremiumCoursesProps) => {
  const navigate = useNavigate();

  return (
    <div className="mb-12">
      <div className="flex items-center mb-6">
        <Sparkles className="text-yellow-500 mr-2 h-5 w-5" />
        <h2 className="text-2xl font-bold">Premium AI Courses</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden transition-all hover:shadow-lg duration-300">
            <div className="relative">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-48 object-cover"
              />
              <Badge className="absolute top-4 right-4 bg-yellow-500 hover:bg-yellow-600">
                Premium
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
                <div className="flex items-center space-x-2 text-sm font-medium">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{course.duration}</span>
                </div>
                <div className="text-xl font-bold">${course.price}</div>
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
    </div>
  );
};
