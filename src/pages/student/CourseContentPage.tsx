
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ChapterReader } from '@/components/student/ChapterReader';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from '@/hooks/useAuthState';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

const CourseContentPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuthState();
  const [courseName, setCourseName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseInfo = async () => {
      if (!courseId) return;
      
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('title')
          .eq('id', courseId)
          .single();
        
        if (error) throw error;
        setCourseName(data?.title || 'Cours');
      } catch (error) {
        console.error('Error fetching course info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseInfo();
  }, [courseId]);

  if (!user || !courseId) {
    return (
      <DashboardLayout>
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">Accès non autorisé ou cours introuvable</p>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{courseName}</h1>
          <p className="text-gray-600">Lisez les chapitres et suivez votre progression</p>
        </div>
        
        <ChapterReader 
          courseId={courseId} 
          userId={user.id} 
        />
      </div>
    </DashboardLayout>
  );
};

export default CourseContentPage;
