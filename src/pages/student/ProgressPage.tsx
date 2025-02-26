
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Clock,
  BookOpen,
  Code,
  Target,
  Award,
} from "lucide-react";

const ProgressPage = () => {
  const stats = [
    {
      title: "Total Learning Hours",
      value: "24h",
      icon: Clock,
      description: "Time spent learning",
    },
    {
      title: "Courses Completed",
      value: "3/5",
      icon: BookOpen,
      description: "Completed courses",
    },
    {
      title: "Coding Exercises",
      value: "45",
      icon: Code,
      description: "Exercises completed",
    },
    {
      title: "Achievement Points",
      value: "1,250",
      icon: Trophy,
      description: "Points earned",
    },
  ];

  const skills = [
    { name: "JavaScript", progress: 75 },
    { name: "React", progress: 60 },
    { name: "TypeScript", progress: 45 },
    { name: "Node.js", progress: 30 },
  ];

  const achievements = [
    {
      title: "Quick Learner",
      description: "Complete 5 lessons in one day",
      icon: Target,
      achieved: true,
    },
    {
      title: "Code Master",
      description: "Solve 10 coding challenges",
      icon: Award,
      achieved: true,
    },
    {
      title: "Team Player",
      description: "Help 5 other students",
      icon: Trophy,
      achieved: false,
    },
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Learning Progress</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
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

        {/* Skills Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Skills Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{skill.name}</span>
                    <span>{skill.progress}%</span>
                  </div>
                  <Progress value={skill.progress} className="h-2" />
                </div>
              ))}
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
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <Card key={achievement.title} className={achievement.achieved ? "border-primary" : ""}>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${
                          achievement.achieved ? "bg-primary text-primary-foreground" : "bg-muted"
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
    </DashboardLayout>
  );
};

export default ProgressPage;
