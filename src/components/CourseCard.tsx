
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Clock, Users, BarChart, Folder } from "lucide-react";

interface CourseCardProps {
  title: string;
  description: string;
  duration: string;
  students: number;
  image: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
}

const CourseCard = ({ 
  title, 
  description, 
  duration, 
  students, 
  image,
  difficulty,
  category 
}: CourseCardProps) => {
  const difficultyColor = {
    Beginner: "text-green-600 bg-green-50",
    Intermediate: "text-yellow-600 bg-yellow-50",
    Advanced: "text-red-600 bg-red-50"
  }[difficulty];

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
        </div>
      </div>
      <CardHeader>
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
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-primary hover:bg-primary/90">Enroll Now</Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
