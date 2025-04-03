
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuthState } from "./useAuthState";
import { UserSkill, UserSkillRecord } from "@/types/progress";

// Export the UserSkill type for external use
export type { UserSkill };

export const useUserSkills = () => {
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthState();

  useEffect(() => {
    if (user) {
      fetchUserSkills();
    } else {
      setSkills([]);
      setLoading(false);
    }
  }, [user]);

  const fetchUserSkills = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('user_skills_progress')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Transform the data to match our UserSkill interface
      const typedSkills: UserSkill[] = (data as UserSkillRecord[] || []).map(item => ({
        id: item.id,
        skill_name: item.skill_name,
        progress: item.progress,
        last_updated: item.last_updated
      }));
      
      setSkills(typedSkills);
    } catch (error: any) {
      console.error("Error fetching user skills:", error);
      toast.error("Failed to load skills progress");
    } finally {
      setLoading(false);
    }
  };

  const updateSkillProgress = async (skillName: string, progress: number) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_skills_progress')
        .upsert({
          user_id: user.id,
          skill_name: skillName,
          progress,
          last_updated: new Date().toISOString()
        }, {
          onConflict: 'user_id,skill_name'
        });
      
      if (error) throw error;
      
      // Update local state
      setSkills(prev => {
        const exists = prev.some(skill => skill.skill_name === skillName);
        
        if (exists) {
          return prev.map(skill => 
            skill.skill_name === skillName 
              ? { ...skill, progress, last_updated: new Date().toISOString() } 
              : skill
          );
        } else {
          return [...prev, {
            id: crypto.randomUUID(),
            skill_name: skillName,
            progress,
            last_updated: new Date().toISOString()
          }];
        }
      });
      
      toast.success(`${skillName} progress updated`);
    } catch (error: any) {
      console.error("Error updating skill progress:", error);
      toast.error("Failed to update skill progress");
    }
  };

  return {
    skills,
    loading,
    updateSkillProgress
  };
};
