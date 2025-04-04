
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuthState } from "./useAuthState";
import { UserSkill, UserSkillRecord } from "@/types/progress";

// Use the recommended TypeScript export syntax
export type { UserSkill };

export const useUserSkills = () => {
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthState();

  const fetchUserSkills = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      console.log("Fetching skills for user", user.id);
      
      // Get user skills
      const { data, error } = await supabase
        .from('user_skills_progress')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      console.log("Skills data:", data);
      
      // Transform the data to match our UserSkill interface
      const typedSkills: UserSkill[] = (data as UserSkillRecord[] || []).map(item => ({
        id: item.id,
        skill_name: item.skill_name,
        progress: item.progress,
        last_updated: item.last_updated
      }));
      
      setSkills(typedSkills);
      return typedSkills;
    } catch (error: any) {
      console.error("Error fetching user skills:", error);
      toast.error("Failed to load skills progress");
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchUserSkills();
    } else {
      setSkills([]);
      setLoading(false);
    }
  }, [user, fetchUserSkills]);

  const updateSkillProgress = async (skillName: string, progress: number) => {
    if (!user) return;
    
    try {
      console.log(`Manually updating skill ${skillName} to ${progress}%`);
      
      // Update the skill progress
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
      await fetchUserSkills();
      return true;
    } catch (error: any) {
      console.error("Error updating skill progress:", error);
      toast.error("Failed to update skill progress");
      return false;
    }
  };

  return {
    skills,
    loading,
    updateSkillProgress,
    fetchUserSkills
  };
};
