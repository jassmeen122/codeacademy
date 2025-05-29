import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Save, Video } from 'lucide-react';
import { CourseResourceManager } from '@/components/teacher/CourseResourceManager';
import { VideoCallManager } from '@/components/teacher/VideoCallManager';

const TeacherEditCoursePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [course, setCourse] = useState<any>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;
      
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user) {
          navigate('/auth');
          return;
        }
        
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('id', courseId)
          .eq('teacher_id', userData.user.id)
          .single();
          
        if (error) throw error;
        
        if (!data) {
          toast.error("Vous n'avez pas accès à ce cours");
          navigate('/teacher/courses');
          return;
        }
        
        setCourse(data);
      } catch (error: any) {
        console.error('Error fetching course:', error);
        toast.error("Erreur lors du chargement du cours");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourse();
  }, [courseId, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourse(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setCourse(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!course) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('courses')
        .update({
          title: course.title,
          description: course.description,
          category: course.category,
          difficulty: course.difficulty,
          path: course.path
        })
        .eq('id', courseId);
        
      if (error) throw error;
      
      toast.success("Cours mis à jour avec succès");
    } catch (error: any) {
      console.error('Error updating course:', error);
      toast.error("Erreur lors de la mise à jour du cours");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout>
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold">Cours non trouvé</h2>
          <p className="text-muted-foreground mt-2">Ce cours n'existe pas ou vous n'avez pas les droits pour y accéder.</p>
          <Button 
            className="mt-4" 
            onClick={() => navigate('/teacher/courses')}
          >
            Retour à mes cours
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Édition du cours</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate('/teacher/courses')}
          >
            Retour à mes cours
          </Button>
        </div>
        
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">Informations Générales</TabsTrigger>
            <TabsTrigger value="resources">Ressources</TabsTrigger>
            <TabsTrigger value="live">
              <Video className="h-4 w-4 mr-2" />
              Sessions Live
            </TabsTrigger>
            <TabsTrigger value="students">Étudiants</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Informations du cours</CardTitle>
                <CardDescription>
                  Modifiez les informations générales de votre cours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre du cours</Label>
                    <Input
                      id="title"
                      name="title"
                      value={course.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={course.description || ''}
                      onChange={handleInputChange}
                      rows={5}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Catégorie</Label>
                      <Select
                        value={course.category}
                        onValueChange={(value) => handleSelectChange('category', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Programming Fundamentals">Fondamentaux de la programmation</SelectItem>
                          <SelectItem value="Frontend Development">Développement Frontend</SelectItem>
                          <SelectItem value="Backend Development">Développement Backend</SelectItem>
                          <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                          <SelectItem value="Data Analysis">Analyse de données</SelectItem>
                          <SelectItem value="AI Applications">Applications d'IA</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Niveau de difficulté</Label>
                      <Select
                        value={course.difficulty}
                        onValueChange={(value) => handleSelectChange('difficulty', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un niveau" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Débutant</SelectItem>
                          <SelectItem value="Intermediate">Intermédiaire</SelectItem>
                          <SelectItem value="Advanced">Avancé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="path">Parcours</Label>
                      <Select
                        value={course.path}
                        onValueChange={(value) => handleSelectChange('path', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un parcours" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Web Development">Développement Web</SelectItem>
                          <SelectItem value="Data Science">Data Science</SelectItem>
                          <SelectItem value="Artificial Intelligence">Intelligence Artificielle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button type="submit" disabled={saving} className="w-full md:w-auto">
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Enregistrer les modifications
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources">
            {courseId && <CourseResourceManager courseId={courseId} />}
          </TabsContent>

          <TabsContent value="live">
            {courseId && <VideoCallManager courseId={courseId} />}
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Étudiants Inscrits</CardTitle>
                <CardDescription>
                  Gérez les étudiants inscrits à ce cours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>Fonctionnalité de gestion des étudiants à venir</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TeacherEditCoursePage;
