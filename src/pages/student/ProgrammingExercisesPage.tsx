
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Youtube, Code, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ProgrammingLanguage } from "@/types/course";
import { useLanguageResources } from "@/hooks/useProgrammingResources";
import { YoutubeEmbed } from "@/components/courses/YoutubeEmbed";

const ProgrammingExercisesPage = () => {
  const { languageId } = useParams<{ languageId: string }>();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<ProgrammingLanguage | null>(null);
  const [loading, setLoading] = useState(true);
  const { effectiveResources, loading: resourcesLoading } = useLanguageResources(languageId || null);

  useEffect(() => {
    const fetchLanguage = async () => {
      if (!languageId) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('programming_languages')
          .select('*')
          .eq('id', languageId)
          .single();
          
        if (error) throw error;
        
        setLanguage(data as ProgrammingLanguage);
      } catch (err: any) {
        console.error("Error fetching language:", err);
        toast.error("Impossible de charger les informations du langage");
      } finally {
        setLoading(false);
      }
    };

    fetchLanguage();
  }, [languageId]);

  const getYoutubeVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  if (loading || resourcesLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="sm"
              className="mr-2"
              onClick={() => navigate(`/student/programming/${languageId}`)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
          </div>
          
          <div className="grid grid-cols-1 gap-8">
            <Card>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-40 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="mr-2"
            onClick={() => navigate(`/student/programming/${languageId}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au cours
          </Button>
          <div className="flex items-center">
            {language?.image_url && (
              <img 
                src={language.image_url} 
                alt={language?.name} 
                className="h-8 w-8 mr-2 object-contain" 
              />
            )}
            <h1 className="text-3xl font-bold">Exercices {language?.name}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Vidéo d'exercices */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Youtube className="h-5 w-5 mr-2 text-red-500" />
                  Vidéo explicative des exercices {language?.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {effectiveResources?.exercise_video_url && (
                  <YoutubeEmbed 
                    videoId={getYoutubeVideoId(effectiveResources.exercise_video_url) || ''}
                    title={`Exercices ${language?.name}`}
                  />
                )}
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Code className="h-5 w-5 mr-2 text-blue-500" />
                  Comment compléter les exercices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Pour compléter ces exercices {language?.name}, suivez ces étapes :
                  </p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Téléchargez le fichier PDF des exercices depuis la barre latérale</li>
                    <li>Regardez la vidéo explicative ci-dessus pour comprendre les concepts</li>
                    <li>Essayez de résoudre les exercices par vous-même</li>
                    <li>Vérifiez vos réponses avec les solutions fournies ou utilisez le vérificateur de code en ligne</li>
                  </ol>
                  <p className="text-muted-foreground mt-4">
                    Si vous avez des difficultés, n'hésitez pas à revoir les concepts du cours ou à poser vos questions dans le forum de discussion.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Ressources d'exercices */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-green-500" />
                  Ressources des exercices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {effectiveResources?.exercise_pdf_url && (
                    <a 
                      href={effectiveResources.exercise_pdf_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center p-3 border rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <FileText className="h-5 w-5 mr-3 text-red-500" />
                      <div className="flex-grow">
                        <p className="font-medium">Exercices pratiques</p>
                        <p className="text-xs text-muted-foreground">PDF - Télécharger</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </a>
                  )}
                  
                  {effectiveResources?.course_pdf_url && (
                    <a 
                      href={effectiveResources.course_pdf_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center p-3 border rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <FileText className="h-5 w-5 mr-3 text-blue-500" />
                      <div className="flex-grow">
                        <p className="font-medium">Matériel de référence</p>
                        <p className="text-xs text-muted-foreground">PDF - Télécharger</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </a>
                  )}
                  
                  <a 
                    href={`/student/code-editor?language=${language?.name.toLowerCase()}`}
                    className="flex items-center p-3 border rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <Code className="h-5 w-5 mr-3 text-purple-500" />
                    <div className="flex-grow">
                      <p className="font-medium">Éditeur de code en ligne</p>
                      <p className="text-xs text-muted-foreground">Testez votre code</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </a>
                </div>
              </CardContent>
            </Card>
            
            {/* Bouton retour au cours */}
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate(`/student/programming/${languageId}`)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au cours
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProgrammingExercisesPage;
