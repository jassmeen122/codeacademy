
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Clock, Users } from "lucide-react";

interface CourseCardProps {
  title: string;
  description: string;
  duration: string;
  students: number;
  image: string;
}

const CourseCard = ({ title, description, duration, students, image }: CourseCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:scale-[1.02] hover:-translate-y-1 duration-300 animate-fadeIn glass-card">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full transition-transform hover:scale-105 duration-700"
        />
      </div>
      <CardHeader>
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
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-primary hover:bg-primary/90">Enroll Now</Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
