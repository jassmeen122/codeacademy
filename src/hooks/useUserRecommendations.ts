
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthState } from './useAuthState';
import { UserRecommendation } from '@/types/progress';

export function useUserRecommendations() {
  const [recommendations, setRecommendations] = useState<UserRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthState();

  useEffect(() => {
    if (user) {
      fetchRecommendations();
    } else {
      setRecommendations([]);
      setLoading(false);
    }
  }, [user]);

  const fetchRecommendations = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Get user recommendations from database
      const { data, error } = await supabase
        .from('user_recommendations')
        .select(`
          id,
          user_id,
          recommendation_type,
          item_id,
          relevance_score,
          is_viewed,
          created_at
        `)
        .eq('user_id', user.id)
        .order('relevance_score', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      // Fetch additional information for each recommendation
      const enhancedRecommendations = await Promise.all((data || []).map(async recommendation => {
        // Depending on the type, fetch the relevant title/description
        let itemTitle = '';
        let itemDescription = '';
        let itemImage = '';
        let reason = '';
        
        switch (recommendation.recommendation_type) {
          case 'course':
            const { data: course } = await supabase
              .from('courses')
              .select('title, description, image_url')
              .eq('id', recommendation.item_id)
              .single();
            
            if (course) {
              itemTitle = course.title;
              itemDescription = course.description || '';
              itemImage = course.image_url || '';
              reason = 'Based on your learning history';
            }
            break;
            
          case 'exercise':
            const { data: exercise } = await supabase
              .from('coding_exercises')
              .select('title, description')
              .eq('id', recommendation.item_id)
              .single();
            
            if (exercise) {
              itemTitle = exercise.title;
              itemDescription = exercise.description || '';
              reason = 'Practice makes perfect!';
            }
            break;
            
          case 'skill':
            reason = 'Improve your skills in this area';
            itemTitle = recommendation.item_id; // In this case, the item_id is the skill name
            break;
        }
        
        return {
          ...recommendation,
          item_title: itemTitle,
          item_description: itemDescription,
          item_image: itemImage,
          reason
        };
      }));
      
      setRecommendations(enhancedRecommendations);
    } catch (error: any) {
      console.error('Error fetching recommendations:', error);
      toast.error("Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  };

  const markRecommendationAsViewed = async (recommendationId: string) => {
    try {
      const { error } = await supabase
        .from('user_recommendations')
        .update({ is_viewed: true })
        .eq('id', recommendationId);
      
      if (error) throw error;
      
      // Update local state
      setRecommendations(prev => 
        prev.map(rec => 
          rec.id === recommendationId 
            ? { ...rec, is_viewed: true } 
            : rec
        )
      );
    } catch (error: any) {
      console.error('Error marking recommendation as viewed:', error);
    }
  };

  return {
    recommendations,
    loading,
    fetchRecommendations,
    markRecommendationAsViewed
  };
}
