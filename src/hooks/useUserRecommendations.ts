
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthState } from './useAuthState';
import { UserRecommendation } from '@/types/progress';

export function useUserRecommendations() {
  const [recommendations, setRecommendations] = useState<UserRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthState();

  const fetchRecommendations = useCallback(async () => {
    if (!user) {
      setRecommendations([]);
      setLoading(false);
      return [];
    }
    
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
        .limit(10);
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        // If no recommendations exist, generate some based on user activity
        await generateRecommendations(user.id);
        return fetchRecommendations(); // Recursive call to fetch the newly generated recommendations
      }
      
      // Fetch additional information for each recommendation
      const enhancedRecommendations = await Promise.all((data || []).map(async recommendation => {
        // Depending on the type, fetch the relevant title/description
        let itemTitle = '';
        let itemDescription = '';
        let itemImage = '';
        let reason = '';
        
        switch (recommendation.recommendation_type) {
          case 'course':
            try {
              const { data: course } = await supabase
                .from('courses')
                .select('title, description')
                .eq('id', recommendation.item_id)
                .single();
              
              if (course) {
                itemTitle = course.title;
                itemDescription = course.description || '';
                reason = 'Based on your learning history';
              }
            } catch (error) {
              console.error('Error fetching course details:', error);
            }
            break;
            
          case 'exercise':
            try {
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
            } catch (error) {
              console.error('Error fetching exercise details:', error);
            }
            break;
            
          case 'skill':
            reason = 'Improve your skills in this area';
            itemTitle = recommendation.item_id; // In this case, the item_id is the skill name
            break;
            
          case 'module':
            try {
              const { data: module } = await supabase
                .from('course_modules')
                .select('title, description')
                .eq('id', recommendation.item_id)
                .single();
              
              if (module) {
                itemTitle = module.title;
                itemDescription = module.description || '';
                reason = 'Continue your learning journey';
              }
            } catch (error) {
              console.error('Error fetching module details:', error);
            }
            break;
        }
        
        return {
          ...recommendation,
          item_title: itemTitle,
          item_description: itemDescription,
          item_image: itemImage,
          reason
        } as UserRecommendation;
      }));
      
      setRecommendations(enhancedRecommendations);
      return enhancedRecommendations;
    } catch (error: any) {
      console.error('Error fetching recommendations:', error);
      toast.error("Failed to load recommendations");
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  const generateRecommendations = async (userId: string) => {
    try {
      // First, fetch user's skills to recommend related content
      const { data: skills } = await supabase
        .from('user_skills_progress')
        .select('skill_name, progress')
        .eq('user_id', userId)
        .order('progress', { ascending: true })
        .limit(3);
      
      // Fetch low-progress skills for recommendation
      if (skills && skills.length > 0) {
        for (const skill of skills) {
          // Find modules and exercises related to this skill
          const { data: modules } = await supabase
            .from('course_modules')
            .select('id, title')
            .ilike('title', `%${skill.skill_name}%`)
            .limit(1);
            
          if (modules && modules.length > 0) {
            // Create a recommendation for this module
            await supabase
              .from('user_recommendations')
              .insert({
                user_id: userId,
                recommendation_type: 'module',
                item_id: modules[0].id,
                relevance_score: 0.8,
                is_viewed: false
              });
          }
          
          // Also recommend directly improving the skill
          await supabase
            .from('user_recommendations')
            .insert({
              user_id: userId,
              recommendation_type: 'skill',
              item_id: skill.skill_name,
              relevance_score: 0.9,
              is_viewed: false
            });
        }
      }
      
      // Recommend a few new courses based on popular ones
      const { data: popularCourses } = await supabase
        .from('courses')
        .select('id')
        .limit(2);
        
      if (popularCourses) {
        for (const course of popularCourses) {
          await supabase
            .from('user_recommendations')
            .insert({
              user_id: userId,
              recommendation_type: 'course',
              item_id: course.id,
              relevance_score: 0.7,
              is_viewed: false
            });
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return false;
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
      
      return true;
    } catch (error: any) {
      console.error('Error marking recommendation as viewed:', error);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchRecommendations();
    } else {
      setRecommendations([]);
      setLoading(false);
    }
  }, [user, fetchRecommendations]);

  return {
    recommendations,
    loading,
    fetchRecommendations,
    markRecommendationAsViewed
  };
}
