
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Award } from "lucide-react";
import { BadgeCard } from "./BadgeCard";

interface UserBadge {
  badge: {
    id: string;
    name: string;
    description: string;
    icon: string;
    points: number;
  };
  earned_at: string;
}

interface BadgesListProps {
  badges: UserBadge[];
}

export const BadgesList: React.FC<BadgesListProps> = ({ badges }) => {
  return (
    <Card className="border-t-4 border-t-purple-500 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-purple-500" />
          Badges Débloqués
        </CardTitle>
        <CardDescription>
          Vos accomplissements et récompenses obtenues
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {badges.map((userBadge) => (
            <BadgeCard key={userBadge.badge.id} userBadge={userBadge} />
          ))}
        </div>
        {badges.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-muted-foreground">
              Vous n'avez pas encore débloqué de badges. Complétez des défis pour en gagner!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
