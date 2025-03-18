
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Course } from "@/types/course";
import { Skeleton } from "@/components/ui/skeleton";

interface EnrolledCoursesProps {
  courses: Course[];
  loading: boolean;
}

export const EnrolledCourses = ({ courses, loading }: EnrolledCoursesProps) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-video">
              <Skeleton className="h-full w-full" />
            </div>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-2" />
              <Skeleton className="h-4 w-4/6" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
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
          <p className="text-xl font-medium mb-2">Aucun cours inscrit</p>
          <p className="text-muted-foreground mb-6 text-center max-w-md">
            Vous n'êtes inscrit à aucun cours pour le moment. Explorez nos cours et commencez votre parcours d'apprentissage.
          </p>
          <Button onClick={() => navigate("/student/courses")}>
            Explorer les cours
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {courses.map((course) => (
        <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="aspect-video bg-gray-100 relative overflow-hidden">
            <img
              src="/placeholder.svg"
              alt={course.title}
              className="object-cover w-full h-full"
            />
          </div>
          <CardHeader>
            <CardTitle className="line-clamp-1 text-lg">{course.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground line-clamp-2 mb-4 text-sm">
              {course.description}
            </p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {course.duration}
              </div>
              <div className="flex items-center">
                <Users className="h-3 w-3 mr-1" />
                {course.students} students
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full"
              onClick={() => navigate(`/student/learn/${course.id}`)}
            >
              Continue Learning
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
