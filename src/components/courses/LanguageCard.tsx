
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book, Code } from "lucide-react";
import type { ProgrammingLanguage } from '@/types/course';

interface LanguageCardProps {
  language: ProgrammingLanguage;
}

export const LanguageCard = ({ language }: LanguageCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg duration-300">
      <div className="relative h-40 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        {language.image_url ? (
          <img 
            src={language.image_url} 
            alt={language.name} 
            className="h-24 w-24 object-contain"
          />
        ) : (
          <Code className="h-16 w-16 text-white" />
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{language.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {language.description || `Learn ${language.name} programming from beginner to advanced levels.`}
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => navigate(`/student/languages/${language.id}`)}
        >
          <Book className="mr-2 h-4 w-4" />
          Explore Courses
        </Button>
      </CardFooter>
    </Card>
  );
};
