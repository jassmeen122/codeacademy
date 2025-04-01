
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CourseCard from "@/components/CourseCard";
import { CourseFilters } from "@/components/courses/CourseFilters";
import type { Course, CoursePath, CourseLevel } from "@/types/course";

interface PopularCoursesSectionProps {
  allCourses: Course[];
  initialCourses: Course[];
  session: any;
}

export const PopularCoursesSection: React.FC<PopularCoursesSectionProps> = ({
  allCourses,
  initialCourses,
  session
}) => {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState<CourseLevel | "all">("all");
  const [selectedPath, setSelectedPath] = useState<CoursePath | "all">("all");

  const filteredCourses = (session ? allCourses : initialCourses).filter(course => {
    const matchesLevel = selectedLevel === "all" || course.difficulty === selectedLevel;
    const matchesPath = selectedPath === "all" || course.path === selectedPath;
    return matchesLevel && matchesPath;
  });

  const renderAuthPrompt = () => (
    <div className="text-center p-8 bg-primary/5 rounded-lg">
      <h3 className="text-2xl font-bold mb-4">Sign In to Access All Courses</h3>
      <p className="text-gray-600 mb-6">
        Please sign in or create an account to view our complete course catalog and start learning.
      </p>
      <Button 
        size="lg"
        className="bg-primary hover:bg-primary/90"
        onClick={() => navigate("/auth")}
      >
        Get Started Now
      </Button>
    </div>
  );

  return (
    <section className="py-16 bg-gray-50/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Nos Cours Populaires</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Commencez votre parcours avec nos cours de programmation les plus populaires,
            enseignés par des professeurs expérimentés d'institutions renommées.
          </p>
        </div>
        
        <CourseFilters
          selectedLevel={selectedLevel}
          selectedPath={selectedPath}
          onLevelChange={setSelectedLevel}
          onPathChange={setSelectedPath}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>

        {!session && (
          <div className="text-center mt-8">
            {renderAuthPrompt()}
          </div>
        )}
      </div>
    </section>
  );
};
