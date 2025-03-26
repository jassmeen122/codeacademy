
import { CourseCard } from "./CourseCard";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Course } from "@/types/course";

interface CourseListProps {
  courses: Course[];
  loading: boolean;
  isFiltered: boolean;
}

export const CourseList = ({ courses, loading, isFiltered }: CourseListProps) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <Card key={item} className="overflow-hidden">
            <div className="aspect-video bg-gray-200 animate-pulse" />
            <CardContent className="p-6">
              <div className="h-6 bg-gray-200 animate-pulse rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-100 animate-pulse rounded w-1/2 mb-2" />
              <div className="h-16 bg-gray-100 animate-pulse rounded mb-4" />
              <div className="flex justify-between">
                <div className="h-8 bg-gray-200 animate-pulse rounded w-1/3" />
                <div className="h-8 bg-gray-200 animate-pulse rounded w-1/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-xl font-medium mb-2">No courses found</p>
          <p className="text-muted-foreground mb-6 text-center max-w-md">
            {isFiltered 
              ? "No courses match your search criteria. Try adjusting your filters."
              : "You haven't created any courses yet. Start by creating your first course."}
          </p>
          <Button onClick={() => navigate("/teacher/courses/create")}>
            <PlusCircle className="h-4 w-4 mr-2" />
            {isFiltered ? "Create New Course" : "Create Your First Course"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};
