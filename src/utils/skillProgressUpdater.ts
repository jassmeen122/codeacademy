
import { supabase } from "@/integrations/supabase/client";
import { UserSkillRecord } from "@/types/progress";

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
  // Add more common languages/topics
  "java": ["Java"],
  "c++": ["C++"],
  "c#": ["C#", ".NET"],
  "php": ["PHP"],
  "ruby": ["Ruby"],
  "go": ["Go"],
  "rust": ["Rust"],
  "dart": ["Dart", "Mobile"],
  "swift": ["Swift", "Mobile"],
  "kotlin": ["Kotlin", "Mobile"],
  "android": ["Mobile", "Android"],
  "ios": ["Mobile", "iOS"],
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
    console.log(`Updating user skills: userId=${userId}, activityType=${activityType}, metadata=`, metadata);
    
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
      if (language in languageToSkillMap) {
        skillsToUpdate.push(...languageToSkillMap[language]);
      } else {
        // If no direct mapping, add the language as a skill itself
        skillsToUpdate.push(metadata.language);
      }
    }
    
    // If we have topic information
    if (metadata.topic) {
      const topic = metadata.topic.toLowerCase();
      
      // Check if we have a direct mapping
      if (topic in languageToSkillMap) {
        skillsToUpdate.push(...languageToSkillMap[topic]);
      } else {
        // If no direct mapping, add the topic as a skill itself
        skillsToUpdate.push(metadata.topic);
      }
    }
    
    // If we couldn't determine any skills to update, use a default skill
    if (skillsToUpdate.length === 0) {
      skillsToUpdate.push("General Programming");
    }
    
    console.log(`Skills to update: ${skillsToUpdate.join(', ')}`);
    
    // Get current skill levels
    const { data, error: fetchError } = await supabase
      .from('user_skills_progress')
      .select('*')
      .eq('user_id', userId)
      .in('skill_name', skillsToUpdate);
      
    if (fetchError) {
      console.error("Error fetching user skills:", fetchError);
      throw fetchError;
    }
    
    const existingSkills = data as UserSkillRecord[] || [];
    console.log("Existing skills:", existingSkills);
    
    // Prepare upsert data
    const updates = skillsToUpdate.map(skillName => {
      const existingSkill = existingSkills.find(s => s.skill_name === skillName);
      const currentProgress = existingSkill?.progress || 0;
      // Ensure progress doesn't exceed 100%
      const newProgress = Math.min(100, currentProgress + progressIncrement);
      
      console.log(`Updating skill ${skillName}: ${currentProgress} -> ${newProgress}`);
      
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
      
    if (upsertError) {
      console.error("Error upserting skills:", upsertError);
      throw upsertError;
    }
    
    console.log(`Skills updated for user ${userId}: ${skillsToUpdate.join(', ')}`);
    return skillsToUpdate;
    
  } catch (error) {
    console.error("Error updating skills:", error);
    return [];
  }
};
