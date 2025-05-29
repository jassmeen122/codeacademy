
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { CourseContentManager } from '@/components/teacher/CourseContentManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, BookOpen } from 'lucide-react';

const EditCoursePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (error) throw error;
      setCourse(data);
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Erreur lors du chargement du cours');
      navigate('/teacher/courses');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout>
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Cours introuvable</p>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container py-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/teacher/courses')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux cours
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <BookOpen className="h-8 w-8" />
                {course.title}
              </h1>
              <p className="text-gray-600">Gérez le contenu de votre cours</p>
            </div>
          </div>
        </div>
        
        <CourseContentManager courseId={courseId!} />
      </div>
    </DashboardLayout>
  );
};

export default EditCoursePage;
