
import React, { useState } from 'react';
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Book, 
  Code, 
  PlayCircle, 
  Youtube
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { languageVideoMap, openYoutubeVideo } from '@/utils/youtubeVideoMap';
import { useProgrammingLanguages } from '@/hooks/useProgrammingCourses';
import { Skeleton } from '@/components/ui/skeleton';

const YTDevTutorialsPage = () => {
  const navigate = useNavigate();
  const { languages, loading } = useProgrammingLanguages();
  const [videoType, setVideoType] = useState<'course' | 'exercises'>('course');
  
  const handleOpenVideo = (languageId: string) => {
    const videos = languageVideoMap[languageId];
    if (videos) {
      openYoutubeVideo(videoType === 'course' ? videos.courseVideo : videos.exercisesVideo);
    }
  };
  
  const handleViewSummary = (languageId: string) => {
    navigate(`/student/language-summary/${languageId}`);
  };
  
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">YouTube Dev Tutorials</h1>
          <div className="flex gap-2">
            <Button 
              size="sm"
              variant={videoType === 'course' ? 'default' : 'outline'}
              onClick={() => setVideoType('course')}
              className="flex items-center"
            >
              <PlayCircle className="mr-1 h-4 w-4" />
              Cours
            </Button>
            <Button 
              size="sm"
              variant={videoType === 'exercises' ? 'default' : 'outline'}
              onClick={() => setVideoType('exercises')}
              className="flex items-center"
            >
              <Code className="mr-1 h-4 w-4" />
              Exercices
            </Button>
          </div>
        </div>
        
        <p className="text-muted-foreground mb-8">
          Accédez à des tutoriels YouTube pour différents langages de programmation, 
          ainsi qu'à des résumés détaillés pour renforcer votre apprentissage.
        </p>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="bg-primary/10">
                  <Skeleton className="h-8 w-3/4" />
                </CardHeader>
                <CardContent className="pt-6">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.keys(languageVideoMap).map((languageId) => {
              const languageName = languages.find(l => l.id === languageId)?.name || languageId;
              return (
                <Card key={languageId} className="overflow-hidden">
                  <CardHeader className="bg-primary/10">
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Youtube className="mr-2 h-5 w-5 text-red-600" />
                        {languageName}
                      </span>
                      {languageId === 'python' && (
                        <Badge className="bg-green-100 text-green-800">Populaire</Badge>
                      )}
                      {languageId === 'javascript' && (
                        <Badge className="bg-yellow-100 text-yellow-800">Tendance</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="mb-6">
                      {videoType === 'course' 
                        ? `Apprenez les bases de ${languageName} avec ce tutoriel YouTube complet.`
                        : `Pratiquez vos compétences en ${languageName} avec ces exercices guidés.`}
                    </p>
                    <div className="space-y-2">
                      <Button 
                        className="w-full bg-red-600 hover:bg-red-700"
                        onClick={() => handleOpenVideo(languageId)}
                      >
                        <Youtube className="mr-2 h-4 w-4" />
                        Voir le {videoType === 'course' ? 'Cours' : 'Exercices'} sur YouTube
                      </Button>
                      
                      <Button 
                        variant="outline"
                        className="w-full"
                        onClick={() => handleViewSummary(languageId)}
                      >
                        <Book className="mr-2 h-4 w-4" />
                        Voir le Résumé Détaillé
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default YTDevTutorialsPage;
