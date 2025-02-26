
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CoursePath, CourseLevel } from "@/types/course";

interface CourseFiltersProps {
  selectedLevel: CourseLevel | "all";
  selectedPath: CoursePath | "all";
  onLevelChange: (level: CourseLevel | "all") => void;
  onPathChange: (path: CoursePath | "all") => void;
}

export const CourseFilters = ({
  selectedLevel,
  selectedPath,
  onLevelChange,
  onPathChange
}: CourseFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <Select value={selectedLevel} onValueChange={(value) => onLevelChange(value as CourseLevel | "all")}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Levels</SelectItem>
          <SelectItem value="Beginner">Beginner</SelectItem>
          <SelectItem value="Intermediate">Intermediate</SelectItem>
          <SelectItem value="Advanced">Advanced</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedPath} onValueChange={(value) => onPathChange(value as CoursePath | "all")}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select path" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Paths</SelectItem>
          <SelectItem value="Web Development">Web Development</SelectItem>
          <SelectItem value="Data Science">Data Science</SelectItem>
          <SelectItem value="Artificial Intelligence">Artificial Intelligence</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
