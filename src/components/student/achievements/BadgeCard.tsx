
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Zap, Code, Users, Target, Trophy, Flame, Star, Layers } from "lucide-react";

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

interface BadgeCardProps {
  userBadge: UserBadge;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ userBadge }) => {
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'award': return <Award className="h-6 w-6" />;
      case 'zap': return <Zap className="h-6 w-6" />;
      case 'code': return <Code className="h-6 w-6" />;
      case 'users': return <Users className="h-6 w-6" />;
      case 'target': return <Target className="h-6 w-6" />;
      case 'flame': return <Flame className="h-6 w-6" />;
      case 'star': return <Star className="h-6 w-6" />;
      case 'layers': return <Layers className="h-6 w-6" />;
      default: return <Trophy className="h-6 w-6" />;
    }
  };

  const getBadgeColor = (name: string) => {
    const colorMap: Record<string, string> = {
      'Débutant': "bg-green-100 text-green-800 border-green-200",
      'Intermédiaire': "bg-blue-100 text-blue-800 border-blue-200",
      'Expert': "bg-purple-100 text-purple-800 border-purple-200",
      'Motivé': "bg-orange-100 text-orange-800 border-orange-200",
      'Challengeur': "bg-green-100 text-green-800 border-green-200",
      'Pro du Debug': "bg-cyan-100 text-cyan-800 border-cyan-200",
      'Full Stack Dev': "bg-indigo-100 text-indigo-800 border-indigo-200"
    };
    
    return colorMap[name] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all">
      <div className={`h-1.5 w-full bg-gradient-to-r ${userBadge.badge.name === 'Expert' ? 'from-purple-400 to-pink-500' : 'from-blue-400 to-indigo-500'}`}></div>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${getBadgeColor(userBadge.badge.name)}`}>
            {getIconComponent(userBadge.badge.icon)}
          </div>
          <div>
            <h3 className="font-medium text-lg">{userBadge.badge.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              {userBadge.badge.description}
            </p>
            <div className="flex gap-2">
              <Badge variant="secondary" className="bg-gray-100">
                {userBadge.badge.points} points
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                Débloqué
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
