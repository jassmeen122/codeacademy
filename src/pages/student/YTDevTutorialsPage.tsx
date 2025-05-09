
import React, { useState } from 'react';
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Book, 
  Code, 
  PlayCircle, 
  Youtube,
  Search,
  Tag,
  BookOpen,
  Terminal,
  FileCode
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { languageVideoMap, openYoutubeVideo } from '@/utils/youtubeVideoMap';
import { useProgrammingLanguages } from '@/hooks/useProgrammingCourses';
import { Skeleton } from '@/components/ui/skeleton';

const YTDevTutorialsPage = () => {
  const navigate = useNavigate();
  const { languages, loading } = useProgrammingLanguages();
  const [videoType, setVideoType] = useState<'course' | 'exercises'>('course');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('allLanguages');
  
  const handleOpenVideo = (languageId: string) => {
    const videos = languageVideoMap[languageId];
    if (videos) {
      openYoutubeVideo(videoType === 'course' ? videos.courseVideo : videos.exercisesVideo);
    }
  };
  
  const handleViewSummary = (languageId: string) => {
    navigate(`/student/language-summary/${languageId}`);
  };

  const getLanguageIcon = (languageId: string) => {
    switch (languageId) {
      case 'python':
        return <Badge className="bg-blue-100 text-blue-800 ml-1">Python</Badge>;
      case 'javascript':
        return <Badge className="bg-yellow-100 text-yellow-800 ml-1">JavaScript</Badge>;
      case 'java':
        return <Badge className="bg-orange-100 text-orange-800 ml-1">Java</Badge>;
      case 'cpp':
        return <Badge className="bg-purple-100 text-purple-800 ml-1">C++</Badge>;
      case 'c':
        return <Badge className="bg-gray-100 text-gray-800 ml-1">C</Badge>;
      case 'php':
        return <Badge className="bg-indigo-100 text-indigo-800 ml-1">PHP</Badge>;
      case 'sql':
        return <Badge className="bg-green-100 text-green-800 ml-1">SQL</Badge>;
      default:
        return null;
    }
  };

  const getLanguageBgClass = (languageId: string) => {
    switch (languageId) {
      case 'python':
        return 'from-blue-50 to-blue-100 border-blue-200';
      case 'javascript':
        return 'from-yellow-50 to-yellow-100 border-yellow-200';
      case 'java':
        return 'from-orange-50 to-orange-100 border-orange-200';
      case 'cpp':
        return 'from-purple-50 to-purple-100 border-purple-200';
      case 'c':
        return 'from-gray-50 to-gray-100 border-gray-200';
      case 'php':
        return 'from-indigo-50 to-indigo-100 border-indigo-200';
      case 'sql':
        return 'from-green-50 to-green-100 border-green-200';
      default:
        return 'from-gray-50 to-gray-100 border-gray-200';
    }
  };

  const getLanguageImageUrl = (languageId: string) => {
    switch (languageId) {
      case 'python':
        return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg';
      case 'javascript':
        return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg';
      case 'java':
        return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg';
      case 'cpp':
        return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg';
      case 'c':
        return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg';
      case 'php':
        return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-plain.svg';
      case 'sql':
        return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg';
      default:
        return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/devicon/devicon-original.svg';
    }
  };

  const filteredLanguages = Object.keys(languageVideoMap).filter(languageId => {
    const languageName = languages.find(l => l.id === languageId)?.name || languageId;
    return languageName.toLowerCase().includes(searchTerm.toLowerCase()) || languageId.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl p-8 mb-8 shadow-lg">
          <h1 className="text-4xl font-bold mb-3 flex items-center">
            <Youtube className="mr-3 h-8 w-8 text-red-500" />
            Développeur Tutorials
          </h1>
          <p className="text-lg opacity-90 mb-6 max-w-3xl">
            Développez vos compétences avec notre bibliothèque de tutoriels vidéo soigneusement sélectionnés.
            Apprenez à coder dans différents langages de programmation avec des experts.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:w-96 flex-shrink-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <Input 
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary w-full"
                placeholder="Rechercher un langage..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 ml-auto">
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
                <Terminal className="mr-1 h-4 w-4" />
                Exercices
              </Button>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="allLanguages" className="mb-6" onValueChange={setSelectedTab}>
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-slate-100 dark:bg-slate-800">
              <TabsTrigger value="allLanguages" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
                <Tag className="mr-2 h-4 w-4" />
                Tous les langages
              </TabsTrigger>
              <TabsTrigger value="beginner" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
                <BookOpen className="mr-2 h-4 w-4" />
                Débutant
              </TabsTrigger>
              <TabsTrigger value="advanced" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
                <Code className="mr-2 h-4 w-4" />
                Avancé
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="allLanguages" className="mt-0">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-[350px] w-full rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLanguages.map((languageId) => {
                  const languageName = languages.find(l => l.id === languageId)?.name || languageId;
                  return (
                    <Card key={languageId} className={`overflow-hidden border-2 bg-gradient-to-br ${getLanguageBgClass(languageId)} hover:shadow-lg transition-all duration-300`}>
                      <CardHeader className="pb-0">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <img 
                              src={getLanguageImageUrl(languageId)} 
                              alt={languageName} 
                              className="w-10 h-10 mr-3"
                            />
                            <div>
                              <CardTitle className="flex items-center text-xl font-bold">
                                {languageName.charAt(0).toUpperCase() + languageName.slice(1)}
                                {languageId === 'python' && (
                                  <Badge className="bg-green-100 text-green-800 ml-2">Populaire</Badge>
                                )}
                                {languageId === 'javascript' && (
                                  <Badge className="bg-yellow-100 text-yellow-800 ml-2">Tendance</Badge>
                                )}
                              </CardTitle>
                              <div className="text-xs text-slate-500 mt-1 flex gap-1 flex-wrap">
                                {getLanguageIcon(languageId)}
                                {videoType === 'course' ? (
                                  <Badge variant="outline" className="font-normal">Cours complet</Badge>
                                ) : (
                                  <Badge variant="outline" className="font-normal">Exercices pratiques</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="mb-4 text-sm text-gray-600">
                          {videoType === 'course' ? (
                            <>
                              <p className="mb-2 font-medium">Ce que vous apprendrez:</p>
                              <ul className="list-disc pl-5 space-y-1">
                                <li>Les fondamentaux de {languageName}</li>
                                <li>La syntaxe et les structures de données</li>
                                <li>Bonnes pratiques et techniques de débogage</li>
                              </ul>
                            </>
                          ) : (
                            <>
                              <p className="mb-2 font-medium">Compétences pratiques:</p>
                              <ul className="list-disc pl-5 space-y-1">
                                <li>Résolution de problèmes en {languageName}</li>
                                <li>Exercices de difficulté progressive</li>
                                <li>Application des concepts théoriques</li>
                              </ul>
                            </>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-col gap-2">
                        <Button 
                          className="w-full bg-red-600 hover:bg-red-700 text-white"
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
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
            
            {filteredLanguages.length === 0 && !loading && (
              <div className="text-center py-10">
                <FileCode className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun langage trouvé</h3>
                <p className="mt-1 text-gray-500">Essayez un autre terme de recherche.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="beginner" className="mt-0">
            <div className="text-center py-8">
              <BookOpen className="mx-auto h-10 w-10 text-primary" />
              <h3 className="mt-2 text-xl font-medium">Tutoriels pour débutants</h3>
              <p className="mt-2 text-gray-500 max-w-lg mx-auto">
                Cette section présentera des tutoriels spécialement conçus pour les développeurs débutants.
                (Contenu à venir prochainement)
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="mt-0">
            <div className="text-center py-8">
              <Code className="mx-auto h-10 w-10 text-primary" />
              <h3 className="mt-2 text-xl font-medium">Tutoriels avancés</h3>
              <p className="mt-2 text-gray-500 max-w-lg mx-auto">
                Cette section présentera des tutoriels de niveau avancé pour les développeurs expérimentés.
                (Contenu à venir prochainement)
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default YTDevTutorialsPage;
