
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users, BarChart, Folder } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Course } from "@/types/course";

interface CourseCardProps {
  course: Course;
}

export const CourseCard = ({ course }: CourseCardProps) => {
  const navigate = useNavigate();

  return (
    <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="object-cover w-full h-full transition-transform hover:scale-105 duration-300"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`px-2 py-1 rounded-md text-xs font-medium ${
            {
              Beginner: "bg-green-100 text-green-800",
              Intermediate: "bg-yellow-100 text-yellow-800", 
              Advanced: "bg-red-100 text-red-800"
            }[course.difficulty]
          }`}>
            {course.difficulty}
          </span>
          <span className={`px-2 py-1 rounded-md text-xs font-medium ${
            {
              "Web Development": "bg-blue-100 text-blue-800",
              "Data Science": "bg-purple-100 text-purple-800",
              "Artificial Intelligence": "bg-indigo-100 text-indigo-800"
            }[course.path]
          }`}>
            {course.path}
          </span>
        </div>
      </div>
      <CardHeader>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Folder className="h-4 w-4" />
          {course.category}
        </div>
        <CardTitle className="line-clamp-1">{course.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-2 mb-4">
          {course.description}
        </p>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {course.duration}
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {course.students} students
          </div>
          <div className="flex items-center">
            <BarChart className="h-4 w-4 mr-1" />
            {course.difficulty}
          </div>
        </div>
        
        <div className="flex mt-6 space-x-3">
          <Button 
            className="flex-1"
            onClick={() => navigate(`/teacher/courses/${course.id}`)}
          >
            Manage
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/teacher/courses/edit/${course.id}`)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/teacher/courses/${course.id}/resources`)}>
                Manage Resources
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/teacher/courses/${course.id}/students`)}>
                View Students
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600" 
                onClick={() => toast.error("Not implemented yet")}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};
