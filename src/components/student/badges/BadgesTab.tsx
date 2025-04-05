
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeCard } from "./BadgeCard";
import { Medal } from "lucide-react";

// Import icons that might be used for badges
import * as LucideIcons from "lucide-react";

interface BadgesTabProps {
  badges: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    points: number;
    earned: boolean;
    earned_at?: string;
  }>;
  loading: boolean;
  onRefresh: () => void;
}

export const BadgesTab = ({ badges, loading, onRefresh }: BadgesTabProps) => {
  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Award;
    return <IconComponent className="h-5 w-5" />;
  };

  const earnedBadges = badges.filter(badge => badge.earned);
  const unearnedBadges = badges.filter(badge => !badge.earned);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-pulse text-center">
          <p className="text-lg">Chargement des badges...</p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vos Badges</CardTitle>
        <CardDescription>
          Gagnez des badges en complétant des défis et en progressant dans vos cours
        </CardDescription>
      </CardHeader>
      <CardContent>
        {badges.length > 0 ? (
          <div className="space-y-6">
            {earnedBadges.length > 0 && (
              <div>
                <h3 className="font-medium text-lg mb-3">Badges obtenus</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {earnedBadges.map((badge) => (
                    <BadgeCard
                      key={badge.id}
                      id={badge.id}
                      name={badge.name}
                      description={badge.description}
                      icon={badge.icon}
                      points={badge.points}
                      earned={true}
                      earnedAt={badge.earned_at}
                      iconComponent={getIconComponent(badge.icon)}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {unearnedBadges.length > 0 && (
              <div>
                <h3 className="font-medium text-lg mb-3">À débloquer</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {unearnedBadges.map((badge) => (
                    <BadgeCard
                      key={badge.id}
                      id={badge.id}
                      name={badge.name}
                      description={badge.description}
                      icon={badge.icon}
                      points={badge.points}
                      earned={false}
                      iconComponent={getIconComponent(badge.icon)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10">
            <Medal className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-3" />
            <h3 className="text-lg font-medium">Pas encore de badges</h3>
            <p className="text-muted-foreground mb-6">
              Complétez des défis et progressez dans vos cours pour gagner des badges
            </p>
            <Button variant="outline" onClick={onRefresh}>
              Actualiser
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
