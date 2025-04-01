
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { InternshipApplication } from '@/types/internship';
import { useAuthState } from '@/hooks/useAuthState';

export const useInternshipApplications = () => {
  const [applications, setApplications] = useState<InternshipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuthState();

  const fetchApplications = async (internshipId?: string) => {
    if (!user) {
      return;
    }

    try {
      setLoading(true);
      
      let query = supabase
        .from('internship_applications')
        .select(`
          *,
          internship:internship_id(title, company),
          student:student_id(full_name, email, avatar_url)
        `);
      
      if (user.role === 'student') {
        // Students can only see their own applications
        query = query.eq('student_id', user.id);
      }
      
      if (internshipId) {
        // Filter by internship if provided
        query = query.eq('internship_id', internshipId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setApplications(data as InternshipApplication[]);
    } catch (err: any) {
      console.error('Error fetching internship applications:', err);
      setError(err);
      toast.error('Failed to load internship applications');
    } finally {
      setLoading(false);
    }
  };

  const applyForInternship = async (
    internshipId: string,
    application: {
      cv_url?: string;
      cover_letter_url?: string;
      motivation_text?: string;
    }
  ) => {
    if (!user || user.role !== 'student') {
      toast.error('Only students can apply for internships');
      return null;
    }

    try {
      // Check if user already applied
      const { data: existingApplication } = await supabase
        .from('internship_applications')
        .select('id')
        .eq('internship_id', internshipId)
        .eq('student_id', user.id)
        .single();
      
      if (existingApplication) {
        toast.error('You have already applied for this internship');
        return null;
      }
      
      const { data, error } = await supabase
        .from('internship_applications')
        .insert({
          internship_id: internshipId,
          student_id: user.id,
          cv_url: application.cv_url || null,
          cover_letter_url: application.cover_letter_url || null,
          motivation_text: application.motivation_text || null,
          status: 'pending'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Application submitted successfully');
      await fetchApplications();
      
      return data;
    } catch (err: any) {
      console.error('Error applying for internship:', err);
      toast.error('Failed to submit application');
      return null;
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: 'approved' | 'rejected') => {
    if (!user || user.role !== 'admin') {
      toast.error('Only administrators can update application status');
      return false;
    }

    try {
      const { error } = await supabase
        .from('internship_applications')
        .update({ status })
        .eq('id', applicationId);
      
      if (error) throw error;
      
      toast.success(`Application ${status} successfully`);
      await fetchApplications();
      
      return true;
    } catch (err: any) {
      console.error('Error updating application status:', err);
      toast.error('Failed to update application status');
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  return {
    applications,
    loading,
    error,
    fetchApplications,
    applyForInternship,
    updateApplicationStatus
  };
};
