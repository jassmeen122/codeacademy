
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeCard } from "./BadgeCard";
import { Medal, Award, Search, Filter } from "lucide-react";
import { Badge as BadgeType } from '@/hooks/useGamification';
import { useState, useMemo } from "react";
import * as LucideIcons from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface BadgesTabProps {
  badges: BadgeType[];
  loading: boolean;
  onRefresh: () => void;
}

export const BadgesTab = ({ badges, loading, onRefresh }: BadgesTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showEarned, setShowEarned] = useState(true);
  const [showUnearned, setShowUnearned] = useState(true);

  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Award;
    return <IconComponent className="h-5 w-5" />;
  };

  const filteredBadges = useMemo(() => {
    return badges.filter(badge => {
      const matchesSearch = badge.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           badge.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = (showEarned && badge.earned) || (showUnearned && !badge.earned);
      return matchesSearch && matchesFilter;
    });
  }, [badges, searchTerm, showEarned, showUnearned]);

  const earnedBadges = filteredBadges.filter(badge => badge.earned);
  const unearnedBadges = filteredBadges.filter(badge => !badge.earned);

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
    <Card className="border-none shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-background pb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="flex items-center text-2xl">
              <Award className="mr-2 h-6 w-6 text-primary" />
              Vos Badges
            </CardTitle>
            <CardDescription className="text-base mt-1">
              Gagnez des badges en complétant des défis et en progressant dans vos cours
            </CardDescription>
          </div>
          <Button variant="outline" onClick={onRefresh} size="sm">
            Actualiser
          </Button>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher des badges..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={showEarned ? "default" : "outline"}
              onClick={() => setShowEarned(!showEarned)}
              className="text-xs"
            >
              Badges obtenus
            </Button>
            <Button
              size="sm"
              variant={showUnearned ? "default" : "outline"}
              onClick={() => setShowUnearned(!showUnearned)}
              className="text-xs"
            >
              À débloquer
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {badges.length > 0 ? (
          <div className="space-y-8">
            <AnimatePresence>
              {earnedBadges.length > 0 && showEarned && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-3 flex items-center">
                    <Medal className="h-5 w-5 mr-2 text-yellow-500" />
                    <h3 className="font-medium text-lg">Badges obtenus ({earnedBadges.length})</h3>
                  </div>
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
                </motion.div>
              )}
              
              {unearnedBadges.length > 0 && showUnearned && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <div className="mb-3 flex items-center">
                    <Filter className="h-5 w-5 mr-2 text-gray-500" />
                    <h3 className="font-medium text-lg">À débloquer ({unearnedBadges.length})</h3>
                  </div>
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
                </motion.div>
              )}
            </AnimatePresence>
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
