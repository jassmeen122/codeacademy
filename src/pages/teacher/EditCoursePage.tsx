
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { ChevronLeft, Save, Trash2, FileText, Video, Presentation } from "lucide-react";
import { CourseResourceUpload } from "@/components/teacher/CourseResourceUpload";
import type { CourseLevel, CoursePath, CourseCategory, CourseResource } from "@/types/course";

const EditCoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthState();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<CourseLevel>("Beginner");
  const [path, setPath] = useState<CoursePath>("Web Development");
  const [category, setCategory] = useState<CourseCategory>("Programming Fundamentals");
  const [loading, setLoading] = useState(false);
  const [courseResources, setCourseResources] = useState<CourseResource[]>([]);
  const [resourcesLoading, setResourcesLoading] = useState(false);

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
      fetchCourseResources();
    }
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .eq('teacher_id', user?.id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setTitle(data.title);
        setDescription(data.description || "");
        setDifficulty(data.difficulty);
        setPath(data.path);
        setCategory(data.category);
      }
    } catch (error: any) {
      toast.error("Erreur lors du chargement du cours");
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseResources = async () => {
    try {
      setResourcesLoading(true);
      
      const { data, error } = await supabase
        .from('course_resources')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      
      setCourseResources(data as CourseResource[]);
    } catch (error: any) {
      toast.error("Erreur lors du chargement des ressources");
      console.error("Error fetching resources:", error);
    } finally {
      setResourcesLoading(false);
    }
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      setLoading(true);
      
      const { error } = await supabase.from('courses').update({
        title,
        description,
        difficulty,
        path,
        category
      }).eq('id', courseId);

      if (error) throw error;
      
      toast.success("Cours mis à jour avec succès");
    } catch (error: any) {
      toast.error(`Erreur lors de la mise à jour du cours: ${error.message}`);
      console.error("Error updating course:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResource = async (resourceId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette ressource ?")) {
      return;
    }
    
    try {
      // First get the resource to find its file path
      const { data: resource, error: fetchError } = await supabase
        .from('course_resources')
        .select('file_url')
        .eq('id', resourceId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Delete from database
      const { error: deleteError } = await supabase
        .from('course_resources')
        .delete()
        .eq('id', resourceId);
      
      if (deleteError) throw deleteError;
      
      // Update local state
      setCourseResources(prevResources => 
        prevResources.filter(resource => resource.id !== resourceId)
      );
      
      toast.success("Ressource supprimée avec succès");
    } catch (error: any) {
      toast.error(`Erreur lors de la suppression: ${error.message}`);
      console.error("Error deleting resource:", error);
    }
  };

  const handleResourceAdded = (newResource: CourseResource) => {
    setCourseResources(prev => [...prev, newResource]);
  };

  const renderResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'video':
        return <Video className="h-5 w-5 text-blue-500" />;
      case 'presentation':
        return <Presentation className="h-5 w-5 text-green-500" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  if (loading && !title) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">Chargement du cours...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button variant="outline" onClick={() => navigate("/teacher/courses")} className="mr-4">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Retour aux cours
          </Button>
          <h1 className="text-3xl font-bold">Modifier le cours</h1>
        </div>

        <Tabs defaultValue="details" className="max-w-3xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Détails du cours</TabsTrigger>
            <TabsTrigger value="resources">Ressources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations du cours</CardTitle>
              </CardHeader>
              <form onSubmit={handleUpdateCourse}>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre du cours</Label>
                    <Input 
                      id="title" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Entrez un titre descriptif" 
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description du cours</Label>
                    <Textarea 
                      id="description" 
                      value={description} 
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Fournissez une description détaillée du cours" 
                      className="min-h-[120px]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Niveau de difficulté</Label>
                      <Select
                        value={difficulty}
                        onValueChange={(value) => setDifficulty(value as CourseLevel)}
                      >
                        <SelectTrigger id="difficulty">
                          <SelectValue placeholder="Sélectionnez le niveau" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Débutant</SelectItem>
                          <SelectItem value="Intermediate">Intermédiaire</SelectItem>
                          <SelectItem value="Advanced">Avancé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="path">Parcours d'apprentissage</Label>
                      <Select
                        value={path}
                        onValueChange={(value) => setPath(value as CoursePath)}
                      >
                        <SelectTrigger id="path">
                          <SelectValue placeholder="Sélectionnez le parcours" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Web Development">Développement Web</SelectItem>
                          <SelectItem value="Data Science">Data Science</SelectItem>
                          <SelectItem value="Artificial Intelligence">Intelligence Artificielle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Catégorie</Label>
                      <Select
                        value={category}
                        onValueChange={(value) => setCategory(value as CourseCategory)}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Sélectionnez la catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Programming Fundamentals">Fondamentaux de la programmation</SelectItem>
                          <SelectItem value="Frontend Development">Développement Frontend</SelectItem>
                          <SelectItem value="Backend Development">Développement Backend</SelectItem>
                          <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                          <SelectItem value="Data Analysis">Analyse de données</SelectItem>
                          <SelectItem value="AI Applications">Applications IA</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={loading} className="ml-auto">
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Sauvegarde..." : "Enregistrer les modifications"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="resources" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Ressources du cours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {resourcesLoading ? (
                      <div className="text-center py-4">Chargement des ressources...</div>
                    ) : courseResources.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        Aucune ressource n'a encore été ajoutée à ce cours.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {courseResources.map((resource) => (
                          <div key={resource.id} className="flex items-center justify-between p-3 border rounded-md">
                            <div className="flex items-center">
                              {renderResourceIcon(resource.type)}
                              <div className="ml-3">
                                <h4 className="font-medium">{resource.title}</h4>
                                {resource.description && (
                                  <p className="text-sm text-muted-foreground">{resource.description}</p>
                                )}
                              </div>
                            </div>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => handleDeleteResource(resource.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Ajouter une ressource</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CourseResourceUpload 
                      courseId={courseId || ""} 
                      onResourceAdded={handleResourceAdded} 
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default EditCoursePage;
