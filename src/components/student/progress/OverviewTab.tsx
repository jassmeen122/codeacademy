import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { statsData, skillsData, achievementsData } from "@/data/progressData";
import { UserActivity, UserProgressReport } from "@/hooks/useUserPerformance";
import { Skeleton } from "@/components/ui/skeleton";

interface OverviewTabProps {
  loading: boolean;
  progressReport: UserProgressReport | null;
  activities: UserActivity[];
}

const OverviewTab = ({ loading, progressReport, activities }: OverviewTabProps) => {
  // Calculate stats based on real data if available
  const calculatedStats = React.useMemo(() => {
    if (!activities.length) return statsData;

    const learningHours = activities
      .filter(a => a.activity_type === 'learning_session')
      .reduce((sum, a) => sum + (a.activity_data?.duration_minutes || 0), 0) / 60;

    const coursesCompletedCount = activities
      .filter(a => a.activity_type === 'course_completed')
      .length;

    const exercisesCompleted = activities
      .filter(a => a.activity_type === 'exercise_completed')
      .length;

    const achievementPoints = activities
      .filter(a => a.activity_type === 'points_earned')
      .reduce((sum, a) => sum + (a.activity_data?.points || 0), 0);

    // Only update stats if we have real data, otherwise keep the mock data
    return [
      {
        ...statsData[0],
        value: learningHours > 0 ? `${learningHours.toFixed(1)}h` : statsData[0].value
      },
      {
        ...statsData[1],
        value: coursesCompletedCount > 0 ? `${coursesCompletedCount}/5` : statsData[1].value
      },
      {
        ...statsData[2],
        value: exercisesCompleted > 0 ? exercisesCompleted.toString() : statsData[2].value
      },
      {
        ...statsData[3],
        value: achievementPoints > 0 ? achievementPoints.toLocaleString() : statsData[3].value
      }
    ];
  }, [activities]);

  // Calculate progress of completed steps if available
  const completionPercentage = progressReport?.completion_percentage || 0;

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Skeleton for Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-1/3 mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Skeleton for Skills Progress */}
        <Card className="mb-8">
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-[40px]" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Skeleton for Achievements */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {calculatedStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Skills Progress - enhanced with completion percentage if available */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Skills Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {skillsData.map((skill) => {
              // If we have a progress report with completion percentage > 0, 
              // adjust the first skill's progress to match
              const adjustedProgress = 
                skill.name === "JavaScript" && completionPercentage > 0 
                  ? completionPercentage 
                  : skill.progress;
                  
              return (
                <div key={skill.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{skill.name}</span>
                    <span>{adjustedProgress}%</span>
                  </div>
                  <Progress value={adjustedProgress} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievementsData.map((achievement) => {
              // Check if user has this achievement based on activities
              const hasAchievement = achievement.achieved || 
                activities.some(a => 
                  a.activity_type === 'achievement_earned' && 
                  a.activity_data?.achievement_title === achievement.title
                );
              
              const Icon = achievement.icon;
              return (
                <Card key={achievement.title} className={hasAchievement ? "border-primary" : ""}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${
                        hasAchievement ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-medium">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;
