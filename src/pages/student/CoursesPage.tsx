
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
        title: course.title || "Untitled Course",
        description: course.description || "No description available",
        duration: course.duration || "8 weeks",
        students: course.students || 0,
        image: course.image || "/placeholder.svg",
        difficulty: course.difficulty || "Beginner",
        path: course.path || "Web Development",
        category: course.category || "Programming Fundamentals",
        language: course.language || "JavaScript",
        professor: {
          name: course.teacher?.name || course.professor?.name || "Unknown Professor",
          title: course.teacher?.title || course.professor?.title || "Course Instructor"
        },
        materials: {
          videos: course.course_materials?.filter((m: any) => m.type === 'video').length || course.materials?.videos || 0,
          pdfs: course.course_materials?.filter((m: any) => m.type === 'pdf').length || course.materials?.pdfs || 0,
          presentations: course.course_materials?.filter((m: any) => m.type === 'presentation').length || course.materials?.presentations || 0
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
