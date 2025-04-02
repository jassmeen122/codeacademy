
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CourseCard from "@/components/CourseCard";
import { CourseFilters } from "@/components/courses/CourseFilters";
import { ChevronRight, Sparkles, Crown, Users, Lightbulb } from "lucide-react";
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
    <div className="relative overflow-hidden rounded-2xl shadow-lg border border-indigo-100">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm"></div>
      <div className="relative z-10 p-10 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-4">
          <Crown className="h-8 w-8 text-indigo-600" />
        </div>
        <h3 className="text-2xl font-bold mb-4 text-indigo-900">Déverrouillez Tous Nos Cours</h3>
        <p className="text-indigo-800 mb-8 max-w-md mx-auto">
          Inscrivez-vous pour accéder à notre catalogue complet de cours et commencer votre parcours d'apprentissage dès aujourd'hui.
        </p>
        <Button 
          size="lg"
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all px-8 py-6 h-auto font-semibold text-lg rounded-full"
          onClick={() => navigate("/auth")}
        >
          Commencer Maintenant
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );

  return (
    <section className="py-24 bg-gradient-to-b from-blue-50 to-white relative">
      <div className="absolute inset-0 bg-dots-pattern opacity-[0.15] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full p-2 mr-3">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 bg-clip-text text-transparent">
                Nos Cours Populaires
              </h2>
            </div>
            <p className="text-gray-600 max-w-2xl">
              Commencez votre parcours avec nos cours de programmation les plus populaires,
              enseignés par des professeurs expérimentés d'institutions renommées.
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white shadow-sm rounded-full text-sm">
              <Users className="h-4 w-4 text-indigo-600" />
              <span className="font-medium text-gray-700">+2500 Étudiants</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white shadow-sm rounded-full text-sm">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              <span className="font-medium text-gray-700">Projets Pratiques</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <CourseFilters
            selectedLevel={selectedLevel}
            selectedPath={selectedPath}
            onLevelChange={setSelectedLevel}
            onPathChange={setSelectedPath}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>

        {!session && (
          <div className="mt-16">
            {renderAuthPrompt()}
          </div>
        )}
      </div>
    </section>
  );
};
