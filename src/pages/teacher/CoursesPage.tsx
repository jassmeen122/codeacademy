
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { toast } from "sonner";
import { CourseFilters, type SortField, type SortDirection, type FilterKey, type Filters } from "@/components/teacher/CourseFilters";
import { CourseList } from "@/components/teacher/CourseList";
import type { Course, CourseLevel, CoursePath, CourseCategory } from "@/types/course";

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [filters, setFilters] = useState<Filters>({
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

  const isFiltered = searchTerm !== "" || Object.values(filters).some(Boolean);

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

        <CourseFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortField={sortField}
          setSortField={setSortField}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          filters={filters}
          setFilters={setFilters}
          onSearch={fetchCourses}
          clearFilters={clearFilters}
        />

        <CourseList 
          courses={courses}
          loading={loading}
          isFiltered={isFiltered}
        />
      </div>
    </DashboardLayout>
  );
};

export default CoursesPage;
