
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, BookOpen, Users, BarChart, Clock, Folder, Search, ArrowUp, ArrowDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import type { Course, CourseLevel, CoursePath, CourseCategory } from "@/types/course";

type SortField = "title" | "created_at" | "difficulty" | "path" | "category";
type SortDirection = "asc" | "desc";
type FilterKey = "difficulty" | "path" | "category";

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [filters, setFilters] = useState<Record<FilterKey, string | null>>({
    difficulty: null,
    path: null,
    category: null,
  });
  const navigate = useNavigate();
  const { user } = useAuthState();

  useEffect(() => {
    if (user) {
      fetchCourses();
    }
  }, [user, sortField, sortDirection, filters]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('courses')
        .select(`
          *,
          teacher:teacher_id (
            name:full_name
          )
        `)
        .eq('teacher_id', user?.id);

      // Apply filters - with proper type casting
      if (filters.difficulty) {
        // Make sure the difficulty value is one of the allowed values
        const difficulty = filters.difficulty as CourseLevel;
        query = query.eq('difficulty', difficulty);
      }
      if (filters.path) {
        // Make sure the path value is one of the allowed values
        const path = filters.path as CoursePath;
        query = query.eq('path', path);
      }
      if (filters.category) {
        // Make sure the category value is one of the allowed values
        const category = filters.category as CourseCategory;
        query = query.eq('category', category);
      }

      // Apply sorting
      query = query.order(sortField, { ascending: sortDirection === 'asc' });

      const { data, error } = await query;

      if (error) throw error;
      
      // Transform the data to match our Course type
      const transformedCourses: Course[] = (data || []).map(course => ({
        id: course.id,
        title: course.title,
        description: course.description || "",
        duration: "8 weeks", // Mock data
        students: Math.floor(Math.random() * 50) + 5, // Mock data
        image: "/placeholder.svg", // Placeholder image
        difficulty: course.difficulty,
        path: course.path,
        category: course.category,
        language: "JavaScript", // Mock data
        professor: {
          name: course.teacher?.name || "Unknown",
          title: "Course Instructor"
        },
        materials: {
          videos: Math.floor(Math.random() * 10) + 1, // Mock data
          pdfs: Math.floor(Math.random() * 8) + 1, // Mock data
          presentations: Math.floor(Math.random() * 5) + 1 // Mock data
        }
      }));
      
      // Apply search filter in memory (since we can't do it in the database query easily)
      const filteredCourses = searchTerm
        ? transformedCourses.filter(course => 
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.category.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : transformedCourses;
      
      setCourses(filteredCourses);
    } catch (error: any) {
      toast.error("Failed to fetch courses");
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Debounce the actual search to avoid too many re-renders
    const timer = setTimeout(() => {
      fetchCourses();
    }, 300);
    return () => clearTimeout(timer);
  };

  // Update this function to validate the values before setting them
  const handleFilterChange = (key: FilterKey, value: string | null) => {
    // Validate that the value is acceptable for the given key
    if (value === "all") {
      // Handle "all" selection (clear filter)
      setFilters(prev => ({ ...prev, [key]: null }));
      return;
    }
    
    // If we have a value, make sure it's a valid option for this filter type
    if (value) {
      if (key === "difficulty") {
        // Check if value is a valid CourseLevel
        const validDifficulties: CourseLevel[] = ["Beginner", "Intermediate", "Advanced"];
        if (!validDifficulties.includes(value as CourseLevel)) {
          console.error(`Invalid difficulty value: ${value}`);
          return;
        }
      } else if (key === "path") {
        // Check if value is a valid CoursePath
        const validPaths: CoursePath[] = ["Web Development", "Data Science", "Artificial Intelligence"];
        if (!validPaths.includes(value as CoursePath)) {
          console.error(`Invalid path value: ${value}`);
          return;
        }
      } else if (key === "category") {
        // Check if value is a valid CourseCategory
        const validCategories: CourseCategory[] = [
          "Programming Fundamentals", 
          "Frontend Development", 
          "Backend Development", 
          "Data Analysis", 
          "Machine Learning", 
          "AI Applications"
        ];
        if (!validCategories.includes(value as CourseCategory)) {
          console.error(`Invalid category value: ${value}`);
          return;
        }
      }
    }
    
    // If we passed all validation, update the filter
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const clearFilters = () => {
    setFilters({
      difficulty: null,
      path: null,
      category: null,
    });
    setSearchTerm("");
    setSortField("created_at");
    setSortDirection("desc");
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Courses</h1>
          <Button onClick={() => navigate("/teacher/courses/create")}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Course
          </Button>
        </div>

        <div className="mb-8 bg-white p-4 rounded-lg shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="col-span-1 md:col-span-3 lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search courses..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            
            <div>
              <Select
                value={filters.difficulty || "all"}
                onValueChange={(value) => handleFilterChange("difficulty", value === "all" ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select
                value={filters.path || "all"}
                onValueChange={(value) => handleFilterChange("path", value === "all" ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Path" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Paths</SelectItem>
                  <SelectItem value="Web Development">Web Development</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Artificial Intelligence">Artificial Intelligence</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select
                value={sortField}
                onValueChange={(value) => setSortField(value as SortField)}
              >
                <SelectTrigger className="flex justify-between">
                  <SelectValue placeholder="Sort by" />
                  <button onClick={(e) => { e.stopPropagation(); toggleSortDirection(); }} className="hover:bg-muted p-1 rounded-full">
                    {sortDirection === 'asc' ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                  </button>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="created_at">Date Created</SelectItem>
                  <SelectItem value="difficulty">Difficulty</SelectItem>
                  <SelectItem value="path">Path</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Active filters */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {Object.entries(filters).map(([key, value]) => 
              value && (
                <Badge key={key} variant="secondary" className="flex items-center gap-1">
                  {key}: {value}
                  <button 
                    onClick={() => handleFilterChange(key as FilterKey, null)}
                    className="ml-1 hover:bg-muted rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )
            )}
            {(searchTerm || Object.values(filters).some(Boolean)) && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="h-7 text-xs"
              >
                Clear All
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="overflow-hidden">
                <div className="aspect-video bg-gray-200 animate-pulse" />
                <CardHeader>
                  <div className="h-6 bg-gray-200 animate-pulse rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-100 animate-pulse rounded w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="h-16 bg-gray-100 animate-pulse rounded mb-4" />
                  <div className="flex justify-between">
                    <div className="h-8 bg-gray-200 animate-pulse rounded w-1/3" />
                    <div className="h-8 bg-gray-200 animate-pulse rounded w-1/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-xl font-medium mb-2">No courses found</p>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                {searchTerm || Object.values(filters).some(Boolean) 
                  ? "No courses match your search criteria. Try adjusting your filters."
                  : "You haven't created any courses yet. Start by creating your first course."}
              </p>
              <Button onClick={() => navigate("/teacher/courses/create")}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Your First Course
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((course) => (
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
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CoursesPage;
