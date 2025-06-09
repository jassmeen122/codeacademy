import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BookOpen, Search, Eye, Edit, Trash2, CheckCircle, XCircle, Users } from 'lucide-react';
import type { BaseCourse } from '@/types/course';

interface CourseManagement extends BaseCourse {
  teacher_name: string;
  total_chapters: number;
  enrolled_students: number;
}

interface DatabaseCourseResponse {
  id: string;
  title: string;
  description: string | null;
  difficulty: string;
  path: string;
  category: string;
  teacher_id: string;
  is_published: boolean;
  created_at: string;
  profiles?: {
    full_name?: string;
  };
  course_content?: Array<{
    id: string;
    is_published: boolean;
  }>;
}

const CourseManagementPage = () => {
  const [courses, setCourses] = useState<CourseManagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  const fetchCourses = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          profiles:teacher_id (
            full_name
          ),
          course_content (
            id,
            is_published
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const coursesData = (data as DatabaseCourseResponse[] || []).map((course) => ({
        id: course.id,
        title: course.title,
        description: course.description || '',
        difficulty: course.difficulty as any,
        path: course.path as any,
        category: course.category as any,
        teacher_name: course.profiles?.full_name || 'Enseignant inconnu',
        teacher_id: course.teacher_id,
        is_published: course.is_published || false,
        created_at: course.created_at,
        total_chapters: course.course_content?.length || 0,
        enrolled_students: Math.floor(Math.random() * 100) // Simulation
      }));

      setCourses(coursesData);
    } catch (error: any) {
      console.error('Erreur lors du chargement des cours:', error);
      toast.error('Impossible de charger les cours');
    } finally {
      setLoading(false);
    }
  };

  const toggleCourseStatus = async (courseId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ is_published: !currentStatus })
        .eq('id', courseId);

      if (error) throw error;

      setCourses(prev => 
        prev.map(course => 
          course.id === courseId 
            ? { ...course, is_published: !currentStatus }
            : course
        )
      );

      toast.success(`Cours ${!currentStatus ? 'publié' : 'mis en brouillon'} avec succès`);
    } catch (error: any) {
      console.error('Erreur lors de la modification du statut:', error);
      toast.error('Erreur lors de la modification du statut');
    }
  };

  const deleteCourse = async (courseId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) return;

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;

      setCourses(prev => prev.filter(course => course.id !== courseId));
      toast.success('Cours supprimé avec succès');
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression du cours');
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.teacher_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'published' && course.is_published) ||
                         (statusFilter === 'draft' && !course.is_published);

    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Gestion des Cours"
          description="Gérer et modérer tous les cours de la plateforme"
          icon={BookOpen}
        />

        {/* Filtres */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher par titre ou enseignant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les cours</SelectItem>
              <SelectItem value="published">Publiés</SelectItem>
              <SelectItem value="draft">Brouillons</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{courses.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Publiés</p>
                  <p className="text-2xl font-bold">{courses.filter(c => c.is_published).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Brouillons</p>
                  <p className="text-2xl font-bold">{courses.filter(c => !c.is_published).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Étudiants</p>
                  <p className="text-2xl font-bold">
                    {courses.reduce((sum, course) => sum + course.enrolled_students, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des cours */}
        <div className="space-y-4">
          {filteredCourses.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucun cours trouvé</h3>
                <p className="text-muted-foreground">
                  Aucun cours ne correspond à vos critères de recherche.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredCourses.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{course.title}</CardTitle>
                        <Badge variant={course.is_published ? "default" : "secondary"}>
                          {course.is_published ? "Publié" : "Brouillon"}
                        </Badge>
                        <Badge variant="outline">{course.difficulty}</Badge>
                      </div>
                      
                      <p className="text-muted-foreground mb-2 line-clamp-2">
                        {course.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>👨‍🏫 {course.teacher_name}</span>
                        <span>📚 {course.total_chapters} chapitres</span>
                        <span>👥 {course.enrolled_students} étudiants</span>
                        <span>📅 {new Date(course.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant={course.is_published ? "destructive" : "default"}
                        size="sm"
                        onClick={() => toggleCourseStatus(course.id, course.is_published)}
                      >
                        {course.is_published ? (
                          <>
                            <XCircle className="h-4 w-4 mr-1" />
                            Dépublier
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Publier
                          </>
                        )}
                      </Button>
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteCourse(course.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CourseManagementPage;
