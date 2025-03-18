
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheck, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Course } from "@/types/course";

interface PremiumCoursesProps {
  courses: Course[];
}

export const PremiumCourses = ({ courses }: PremiumCoursesProps) => {
  const navigate = useNavigate();

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold">Premium AI Courses</h2>
          <BadgeCheck className="ml-2 h-5 w-5 text-yellow-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden border-yellow-300 hover:shadow-lg transition-shadow glass-card">
            <div className="aspect-video bg-gray-100 relative overflow-hidden">
              <img
                src="/placeholder.svg"
                alt={course.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute top-0 right-0 bg-yellow-500 text-white px-3 py-1 text-xs font-bold">
                PREMIUM
              </div>
            </div>
            <CardHeader>
              <CardTitle className="line-clamp-1 text-lg">{course.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground line-clamp-3 mb-4 text-sm">
                {course.description}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-primary">{course.difficulty}</span>
                <span className="font-bold text-lg">${course.price?.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => navigate(`/student/paid-courses/${course.id}`)}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Course Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
