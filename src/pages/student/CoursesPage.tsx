
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CourseTabs } from "@/components/dashboard/CourseTabs";
import type { Course } from "@/types/course";
import { toast } from "sonner";
import { ApiService } from "@/services/api";

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getCourses();
      
      if (!response.success) {
        throw new Error("Failed to fetch courses");
      }

      const transformedCourses: Course[] = response.data.map((course: any) => ({
        id: course._id?.toString() || course.id || "",
        title: course.title,
        description: course.description || "",
        duration: "8 weeks",
        students: 0,
        image: "/placeholder.svg",
        difficulty: course.difficulty,
        path: course.path,
        category: course.category,
        language: "JavaScript",
        professor: {
          name: course.teacher?.name || "Unknown Professor",
          title: "Course Instructor"
        },
        materials: {
          videos: course.course_materials?.filter((m: any) => m.type === 'video').length || 0,
          pdfs: course.course_materials?.filter((m: any) => m.type === 'pdf').length || 0,
          presentations: course.course_materials?.filter((m: any) => m.type === 'presentation').length || 0
        }
      }));
      
      setCourses(transformedCourses);
    } catch (error: any) {
      toast.error("Failed to fetch courses");
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Courses</h1>
        <CourseTabs courses={courses} loading={loading} />
      </div>
    </DashboardLayout>
  );
};

export default CoursesPage;
