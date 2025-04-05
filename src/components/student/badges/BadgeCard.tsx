
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

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
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className={`overflow-hidden border transition-all ${
        earned 
          ? 'shadow-md hover:shadow-xl border-primary/30' 
          : 'opacity-65 hover:opacity-90 grayscale'
      }`}>
        <div className={`p-4 ${earned 
          ? 'bg-gradient-to-r from-primary/20 to-primary/5' 
          : 'bg-muted/50'}`}>
          <div className="flex items-center gap-3">
            <div className={`rounded-full p-3 ${
              earned 
                ? 'bg-primary/30 text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {iconComponent}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{name}</h3>
              {earned && earnedAt && (
                <p className="text-xs text-muted-foreground">
                  Obtenu le {formatDate(earnedAt)}
                </p>
              )}
            </div>
            {earned && (
              <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
            )}
          </div>
        </div>
        <CardContent className="pt-4 pb-5">
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
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
