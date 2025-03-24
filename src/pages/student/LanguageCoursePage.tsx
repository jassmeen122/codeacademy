
import React from 'react';
import { useParams } from 'react-router-dom';
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { YoutubeIcon, FileText, ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';

// Définition des liens vidéos pour chaque langage
const languageResources = {
  python: {
    name: 'Python',
    courseVideo: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
    exercisesVideo: 'https://www.youtube.com/watch?v=t8pPdKYpowI'
  },
  java: {
    name: 'Java',
    courseVideo: 'https://www.youtube.com/watch?v=grEKMHGYyns',
    exercisesVideo: 'https://www.youtube.com/watch?v=eIrMbAQSU34'
  },
  javascript: {
    name: 'JavaScript',
    courseVideo: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
    exercisesVideo: 'https://www.youtube.com/watch?v=hdI2bqOjy3c'
  },
  c: {
    name: 'C',
    courseVideo: 'https://www.youtube.com/watch?v=KJgsSFOSQv0',
    exercisesVideo: 'https://www.youtube.com/watch?v=qz2Sj2V4Xew'
  },
  cpp: {
    name: 'C++',
    courseVideo: 'https://www.youtube.com/watch?v=vLnPwxZdW4Y',
    exercisesVideo: 'https://www.youtube.com/watch?v=GQp1zzTwrIg'
  },
  php: {
    name: 'PHP',
    courseVideo: 'https://www.youtube.com/watch?v=OK_JCtrrv-c',
    exercisesVideo: 'https://www.youtube.com/watch?v=2eebptXfEvw'
  },
  sql: {
    name: 'SQL',
    courseVideo: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
    exercisesVideo: 'https://www.youtube.com/watch?v=5cU5xSZXFo8'
  }
};

type LanguageParams = {
  languageId: string;
};

const LanguageCoursePage = () => {
  const { languageId } = useParams<LanguageParams>();
  const navigate = useNavigate();
  
  // Vérifier si le langage existe
  const language = languageId ? languageResources[languageId as keyof typeof languageResources] : null;
  
  if (!language) {
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

  const openYoutubeVideo = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">{language.name} - Cours et Exercices</h1>
          <Button variant="outline" onClick={() => navigate('/student/language-selection')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux langages
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="overflow-hidden">
            <CardHeader className="bg-primary/10">
              <CardTitle className="flex items-center">
                <YoutubeIcon className="mr-2 h-5 w-5 text-red-600" />
                Cours Vidéo
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-6">Accédez au cours complet sur YouTube et apprenez les bases de {language.name}.</p>
              <Button 
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={() => openYoutubeVideo(language.courseVideo)}
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
              <p className="mb-6">Renforcez vos compétences avec ces exercices pratiques sur {language.name}.</p>
              <Button 
                className="w-full"
                onClick={() => openYoutubeVideo(language.exercisesVideo)}
              >
                <YoutubeIcon className="mr-2 h-4 w-4" />
                Voir les Exercices sur YouTube
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LanguageCoursePage;
