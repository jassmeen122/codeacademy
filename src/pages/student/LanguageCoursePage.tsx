
import React from 'react';
import { useParams } from 'react-router-dom';
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { YoutubeIcon, FileText, ArrowLeft, Book } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { languageVideoMap, openYoutubeVideo } from '@/utils/youtubeVideoMap';

type LanguageParams = {
  languageId: string;
};

const LanguageCoursePage = () => {
  const { languageId } = useParams<LanguageParams>();
  const navigate = useNavigate();
  
  // Get language name from the ID
  const getLanguageName = (id: string | undefined): string => {
    if (!id) return 'Unknown Language';
    
    const languageNames: Record<string, string> = {
      python: 'Python',
      java: 'Java',
      javascript: 'JavaScript',
      c: 'C',
      cpp: 'C++',
      php: 'PHP',
      sql: 'SQL'
    };
    
    return languageNames[id] || 'Unknown Language';
  };
  
  // Get videos for the language
  const getLanguageVideos = (id: string | undefined) => {
    if (!id || !languageVideoMap[id]) {
      return { courseVideo: '', exercisesVideo: '' };
    }
    
    return languageVideoMap[id];
  };
  
  // Determine language name and videos
  const languageName = getLanguageName(languageId);
  const videos = getLanguageVideos(languageId);

  // If language not found
  if (!videos.courseVideo) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Langage non trouvé</h1>
          <p>Le langage demandé n'existe pas. Veuillez retourner à la sélection des langages.</p>
          <Button onClick={() => navigate('/student/language-selection')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la sélection
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">{languageName} - Cours et Exercices</h1>
          <Button variant="outline" onClick={() => navigate('/student/language-selection')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux langages
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="overflow-hidden">
            <CardHeader className="bg-primary/10">
              <CardTitle className="flex items-center">
                <YoutubeIcon className="mr-2 h-5 w-5 text-red-600" />
                Cours Vidéo
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-6">Accédez au cours complet sur YouTube et apprenez les bases de {languageName}.</p>
              <Button 
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={() => openYoutubeVideo(videos.courseVideo)}
              >
                <YoutubeIcon className="mr-2 h-4 w-4" />
                Voir le Cours sur YouTube
              </Button>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="bg-primary/10">
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                Exercices Pratiques
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-6">Renforcez vos compétences avec ces exercices pratiques sur {languageName}.</p>
              <Button 
                className="w-full"
                onClick={() => openYoutubeVideo(videos.exercisesVideo)}
              >
                <YoutubeIcon className="mr-2 h-4 w-4" />
                Voir les Exercices sur YouTube
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* New card for detailed summary */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-primary/10">
            <CardTitle className="flex items-center">
              <Book className="mr-2 h-5 w-5 text-primary" />
              Résumé Détaillé du Langage
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="mb-6">
              Consultez notre résumé détaillé pour apprendre les concepts clés de {languageName}, 
              avec des explications claires et des exemples pratiques.
            </p>
            <Button 
              className="w-full"
              onClick={() => navigate(`/student/language-summary/${languageId}`)}
            >
              <Book className="mr-2 h-4 w-4" />
              Voir le Résumé Détaillé
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default LanguageCoursePage;
