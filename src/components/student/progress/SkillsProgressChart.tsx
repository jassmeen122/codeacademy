
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { UserSkill } from '@/types/progress';

interface SkillsProgressChartProps {
  skills: UserSkill[];
}

export const SkillsProgressChart: React.FC<SkillsProgressChartProps> = ({ skills }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

  // Sort skills by progress for better visualization
  const sortedSkills = [...skills].sort((a, b) => b.progress - a.progress);

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sortedSkills}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="skill_name" 
            angle={-45} 
            textAnchor="end"
            height={60}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            domain={[0, 100]} 
            label={{ 
              value: 'Progress (%)', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle' }
            }} 
          />
          <Tooltip 
            formatter={(value) => [`${value}%`, 'Progress']}
            labelFormatter={(label) => `Skill: ${label}`}
          />
          <Bar dataKey="progress" name="Skill Progress">
            {sortedSkills.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
