
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users, BarChart, Folder, Zap, Brain } from "lucide-react";
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
    <Card className="overflow-hidden hover:shadow-neon transition-all duration-500 group neon-card">
      <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted relative overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="object-cover w-full h-full transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
        />
        
        {/* Overlay with scan effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute inset-0 scan-effect opacity-0 group-hover:opacity-100" />
        
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border transition-all duration-300 ${
            {
              Beginner: "bg-green-500/20 text-green-300 border-green-500/30 hover:shadow-[0_0_10px_rgb(34,197,94)]",
              Intermediate: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30 hover:shadow-[0_0_10px_rgb(234,179,8)]", 
              Advanced: "bg-red-500/20 text-red-300 border-red-500/30 hover:shadow-[0_0_10px_rgb(239,68,68)]"
            }[course.difficulty]
          }`}>
            {course.difficulty}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border transition-all duration-300 ${
            {
              "Web Development": "bg-blue-500/20 text-blue-300 border-blue-500/30 hover:shadow-[0_0_10px_rgb(59,130,246)]",
              "Data Science": "bg-purple-500/20 text-purple-300 border-purple-500/30 hover:shadow-[0_0_10px_rgb(147,51,234)]",
              "Artificial Intelligence": "bg-indigo-500/20 text-indigo-300 border-indigo-500/30 hover:shadow-[0_0_10px_rgb(99,102,241)]"
            }[course.path]
          }`}>
            {course.path}
          </span>
        </div>
        
        {/* AI Badge */}
        <div className="absolute top-4 right-4 p-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 group-hover:animate-pulse">
          <Brain className="h-4 w-4 text-primary" />
        </div>
      </div>
      
      <CardHeader>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Folder className="h-4 w-4 text-primary group-hover:animate-pulse" />
          <span className="terminal-text">{course.category}</span>
        </div>
        <CardTitle className="line-clamp-1 group-hover:text-gradient transition-all duration-300">
          {course.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <p className="text-muted-foreground line-clamp-2 mb-4 group-hover:text-foreground/80 transition-colors">
          {course.description}
        </p>
        
        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-6">
          <div className="flex items-center group-hover:text-neon-blue transition-colors">
            <Clock className="h-4 w-4 mr-1 group-hover:animate-pulse" />
            {course.duration}
          </div>
          <div className="flex items-center group-hover:text-neon-green transition-colors">
            <Users className="h-4 w-4 mr-1 group-hover:animate-pulse" />
            {course.students} students
          </div>
          <div className="flex items-center group-hover:text-neon-purple transition-colors">
            <BarChart className="h-4 w-4 mr-1 group-hover:animate-pulse" />
            {course.difficulty}
          </div>
        </div>
        
        <div className="flex mt-6 space-x-3">
          <Button 
            className="flex-1 group/btn cyber-border"
            variant="cyber"
            onClick={() => navigate(`/teacher/courses/${course.id}`)}
          >
            <Zap className="h-4 w-4 mr-2 group-hover/btn:animate-pulse" />
            Manage
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover/btn:opacity-100 group-hover/btn:animate-data-flow" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex-none hover:border-primary/50 hover:shadow-neon-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-card border-primary/20">
              <DropdownMenuItem 
                onClick={() => navigate(`/teacher/courses/edit/${course.id}`)}
                className="hover:bg-primary/10 hover:text-primary cursor-pointer"
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => navigate(`/teacher/courses/${course.id}/resources`)}
                className="hover:bg-primary/10 hover:text-primary cursor-pointer"
              >
                Manage Resources
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => navigate(`/teacher/courses/${course.id}/students`)}
                className="hover:bg-primary/10 hover:text-primary cursor-pointer"
              >
                View Students
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem 
                className="text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer" 
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
