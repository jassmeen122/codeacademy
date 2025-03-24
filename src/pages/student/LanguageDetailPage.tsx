
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Book, FileCode, Youtube, CheckCircle } from "lucide-react";
import { useLanguageSummary } from '@/hooks/useLanguageSummary';
import { toast } from 'sonner';
import { Badge } from "@/components/ui/badge";
import type { ProgrammingLanguage } from '@/types/course';

interface IFrameProps {
  src: string;
  title: string;
  className?: string;
  allow?: string;
}

// YouTube embed iframe with responsive container
const YouTubeEmbed: React.FC<IFrameProps> = ({ src, title, className = "", allow }) => (
  <div className={`relative w-full pt-[56.25%] ${className}`}>
    <iframe
      src={src}
      title={title}
      className="absolute top-0 left-0 w-full h-full rounded-md"
      allow={allow || "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"}
      allowFullScreen
    ></iframe>
  </div>
);

const LanguageDetailPage = () => {
  const { languageId } = useParams<{ languageId: string }>();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<ProgrammingLanguage | null>(null);
  const [loading, setLoading] = useState(true);
  const { userProgress } = useLanguageSummary(languageId ?? null);

  const getYoutubeEmbedUrl = () => {
    // For Python, we'll use a specific video
    if (language?.name === 'Python') {
      return 'https://www.youtube.com/embed/5sKO0xW4sTw';
    }
    // For JavaScript
    if (language?.name === 'JavaScript') {
      return 'https://www.youtube.com/embed/DHjqpvDnNGE';
    }
    // Default video for other languages
    return 'https://www.youtube.com/embed/5sKO0xW4sTw';
  };

  useEffect(() => {
    async function fetchLanguage() {
      if (!languageId) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('programming_languages')
          .select('*')
          .eq('id', languageId)
          .single();
          
        if (error) throw error;
        setLanguage(data);
      } catch (err) {
        console.error('Error fetching language:', err);
        toast.error("Erreur lors du chargement du langage");
      } finally {
        setLoading(false);
      }
    }
    
    fetchLanguage();
  }, [languageId]);

  const handleExercisesClick = () => {
    if (language?.name === 'Python') {
      navigate(`/student/languages/${languageId}`);
    } else {
      toast.info("Exercices bientôt disponibles pour ce langage !");
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          onClick={() => navigate('/student/languages')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Tous les Langages
        </Button>
        
        {loading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="h-4 bg-gray-100 rounded w-1/4 mb-8" />
            <div className="h-96 bg-gray-100 rounded" />
          </div>
        ) : language ? (
          <>
            <div className="mb-6">
              <h1 className="text-3xl font-bold flex items-center gap-2">
                {language.name}
                {userProgress?.summary_read && (
                  <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Résumé Lu
                  </Badge>
                )}
              </h1>
              <p className="text-gray-600 mt-2">{language.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="col-span-1 md:col-span-3">
                <CardHeader>
                  <CardTitle>Vidéo d'introduction: {language.name}</CardTitle>
                  <CardDescription>
                    Regardez cette vidéo pour découvrir les bases du langage {language.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <YouTubeEmbed 
                    src={getYoutubeEmbedUrl()} 
                    title={`Introduction à ${language.name}`}
                  />
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Résumé du langage</CardTitle>
                  <CardDescription>
                    Concepts fondamentaux de {language.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Accédez au résumé complet du langage {language.name} avec tous ses concepts clés et exemples.
                  </p>
                  <Button 
                    className="w-full"
                    onClick={() => navigate(`/student/languages/${languageId}/summary`)}
                  >
                    <Book className="h-4 w-4 mr-2" />
                    {userProgress?.summary_read ? "Revoir le Résumé" : "Voir le Résumé"}
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Exercices Pratiques</CardTitle>
                  <CardDescription>
                    Mettez en pratique vos connaissances
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Testez vos compétences avec nos exercices pratiques de {language.name}.
                  </p>
                  <Button 
                    className="w-full"
                    onClick={handleExercisesClick}
                  >
                    <FileCode className="h-4 w-4 mr-2" />
                    Faire les Exercices
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Plus de Ressources</CardTitle>
                  <CardDescription>
                    Tutoriels et documentation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Découvrez nos tutoriels vidéo et ressources supplémentaires pour approfondir {language.name}.
                  </p>
                  <Button 
                    className="w-full"
                    onClick={() => navigate('/student/free-courses')}
                  >
                    <Youtube className="h-4 w-4 mr-2" />
                    Voir les Tutoriels
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <Book className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-800 mb-2">Langage Non Trouvé</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Nous n'avons pas pu trouver le langage que vous cherchez. Veuillez essayer un autre langage.
            </p>
            <Button
              onClick={() => navigate('/student/languages')}
              className="mt-6"
            >
              Voir tous les langages
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LanguageDetailPage;
