
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { Book, Plus, Trash2 } from "lucide-react";
import type { CourseLevel, CoursePath, CourseCategory } from "@/types/course";

interface CourseModule {
  title: string;
  content: string;
}

const CreateCoursePage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<CourseLevel>("Beginner");
  const [path, setPath] = useState<CoursePath>("Web Development");
  const [category, setCategory] = useState<CourseCategory>("Programming Fundamentals");
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthState();

  const addModule = () => {
    setModules([...modules, { title: "", content: "" }]);
  };

  const updateModule = (index: number, field: keyof CourseModule, value: string) => {
    const updatedModules = [...modules];
    updatedModules[index][field] = value;
    setModules(updatedModules);
  };

  const removeModule = (index: number) => {
    setModules(modules.filter((_, i) => i !== index));
  };

  const handleSubmit = async (isDraft = false) => {
    if (!title.trim() || !description.trim()) {
      toast.error("Veuillez remplir le titre et la description");
      return;
    }

    try {
      setLoading(true);
      
      // Créer le cours
      const courseData = {
        title,
        description,
        difficulty,
        path,
        category,
        teacher_id: user?.id
      };
      
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .insert(courseData)
        .select()
        .single();

      if (courseError) throw courseError;
      
      // Ajouter les modules/chapitres
      if (modules.length > 0) {
        const modulePromises = modules.map((module, index) => {
          if (module.title.trim() && module.content.trim()) {
            return supabase
              .from('course_content')
              .insert({
                course_id: course.id,
                title: module.title,
                content: module.content,
                content_type: 'chapter',
                order_index: index,
                is_published: !isDraft
              });
          }
          return null;
        }).filter(Boolean);

        if (modulePromises.length > 0) {
          await Promise.all(modulePromises);
        }
      }
      
      toast.success(isDraft ? "Cours sauvegardé comme brouillon" : "Cours publié avec succès");
      navigate("/teacher/courses");
    } catch (error: any) {
      toast.error(`Erreur: ${error.message}`);
      console.error("Error creating course:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Créer un Nouveau Cours</h1>
          <Button variant="outline" onClick={() => navigate("/teacher/courses")}>
            Retour aux Cours
          </Button>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Book className="mr-2 h-6 w-6" />
              Informations du Cours
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Informations de base */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Titre du Cours *</Label>
                <Input 
                  id="title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Introduction à JavaScript" 
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea 
                  id="description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez ce que les étudiants vont apprendre dans ce cours" 
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="difficulty">Niveau</Label>
                  <Select value={difficulty} onValueChange={(value) => setDifficulty(value as CourseLevel)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Débutant</SelectItem>
                      <SelectItem value="Intermediate">Intermédiaire</SelectItem>
                      <SelectItem value="Advanced">Avancé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="path">Parcours</Label>
                  <Select value={path} onValueChange={(value) => setPath(value as CoursePath)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Web Development">Développement Web</SelectItem>
                      <SelectItem value="Data Science">Data Science</SelectItem>
                      <SelectItem value="Artificial Intelligence">Intelligence Artificielle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category">Catégorie</Label>
                  <Select value={category} onValueChange={(value) => setCategory(value as CourseCategory)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Programming Fundamentals">Bases de Programmation</SelectItem>
                      <SelectItem value="Frontend Development">Développement Frontend</SelectItem>
                      <SelectItem value="Backend Development">Développement Backend</SelectItem>
                      <SelectItem value="Data Analysis">Analyse de Données</SelectItem>
                      <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                      <SelectItem value="AI Applications">Applications IA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Modules/Chapitres */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Chapitres du Cours</h3>
                <Button type="button" onClick={addModule} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un Chapitre
                </Button>
              </div>
              
              {modules.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Book className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun chapitre ajouté</p>
                  <p className="text-sm">Cliquez sur "Ajouter un Chapitre" pour commencer</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {modules.map((module, index) => (
                    <Card key={index} className="border-l-4 border-l-green-600">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-medium">Chapitre {index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeModule(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <Label>Titre du Chapitre</Label>
                            <Input
                              value={module.title}
                              onChange={(e) => updateModule(index, 'title', e.target.value)}
                              placeholder="Ex: Variables et Types de Données"
                            />
                          </div>
                          
                          <div>
                            <Label>Contenu du Chapitre</Label>
                            <Textarea
                              value={module.content}
                              onChange={(e) => updateModule(index, 'content', e.target.value)}
                              placeholder="Écrivez le contenu de ce chapitre..."
                              className="min-h-[120px]"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t bg-muted/20 px-6 py-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/teacher/courses")}
              disabled={loading}
            >
              Annuler
            </Button>
            <div className="flex gap-2">
              <Button 
                type="button"
                variant="outline"
                disabled={loading}
                onClick={() => handleSubmit(true)}
              >
                {loading ? "Sauvegarde..." : "Sauvegarder comme Brouillon"}
              </Button>
              <Button 
                type="button"
                disabled={loading || !title.trim() || !description.trim()}
                onClick={() => handleSubmit(false)}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? "Publication..." : "Publier le Cours"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreateCoursePage;
