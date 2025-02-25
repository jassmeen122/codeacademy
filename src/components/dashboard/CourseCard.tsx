
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, FileVideo, Layout } from "lucide-react";
import type { Course } from "@/types/course";

export const CourseCard = ({ 
  title, 
  description,
  course_materials 
}: Partial<Course>) => {
  return (
    <Card className="overflow-hidden transition-all hover:scale-[1.02] hover:-translate-y-1 duration-300">
      <CardHeader>
        <CardTitle className="line-clamp-1">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-2 mb-4">{description}</p>
        {course_materials && (
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            {course_materials.some(m => m.type === 'video') && (
              <div className="flex items-center">
                <FileVideo className="h-4 w-4 mr-1" />
                {course_materials.filter(m => m.type === 'video').length} videos
              </div>
            )}
            {course_materials.some(m => m.type === 'pdf') && (
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-1" />
                {course_materials.filter(m => m.type === 'pdf').length} PDFs
              </div>
            )}
            {course_materials.some(m => m.type === 'presentation') && (
              <div className="flex items-center">
                <Layout className="h-4 w-4 mr-1" />
                {course_materials.filter(m => m.type === 'presentation').length} slides
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full">View Course</Button>
      </CardFooter>
    </Card>
  );
};
