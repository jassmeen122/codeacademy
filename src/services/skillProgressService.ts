
import { supabase } from '@/integrations/supabase/client';

// Map des activités vers les compétences
const activityToSkillsMap: Record<string, string[]> = {
  'javascript_lesson': ['JavaScript'],
  'react_lesson': ['React', 'JavaScript'],
  'typescript_lesson': ['TypeScript', 'JavaScript'],
  'nodejs_lesson': ['Node.js', 'JavaScript'],
  'python_lesson': ['Python'],
  'sql_lesson': ['SQL'],
  'html_lesson': ['HTML/CSS'],
  'css_lesson': ['HTML/CSS'],
  'mobile_lesson': ['Mobile'],
  'devops_lesson': ['DevOps']
};

export const updateSkillsFromActivity = async (
  userId: string, 
  activityType: string, 
  progressIncrement: number = 5
) => {
  if (!userId) return;
  
  const skillsToUpdate = activityToSkillsMap[activityType];
  if (!skillsToUpdate) return;
  
  try {
    for (const skillName of skillsToUpdate) {
      // Récupérer la progression actuelle
      const { data: currentSkill } = await supabase
        .from('user_skills')
        .select('progress')
        .eq('user_id', userId)
        .eq('skill_name', skillName)
        .single();
      
      const currentProgress = currentSkill?.progress || 0;
      const newProgress = Math.min(100, currentProgress + progressIncrement);
      
      // Mettre à jour ou créer la compétence
      await supabase
        .from('user_skills')
        .upsert({
          user_id: userId,
          skill_name: skillName,
          progress: newProgress,
          last_updated: new Date().toISOString()
        }, {
          onConflict: 'user_id,skill_name'
        });
    }
  } catch (error) {
    console.error('Error updating skills from activity:', error);
  }
};

export const awardBadgeForProgress = async (userId: string, skillName: string, progress: number) => {
  // Logique pour attribuer des badges basés sur la progression
  const badges: Array<{ name: string; requiredProgress: number }> = [
    { name: `Débutant ${skillName}`, requiredProgress: 25 },
    { name: `Intermédiaire ${skillName}`, requiredProgress: 50 },
    { name: `Avancé ${skillName}`, requiredProgress: 75 },
    { name: `Expert ${skillName}`, requiredProgress: 100 }
  ];
  
  for (const badge of badges) {
    if (progress >= badge.requiredProgress) {
      // Vérifier si le badge n'a pas déjà été attribué
      const { data: existingBadge } = await supabase
        .from('user_badges')
        .select('id')
        .eq('user_id', userId)
        .eq('badge_name', badge.name)
        .single();
      
      if (!existingBadge) {
        // Attribuer le badge (nécessiterait une table user_badges)
        console.log(`Badge "${badge.name}" attribué à l'utilisateur ${userId}`);
      }
    }
  }
};
