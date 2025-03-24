
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, BookOpen } from "lucide-react";

const languages = [
  { id: 'python', name: 'Python', color: 'bg-blue-500' },
  { id: 'java', name: 'Java', color: 'bg-orange-500' },
  { id: 'javascript', name: 'JavaScript', color: 'bg-yellow-500' },
  { id: 'c', name: 'C', color: 'bg-teal-500' },
  { id: 'cpp', name: 'C++', color: 'bg-purple-500' },
  { id: 'php', name: 'PHP', color: 'bg-indigo-500' },
  { id: 'sql', name: 'SQL', color: 'bg-green-500' },
];

const LanguageSelectionPage = () => {
  const navigate = useNavigate();

  const handleLanguageSelect = (languageId: string) => {
    navigate(`/student/language-courses/${languageId}`);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Code className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-3xl font-bold">Sélection du Langage de Programmation</h1>
        </div>
        
        <p className="text-muted-foreground mb-8">
          Choisissez un langage de programmation pour accéder aux cours et exercices vidéo.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {languages.map((language) => (
            <Card key={language.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className={`h-2 ${language.color}`} />
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <h3 className="text-xl font-semibold mb-4">{language.name}</h3>
                  <Button 
                    onClick={() => handleLanguageSelect(language.id)}
                    className="w-full"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Accéder aux cours
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LanguageSelectionPage;
