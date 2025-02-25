
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Clock, Users, BarChart, Folder, FileVideo, FileText, Layout, User } from "lucide-react";
import type { Course } from "@/types/course";

const CourseCard = ({ 
  title, 
  description, 
  duration, 
  students, 
  image,
  difficulty,
  category,
  path,
  materials,
  professor
}: Course) => {
  const difficultyColor = {
    Beginner: "text-green-600 bg-green-50",
    Intermediate: "text-yellow-600 bg-yellow-50",
    Advanced: "text-red-600 bg-red-50"
  }[difficulty];

  const pathColor = {
    "Web Development": "text-blue-600 bg-blue-50",
    "Data Science": "text-purple-600 bg-purple-50",
    "Artificial Intelligence": "text-indigo-600 bg-indigo-50"
  }[path];

  return (
    <Card className="overflow-hidden transition-all hover:scale-[1.02] hover:-translate-y-1 duration-300 animate-fadeIn glass-card">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full transition-transform hover:scale-105 duration-700"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`px-2 py-1 rounded-md text-xs font-medium ${difficultyColor}`}>
            {difficulty}
          </span>
          <span className={`px-2 py-1 rounded-md text-xs font-medium ${pathColor}`}>
            {path}
          </span>
        </div>
      </div>
      <CardHeader>
        <div className="flex items-center gap-2 text-sm text-primary mb-2">
          <User className="h-4 w-4" />
          {professor.name}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Folder className="h-4 w-4" />
          {category}
        </div>
        <CardTitle className="line-clamp-1 text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-2 mb-4">{description}</p>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {duration}
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {students} students
          </div>
          <div className="flex items-center">
            <BarChart className="h-4 w-4 mr-1" />
            {difficulty}
          </div>
        </div>
        {materials && (
          <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
            {materials.videos && (
              <div className="flex items-center">
                <FileVideo className="h-4 w-4 mr-1" />
                {materials.videos} videos
              </div>
            )}
            {materials.pdfs && (
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-1" />
                {materials.pdfs} PDFs
              </div>
            )}
            {materials.presentations && (
              <div className="flex items-center">
                <Layout className="h-4 w-4 mr-1" />
                {materials.presentations} slides
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-primary hover:bg-primary/90">Enroll Now</Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
