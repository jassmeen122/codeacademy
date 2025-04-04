
import { supabase } from '@/integrations/supabase/client';

type SkillActivityContext = {
  language?: string;
  topic?: string;
  progressIncrement?: number;
};

// Map common languages to their core skills
const LANGUAGE_SKILL_MAP: Record<string, string[]> = {
  'JavaScript': ['JavaScript', 'Web Development', 'Front-end'],
  'Python': ['Python', 'Data Science', 'Back-end'],
  'Java': ['Java', 'Object-Oriented Programming', 'Enterprise'],
  'C++': ['C++', 'Systems Programming', 'Game Development'],
  'PHP': ['PHP', 'Web Development', 'Back-end'],
  'C#': ['C#', '.NET', 'Game Development'],
  'Ruby': ['Ruby', 'Web Development', 'Scripting'],
  'Go': ['Go', 'Back-end', 'Concurrency'],
  'Swift': ['Swift', 'iOS Development', 'Mobile'],
  'Kotlin': ['Kotlin', 'Android Development', 'Mobile'],
  'TypeScript': ['TypeScript', 'JavaScript', 'Front-end'],
  'SQL': ['SQL', 'Databases', 'Data Management'],
  'Rust': ['Rust', 'Systems Programming', 'Performance'],
  'HTML': ['HTML', 'Web Development', 'Front-end'],
  'CSS': ['CSS', 'Web Design', 'Front-end']
};

// Map activity types to progress increments and relevant skills
const ACTIVITY_PROGRESS_MAP: Record<string, {baseIncrement: number, skills: string[]}> = {
  'lesson_viewed': {
    baseIncrement: 5,
    skills: ['Learning', 'Theory']
  },
  'exercise_completed': {
    baseIncrement: 10,
    skills: ['Practice', 'Problem Solving']
  },
  'course_completed': {
    baseIncrement: 15, 
    skills: ['Mastery', 'Completion']
  },
  'quiz_completed': {
    baseIncrement: 8,
    skills: ['Knowledge', 'Testing']
  }
};

export const updateUserSkillsForActivity = async (
  userId: string,
  activityType: string,
  context: SkillActivityContext
) => {
  try {
    console.log(`Updating skills: userId=${userId}, activityType=${activityType}, context=`, context);
    
    // Determine which skills to update
    let skillsToUpdate: string[] = [];
    
    // Add activity-related skills
    const activityInfo = ACTIVITY_PROGRESS_MAP[activityType];
    if (activityInfo) {
      skillsToUpdate = [...activityInfo.skills];
    }
    
    // Add language-related skills if applicable
    if (context.language) {
      const mappedSkills = LANGUAGE_SKILL_MAP[context.language] || [context.language];
      skillsToUpdate = [...skillsToUpdate, ...mappedSkills];
    }
    
    // Add topic-specific skills if applicable
    if (context.topic && context.topic !== 'summary') {
      skillsToUpdate.push(context.topic);
    }
    
    // Remove duplicates
    skillsToUpdate = [...new Set(skillsToUpdate)];
    
    // Calculate progress increment
    let progressIncrement = context.progressIncrement || 
                          (activityInfo ? activityInfo.baseIncrement : 5);

    console.log(`Updating ${skillsToUpdate.length} skills with increment ${progressIncrement}`);
    
    // Update each skill in the database
    for (const skill of skillsToUpdate) {
      // First try to get existing skill progress
      const { data: existingSkill, error: fetchError } = await supabase
        .from('user_skills_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('skill_name', skill)
        .maybeSingle();
        
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error(`Error fetching skill ${skill}:`, fetchError);
        continue;
      }
      
      if (existingSkill) {
        // Update existing skill
        let newProgress = existingSkill.progress + progressIncrement;
        // Cap at 100
        newProgress = newProgress > 100 ? 100 : newProgress;
        
        console.log(`Updating skill ${skill}: ${existingSkill.progress} -> ${newProgress}`);
        
        const { error: updateError } = await supabase
          .from('user_skills_progress')
          .update({
            progress: newProgress,
            last_updated: new Date().toISOString()
          })
          .eq('id', existingSkill.id);
          
        if (updateError) {
          console.error(`Error updating skill ${skill}:`, updateError);
        }
      } else {
        // Create new skill entry
        console.log(`Creating new skill entry for ${skill} with progress ${progressIncrement}`);
        
        const { error: insertError } = await supabase
          .from('user_skills_progress')
          .insert({
            user_id: userId,
            skill_name: skill,
            progress: progressIncrement,
            last_updated: new Date().toISOString()
          });
          
        if (insertError) {
          console.error(`Error inserting skill ${skill}:`, insertError);
        }
      }
    }
    
    console.log(`Skill updates completed for ${skillsToUpdate.length} skills`);
    return true;
  } catch (error) {
    console.error("Error updating user skills:", error);
    return false;
  }
};
