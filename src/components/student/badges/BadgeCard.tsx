
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

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
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Card className={`overflow-hidden border transition-all ${
        earned 
          ? 'shadow-md hover:shadow-lg border-primary/20' 
          : 'opacity-60 hover:opacity-85 grayscale'
      }`}>
        <div className={`p-4 ${earned ? 'bg-gradient-to-r from-primary/10 to-primary/5' : 'bg-muted/50'}`}>
          <div className="flex items-center gap-3">
            <div className={`rounded-full p-3 ${
              earned 
                ? 'bg-primary/20 text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}>
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
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
          <div className="flex items-center justify-between">
            <Badge variant={earned ? "default" : "secondary"} className="font-semibold">
              {points} XP
            </Badge>
            {!earned && (
              <p className="text-xs text-muted-foreground italic">Badge non débloqué</p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
