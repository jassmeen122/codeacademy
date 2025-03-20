
import { Button } from "@/components/ui/button";

interface CourseFiltersProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

export const CourseFilters = ({ currentFilter, onFilterChange }: CourseFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button 
        variant={currentFilter === "all" ? "default" : "outline"} 
        onClick={() => onFilterChange("all")}
      >
        All Courses
      </Button>
      <Button 
        variant={currentFilter === "Beginner" ? "default" : "outline"} 
        onClick={() => onFilterChange("Beginner")}
      >
        Beginner
      </Button>
      <Button 
        variant={currentFilter === "Intermediate" ? "default" : "outline"} 
        onClick={() => onFilterChange("Intermediate")}
      >
        Intermediate
      </Button>
      <Button 
        variant={currentFilter === "Advanced" ? "default" : "outline"} 
        onClick={() => onFilterChange("Advanced")}
      >
        Advanced
      </Button>
      <Button 
        variant={currentFilter === "in-progress" ? "default" : "outline"} 
        onClick={() => onFilterChange("in-progress")}
      >
        In Progress
      </Button>
      <Button 
        variant={currentFilter === "completed" ? "default" : "outline"} 
        onClick={() => onFilterChange("completed")}
      >
        Completed
      </Button>
    </div>
  );
};
