
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, FileText, Youtube, Code, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ProgrammingLanguage } from "@/types/course";
import { CustomResource, useLanguageResources, useUploadLanguageResource } from "@/hooks/useProgrammingResources";
import { YoutubeEmbed } from "@/components/courses/YoutubeEmbed";

const TeacherLanguageResourcesPage = () => {
  const { languageId } = useParams<{ languageId: string }>();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<ProgrammingLanguage | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const { 
    defaultResources, 
    customResources, 
    effectiveResources,
    loading: resourcesLoading 
  } = useLanguageResources(languageId || null);
  const { uploadResource, uploading } = useUploadLanguageResource();

  // Form state
  const [courseVideoUrl, setCourseVideoUrl] = useState("");
  const [coursePdfFile, setCoursePdfFile] = useState<File | null>(null);
  const [exerciseVideoUrl, setExerciseVideoUrl] = useState("");
  const [exercisePdfFile, setExercisePdfFile] = useState<File | null>(null);

  useEffect(() => {
    // Get current user
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser({ id: user.id });
      }
    };

    getCurrentUser();
  }, []);

  useEffect(() => {
    // Set form values from custom resources if they exist
    if (customResources) {
      if (customResources.course_video_url) {
        setCourseVideoUrl(customResources.course_video_url);
      }
      if (customResources.exercise_video_url) {
        setExerciseVideoUrl(customResources.exercise_video_url);
      }
    }
  }, [customResources]);

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

  const handleCourseFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Check if file is PDF
      if (file.type !== 'application/pdf') {
        toast.error("Le fichier doit être au format PDF");
        return;
      }
      setCoursePdfFile(file);
    }
  };

  const handleExerciseFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Check if file is PDF
      if (file.type !== 'application/pdf') {
        toast.error("Le fichier doit être au format PDF");
        return;
      }
      setExercisePdfFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!languageId || !user?.id) {
      toast.error("Informations utilisateur ou langage manquantes");
      return;
    }
    
    try {
      // At least one field should be filled
      if (!courseVideoUrl && !coursePdfFile && !exerciseVideoUrl && !exercisePdfFile) {
        toast.error("Veuillez ajouter au moins une ressource");
        return;
      }
      
      // Validate YouTube URLs if provided
      if (courseVideoUrl && !getYoutubeVideoId(courseVideoUrl)) {
        toast.error("L'URL de la vidéo de cours n'est pas une URL YouTube valide");
        return;
      }
      
      if (exerciseVideoUrl && !getYoutubeVideoId(exerciseVideoUrl)) {
        toast.error("L'URL de la vidéo d'exercices n'est pas une URL YouTube valide");
        return;
      }
      
      await uploadResource(languageId, user.id, {
        course_video_url: courseVideoUrl || undefined,
        course_pdf_file: coursePdfFile || undefined,
        exercise_video_url: exerciseVideoUrl || undefined,
        exercise_pdf_file: exercisePdfFile || undefined
      });
      
      toast.success("Ressources mises à jour avec succès");
      
      // Reset file inputs
      setCoursePdfFile(null);
      setExercisePdfFile(null);
      
      // Refresh page to show new resources
      window.location.reload();
    } catch (err: any) {
      console.error("Error uploading resources:", err);
      toast.error("Erreur lors de la mise à jour des ressources");
    }
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
              onClick={() => navigate("/teacher/languages")}
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
                <div className="h-64 bg-gray-200 rounded animate-pulse" />
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
            onClick={() => navigate("/teacher/languages")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div className="flex items-center">
            {language?.image_url && (
              <img 
                src={language.image_url} 
                alt={language?.name} 
                className="h-8 w-8 mr-2 object-contain" 
              />
            )}
            <h1 className="text-3xl font-bold">Ressources {language?.name}</h1>
          </div>
        </div>

        <Tabs defaultValue="resources">
          <TabsList className="w-full md:w-auto grid grid-cols-2 md:inline-flex mb-6">
            <TabsTrigger value="resources">Ressources actuelles</TabsTrigger>
            <TabsTrigger value="upload">Ajouter des ressources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="resources">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Ressources de cours */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Code className="h-5 w-5 mr-2 text-blue-500" />
                    Ressources de cours
                  </CardTitle>
                  <CardDescription>
                    {customResources?.course_video_url || customResources?.course_pdf_url 
                      ? "Vous avez personnalisé ces ressources" 
                      : "Ressources par défaut"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {effectiveResources?.course_video_url && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Vidéo du cours :</h3>
                      <YoutubeEmbed 
                        videoId={getYoutubeVideoId(effectiveResources.course_video_url) || ''}
                        title={`Cours de ${language?.name}`}
                      />
                    </div>
                  )}
                  
                  {effectiveResources?.course_pdf_url && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Présentation PDF :</h3>
                      <a 
                        href={effectiveResources.course_pdf_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center p-3 border rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <FileText className="h-5 w-5 mr-3 text-blue-500" />
                        <div className="flex-grow">
                          <p className="font-medium">Présentation du cours</p>
                          <p className="text-xs text-muted-foreground">PDF - Voir/Télécharger</p>
                        </div>
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Ressources d'exercices */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-green-500" />
                    Ressources d'exercices
                  </CardTitle>
                  <CardDescription>
                    {customResources?.exercise_video_url || customResources?.exercise_pdf_url 
                      ? "Vous avez personnalisé ces ressources" 
                      : "Ressources par défaut"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {effectiveResources?.exercise_video_url && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Vidéo d'exercices :</h3>
                      <YoutubeEmbed 
                        videoId={getYoutubeVideoId(effectiveResources.exercise_video_url) || ''}
                        title={`Exercices de ${language?.name}`}
                      />
                    </div>
                  )}
                  
                  {effectiveResources?.exercise_pdf_url && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">PDF d'exercices :</h3>
                      <a 
                        href={effectiveResources.exercise_pdf_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center p-3 border rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <FileText className="h-5 w-5 mr-3 text-red-500" />
                        <div className="flex-grow">
                          <p className="font-medium">Exercices pratiques</p>
                          <p className="text-xs text-muted-foreground">PDF - Voir/Télécharger</p>
                        </div>
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Ajouter des ressources personnalisées</CardTitle>
                <CardDescription>
                  Personnalisez les ressources pour {language?.name}. Les étudiants verront vos ressources à la place des ressources par défaut.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Vidéo du cours */}
                  <div className="space-y-2">
                    <Label htmlFor="course-video">Vidéo YouTube du cours</Label>
                    <Input
                      id="course-video"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={courseVideoUrl}
                      onChange={(e) => setCourseVideoUrl(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Entrez l'URL complète d'une vidéo YouTube pour le cours.
                    </p>
                  </div>
                  
                  {/* PDF du cours */}
                  <div className="space-y-2">
                    <Label htmlFor="course-pdf">Présentation PDF du cours</Label>
                    <Input
                      id="course-pdf"
                      type="file"
                      accept=".pdf"
                      onChange={handleCourseFileChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      Téléchargez un fichier PDF contenant la présentation du cours (max 10MB).
                    </p>
                    {coursePdfFile && (
                      <p className="text-xs text-green-600">
                        Fichier sélectionné: {coursePdfFile.name}
                      </p>
                    )}
                  </div>
                  
                  {/* Vidéo d'exercices */}
                  <div className="space-y-2">
                    <Label htmlFor="exercise-video">Vidéo YouTube d'exercices</Label>
                    <Input
                      id="exercise-video"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={exerciseVideoUrl}
                      onChange={(e) => setExerciseVideoUrl(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Entrez l'URL complète d'une vidéo YouTube expliquant les exercices.
                    </p>
                  </div>
                  
                  {/* PDF d'exercices */}
                  <div className="space-y-2">
                    <Label htmlFor="exercise-pdf">Fichier PDF d'exercices</Label>
                    <Input
                      id="exercise-pdf"
                      type="file"
                      accept=".pdf"
                      onChange={handleExerciseFileChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      Téléchargez un fichier PDF contenant les exercices à faire (max 10MB).
                    </p>
                    {exercisePdfFile && (
                      <p className="text-xs text-green-600">
                        Fichier sélectionné: {exercisePdfFile.name}
                      </p>
                    )}
                  </div>
                  
                  {/* Bouton de soumission */}
                  <Button type="submit" disabled={uploading} className="w-full">
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Mise à jour en cours...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Mettre à jour les ressources
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TeacherLanguageResourcesPage;
