
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BadgeCardProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  earned: boolean;
  earnedAt?: string;
  iconComponent: React.ReactNode;
}

export const BadgeCard = ({ 
  name, 
  description, 
  points, 
  earned, 
  earnedAt, 
  iconComponent 
}: BadgeCardProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <Card className={`overflow-hidden border transition-all ${earned ? 'hover:shadow-md' : 'opacity-60 hover:opacity-80'}`}>
      <div className={`p-4 ${earned ? 'bg-primary/10' : 'bg-muted/50'}`}>
        <div className="flex items-center gap-3">
          <div className={`rounded-full p-2 ${earned ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            {iconComponent}
          </div>
          <div>
            <h3 className="font-semibold">{name}</h3>
            {earned && earnedAt && (
              <p className="text-xs text-muted-foreground">
                Obtenu le {formatDate(earnedAt)}
              </p>
            )}
          </div>
        </div>
      </div>
      <CardContent className="pt-3">
        <p className="text-sm text-muted-foreground mb-2">{description}</p>
        <Badge variant={earned ? "default" : "secondary"}>{points} points</Badge>
        {!earned && (
          <p className="mt-2 text-xs text-muted-foreground italic">Badge non débloqué</p>
        )}
      </CardContent>
    </Card>
  );
};
