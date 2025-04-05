
import { useState } from 'react';
import { UserSkill } from '@/types/progress';

export const useUserSkills = () => {
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUserSkills = async () => {
    // This is a stub implementation
    return [];
  };

  return { skills, loading, fetchUserSkills };
};
