
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { InternshipOffer, InternshipStatus } from '@/types/internship';
import { useAuthState } from '@/hooks/useAuthState';

export const useInternshipOffers = () => {
  const [offers, setOffers] = useState<InternshipOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuthState();

  const fetchInternshipOffers = async (filters?: {
    industry?: string;
    location?: string;
    isRemote?: boolean;
    searchTerm?: string;
  }) => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('internship_offers')
        .select('*')
        .eq('status', 'open');
      
      // Apply filters if provided
      if (filters) {
        if (filters.industry) {
          query = query.eq('industry', filters.industry);
        }
        if (filters.location) {
          query = query.eq('location', filters.location);
        }
        if (filters.isRemote !== undefined) {
          query = query.eq('is_remote', filters.isRemote);
        }
        if (filters.searchTerm) {
          const term = `%${filters.searchTerm}%`;
          query = query.or(`title.ilike.${term},description.ilike.${term},company.ilike.${term}`);
        }
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setOffers(data as InternshipOffer[]);
    } catch (err: any) {
      console.error('Error fetching internship offers:', err);
      setError(err);
      toast.error('Failed to load internship opportunities');
    } finally {
      setLoading(false);
    }
  };

  const createInternshipOffer = async (offer: Omit<InternshipOffer, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
    if (!user || user.role !== 'admin') {
      toast.error('Only administrators can create internship offers');
      return null;
    }

    // Prevent multiple submissions
    if (submitting) {
      console.log('Already submitting an internship, please wait');
      return null;
    }

    try {
      setSubmitting(true);
      console.log('Creating internship offer:', offer);
      
      // Ensure required fields exist
      if (!offer.title || !offer.company || !offer.description || !offer.required_skills || 
          !offer.industry || !offer.location || !offer.duration) {
        toast.error('Please fill in all required fields');
        return null;
      }
      
      const newOffer = {
        ...offer,
        status: 'open' as InternshipStatus
      };
      
      const { data, error } = await supabase
        .from('internship_offers')
        .insert(newOffer)
        .select()
        .single();
      
      if (error) {
        console.error('Supabase error creating internship:', error);
        throw error;
      }
      
      // Notify students about the new internship
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notify-internship`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({ internshipId: data.id })
          }
        );
        
        if (!response.ok) {
          console.error('Failed to notify students:', await response.text());
        }
      } catch (notifyError) {
        console.error('Error notifying students:', notifyError);
      }
      
      toast.success('Internship offer created successfully');
      await fetchInternshipOffers();
      
      return data;
    } catch (err: any) {
      console.error('Error creating internship offer:', err);
      toast.error(`Failed to create internship offer: ${err.message || 'Unknown error'}`);
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  const updateInternshipOffer = async (id: string, updates: Partial<InternshipOffer>) => {
    if (!user || user.role !== 'admin') {
      toast.error('Only administrators can update internship offers');
      return false;
    }

    try {
      const { error } = await supabase
        .from('internship_offers')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Internship offer updated successfully');
      await fetchInternshipOffers();
      
      return true;
    } catch (err: any) {
      console.error('Error updating internship offer:', err);
      toast.error('Failed to update internship offer');
      return false;
    }
  };

  const deleteInternshipOffer = async (id: string) => {
    if (!user || user.role !== 'admin') {
      toast.error('Only administrators can delete internship offers');
      return false;
    }

    try {
      const { error } = await supabase
        .from('internship_offers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Internship offer deleted successfully');
      await fetchInternshipOffers();
      
      return true;
    } catch (err: any) {
      console.error('Error deleting internship offer:', err);
      toast.error('Failed to delete internship offer');
      return false;
    }
  };

  useEffect(() => {
    fetchInternshipOffers();
  }, []);

  return {
    offers,
    loading,
    error,
    submitting,
    fetchInternshipOffers,
    createInternshipOffer,
    updateInternshipOffer,
    deleteInternshipOffer
  };
};
