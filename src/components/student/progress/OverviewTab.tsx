
import React from "react";
import { StatsGrid } from "./StatsGrid";
import { WeeklyActivityChart } from "./WeeklyActivityChart";
import { TasksProgressionTable } from "./TasksProgressionTable";
import { SkillsProgress } from "./SkillsProgress";
import { AchievementsCard } from "./AchievementsCard";

interface OverviewTabProps {
  stats: any;
  weeklyActivity: any[];
  tasks: any[];
  skills: any[];
  achievements: any[];
  onTrackActivity: (activityType: string) => void;
}

export const OverviewTab = ({ 
  stats,
  weeklyActivity,
  tasks,
  skills, 
  achievements,
  onTrackActivity
}: OverviewTabProps) => {
  return (
    <div className="space-y-8">
      <StatsGrid stats={stats} />
      <WeeklyActivityChart weeklyActivity={weeklyActivity} />
      <TasksProgressionTable 
        tasks={tasks} 
        onViewAllTasks={() => onTrackActivity("View All Tasks")} 
      />
      <SkillsProgress skills={skills} />
      <AchievementsCard achievements={achievements} />
    </div>
  );
};
