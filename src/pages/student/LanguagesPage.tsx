
import React from 'react';
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useProgrammingLanguages } from '@/hooks/useProgrammingCourses';
import { LanguageCard } from '@/components/courses/LanguageCard';
import { GraduationCap, Code } from "lucide-react";

const LanguagesPage = () => {
  const { languages, loading, error } = useProgrammingLanguages();

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Code className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-3xl font-bold text-gray-800">Programming Languages</h1>
        </div>
        
        <p className="text-muted-foreground mb-8">
          Choose a programming language to start learning. Each language has multiple modules that will take you from beginner to advanced levels.
        </p>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-40 bg-gray-200 rounded-t-lg" />
                <div className="p-6 border border-gray-200 border-t-0 rounded-b-lg">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
                  <div className="h-12 bg-gray-100 rounded mb-4" />
                  <div className="h-10 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : languages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {languages.map((language) => (
              <LanguageCard key={language.id} language={language} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <GraduationCap className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-800 mb-2">No Programming Languages Available</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Programming languages are being added soon. Please check back later to start learning.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LanguagesPage;
