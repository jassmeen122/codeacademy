
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface UserAchievement {
  title: string;
  description: string;
  icon: LucideIcon;
  achieved: boolean;
}

interface AchievementsCardProps {
  achievements: UserAchievement[];
}

export const AchievementsCard = ({ achievements }: AchievementsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-yellow-500" />
          Réussites
        </CardTitle>
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
  );
};
