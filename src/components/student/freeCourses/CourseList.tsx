
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseCard, FreeCourse } from "./CourseCard";

interface CourseListProps {
  courses: FreeCourse[];
  userProgress: Record<string, number>;
  onProgressUpdate: (courseId: string, progress: number) => void;
  onResetFilter: () => void;
}

export const CourseList = ({ courses, userProgress, onProgressUpdate, onResetFilter }: CourseListProps) => {
  if (courses.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed rounded-md">
        <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-xl font-medium text-gray-800 mb-2">No courses found</h3>
        <p className="text-gray-600 mb-6">
          No courses match your current filter. Try changing your filter options.
        </p>
        <Button onClick={onResetFilter}>
          Show All Courses
        </Button>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          progress={userProgress[course.id]}
          onProgressUpdate={onProgressUpdate}
        />
      ))}
    </div>
  );
};
