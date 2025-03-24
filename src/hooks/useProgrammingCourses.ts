
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from './useAuthState';
import type { ProgrammingLanguage, CourseModule, Quiz, CodingExercise, UserProgress } from '@/types/course';
import { toast } from 'sonner';

export const useProgrammingLanguages = () => {
  const [languages, setLanguages] = useState<ProgrammingLanguage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('programming_languages')
          .select('*')
          .order('name');
        
        if (error) throw error;
        setLanguages(data || []);
      } catch (err: any) {
        console.error('Error fetching programming languages:', err);
        setError(err);
        toast.error('Failed to load programming languages');
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  return { languages, loading, error };
};

export const useLanguageDetails = (languageId: string) => {
  const [language, setLanguage] = useState<ProgrammingLanguage | null>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthState();

  useEffect(() => {
    const fetchLanguageDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch language details
        const { data: languageData, error: languageError } = await supabase
          .from('programming_languages')
          .select('*')
          .eq('id', languageId)
          .single();
        
        if (languageError) throw languageError;
        
        // Fetch modules for this language
        const { data: modulesData, error: modulesError } = await supabase
          .from('course_modules')
          .select('*')
          .eq('language_id', languageId)
          .order('order_index');
        
        if (modulesError) throw modulesError;
        
        // Fetch user progress if user is logged in
        let userProgressData: UserProgress[] = [];
        if (user) {
          const { data: progressData, error: progressError } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', user.id)
            .in('module_id', modulesData.map(m => m.id));
          
          if (progressError) throw progressError;
          userProgressData = progressData || [];
        }
        
        setLanguage(languageData);
        setModules(modulesData || []);
        setUserProgress(userProgressData);
      } catch (err: any) {
        console.error('Error fetching language details:', err);
        toast.error('Failed to load language details');
      } finally {
        setLoading(false);
      }
    };

    if (languageId) {
      fetchLanguageDetails();
    }
  }, [languageId, user]);

  return { language, modules, userProgress, loading };
};

export const useModuleDetails = (moduleId: string) => {
  const [module, setModule] = useState<CourseModule | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [exercises, setExercises] = useState<CodingExercise[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthState();

  useEffect(() => {
    const fetchModuleDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch module details
        const { data: moduleData, error: moduleError } = await supabase
          .from('course_modules')
          .select('*')
          .eq('id', moduleId)
          .single();
        
        if (moduleError) throw moduleError;
        
        // Fetch quizzes for this module
        const { data: quizzesData, error: quizzesError } = await supabase
          .from('quizzes')
          .select('*')
          .eq('module_id', moduleId);
        
        if (quizzesError) throw quizzesError;
        
        // Fetch coding exercises for this module
        const { data: exercisesData, error: exercisesError } = await supabase
          .from('coding_exercises')
          .select('*')
          .eq('module_id', moduleId);
        
        if (exercisesError) throw exercisesError;
        
        // Fetch user progress if user is logged in
        if (user) {
          const { data: progressData, error: progressError } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', user.id)
            .eq('module_id', moduleId)
            .maybeSingle();
          
          if (progressError) throw progressError;
          setUserProgress(progressData || null);
        }
        
        setModule(moduleData);
        setQuizzes(quizzesData || []);
        setExercises(exercisesData || []);
      } catch (err: any) {
        console.error('Error fetching module details:', err);
        toast.error('Failed to load module details');
      } finally {
        setLoading(false);
      }
    };

    if (moduleId) {
      fetchModuleDetails();
    }
  }, [moduleId, user]);

  // Function to update user progress
  const updateProgress = async (
    completed: boolean, 
    quizScore?: number, 
    exerciseCompleted?: boolean
  ) => {
    if (!user || !moduleId) return;
    
    try {
      const progressData = {
        user_id: user.id,
        module_id: moduleId,
        completed,
        last_accessed: new Date().toISOString(),
        ...(quizScore !== undefined && { quiz_score: quizScore }),
        ...(exerciseCompleted !== undefined && { exercise_completed: exerciseCompleted })
      };

      if (userProgress) {
        // Update existing progress
        const { error } = await supabase
          .from('user_progress')
          .update(progressData)
          .eq('id', userProgress.id);
          
        if (error) throw error;
      } else {
        // Create new progress entry
        const { error } = await supabase
          .from('user_progress')
          .insert([progressData]);
          
        if (error) throw error;
      }

      // Refresh progress data
      const { data: newProgress, error: fetchError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('module_id', moduleId)
        .single();
        
      if (fetchError) throw fetchError;
      setUserProgress(newProgress);
      
      // Check if user should earn a badge for completing their first module
      if (completed && (!userProgress || !userProgress.completed)) {
        await checkAndAwardBadges(user.id);
      }
      
      toast.success('Progress updated!');
    } catch (err: any) {
      console.error('Error updating progress:', err);
      toast.error('Failed to update progress');
    }
  };

  const checkAndAwardBadges = async (userId: string) => {
    try {
      // Check how many modules the user has completed
      const { data: completedModules, error: countError } = await supabase
        .from('user_progress')
        .select('module_id')
        .eq('user_id', userId)
        .eq('completed', true);
        
      if (countError) throw countError;
      
      // Award "First Module Completed" badge if this is their first module
      if (completedModules && completedModules.length === 1) {
        const { data: beginner, error: beginnerError } = await supabase
          .from('badges')
          .select('id')
          .eq('name', 'First Step')
          .single();
          
        if (beginnerError) throw beginnerError;
        
        // Check if user already has this badge
        const { data: existingBadge, error: existingError } = await supabase
          .from('user_badges')
          .select('id')
          .eq('user_id', userId)
          .eq('badge_id', beginner.id)
          .maybeSingle();
          
        if (existingError) throw existingError;
        
        // Award badge if they don't have it yet
        if (!existingBadge) {
          const { error: insertError } = await supabase
            .from('user_badges')
            .insert({
              user_id: userId,
              badge_id: beginner.id
            });
            
          if (insertError) throw insertError;
          
          // Update user's points
          const { data: badge, error: badgeError } = await supabase
            .from('badges')
            .select('points')
            .eq('id', beginner.id)
            .single();
            
          if (badgeError) throw badgeError;
          
          const { error: pointsError } = await supabase
            .rpc('increment_user_points', { 
              user_id: userId, 
              points_to_add: badge.points 
            });
            
          if (pointsError) throw pointsError;
          
          toast.success('🏆 New badge earned: First Step!');
        }
      }
      
      // Check for more badges based on progress (e.g. completed 5, 10, or all modules)
      // Similar logic as above for other badges
    } catch (err) {
      console.error('Error checking badges:', err);
    }
  };

  return { 
    module, 
    quizzes, 
    exercises, 
    userProgress, 
    loading, 
    updateProgress 
  };
};
