
import React from 'react';
import { UserSkill } from '@/types/progress';

interface SkillsProgressChartProps {
  skills: UserSkill[];
}

export const SkillsProgressChart: React.FC<SkillsProgressChartProps> = ({ skills }) => {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
      <p>Skills progress visualization is currently under development.</p>
    </div>
  );
};
