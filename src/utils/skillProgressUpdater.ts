
import { supabase } from "@/integrations/supabase/client";

// Language to skill mapping
const languageToSkillMap: Record<string, string[]> = {
  "javascript": ["JavaScript"],
  "reactjs": ["React", "JavaScript"],
  "typescript": ["TypeScript", "JavaScript"],
  "nodejs": ["Node.js", "JavaScript"],
  "python": ["Python"],
  "sql": ["SQL", "Database"],
  "html": ["HTML/CSS"],
  "css": ["HTML/CSS"],
  "react-native": ["Mobile", "React", "JavaScript"],
  "flutter": ["Mobile"],
  "docker": ["DevOps"],
  "kubernetes": ["DevOps"],
  "aws": ["DevOps", "Cloud"],
  "azure": ["DevOps", "Cloud"],
};

export const updateUserSkillsForActivity = async (
  userId: string, 
  activityType: 'course_completed' | 'exercise_completed' | 'lesson_viewed',
  metadata: { 
    language?: string, 
    topic?: string,
    progressIncrement?: number 
  }
) => {
  if (!userId) return;
  
  try {
    // Default progress increment based on activity type
    let progressIncrement = metadata.progressIncrement || 0;
    if (!progressIncrement) {
      switch(activityType) {
        case 'course_completed':
          progressIncrement = 20;
          break;
        case 'exercise_completed':
          progressIncrement = 5;
          break;
        case 'lesson_viewed':
          progressIncrement = 2;
          break;
      }
    }
    
    // Determine which skills to update
    const skillsToUpdate: string[] = [];
    
    // If we have language information
    if (metadata.language) {
      const language = metadata.language.toLowerCase();
      
      // Check if we have a direct mapping
      if (languageToSkillMap[language]) {
        skillsToUpdate.push(...languageToSkillMap[language]);
      }
    }
    
    // If we have topic information
    if (metadata.topic) {
      const topic = metadata.topic.toLowerCase();
      
      // Check if we have a direct mapping
      if (languageToSkillMap[topic]) {
        skillsToUpdate.push(...languageToSkillMap[topic]);
      }
    }
    
    // If we couldn't determine any skills to update, exit
    if (skillsToUpdate.length === 0) return;
    
    // Get current skill levels using custom typing to avoid TypeScript errors
    interface SkillRecord {
      id: string;
      user_id: string;
      skill_name: string;
      progress: number;
      last_updated: string;
    }
    
    const { data: existingSkillsData, error: fetchError } = await supabase
      .from('user_skills_progress')
      .select('*')
      .eq('user_id', userId)
      .in('skill_name', skillsToUpdate);
      
    if (fetchError) throw fetchError;
    
    const existingSkills = existingSkillsData as SkillRecord[] || [];
    
    // Prepare upsert data
    const updates = skillsToUpdate.map(skillName => {
      const existingSkill = existingSkills.find(s => s.skill_name === skillName);
      const currentProgress = existingSkill?.progress || 0;
      // Ensure progress doesn't exceed 100%
      const newProgress = Math.min(100, currentProgress + progressIncrement);
      
      return {
        user_id: userId,
        skill_name: skillName,
        progress: newProgress,
        last_updated: new Date().toISOString()
      };
    });
    
    // Upsert the skill progress
    const { error: upsertError } = await supabase
      .from('user_skills_progress')
      .upsert(updates, {
        onConflict: 'user_id,skill_name'
      });
      
    if (upsertError) throw upsertError;
    
  } catch (error) {
    console.error("Error updating skills:", error);
  }
};
