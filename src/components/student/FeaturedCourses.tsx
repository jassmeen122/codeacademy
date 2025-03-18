
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Course } from "@/types/course";

interface FeaturedCoursesProps {
  courses: Course[];
}

export const FeaturedCourses = ({ courses }: FeaturedCoursesProps) => {
  const navigate = useNavigate();

  const openVideoUrl = (url: string) => {
    window.open(url, '_blank');
  };

  const renderDifficultyBadge = (difficulty: string) => {
    const colors = {
      Beginner: "bg-green-100 text-green-800",
      Intermediate: "bg-yellow-100 text-yellow-800",
      Advanced: "bg-red-100 text-red-800"
    };
    
    return (
      <span className={`px-2 py-1 rounded-md text-xs font-medium ${colors[difficulty as keyof typeof colors]}`}>
        {difficulty}
      </span>
    );
  };

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Featured Programming Language Courses</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gray-100 relative overflow-hidden">
              <img
                src="/placeholder.svg"
                alt={course.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute top-4 left-4">
                {renderDifficultyBadge(course.difficulty)}
              </div>
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="line-clamp-1 text-lg">{course.title}</CardTitle>
                <span className="text-sm font-medium text-primary">{course.language}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground line-clamp-3 mb-4 text-sm">
                {course.description}
              </p>
              <div className="flex items-center text-sm text-muted-foreground">
                <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                  {course.path}
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button 
                className="w-full bg-primary hover:bg-primary/90 gap-2"
                onClick={() => openVideoUrl(course.videoUrl || "#")}
              >
                <Play className="h-4 w-4" />
                Regarder la vidéo
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate(`/student/courses/${course.id}`)}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Voir plus de détails
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
