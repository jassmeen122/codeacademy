
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Zap, AlertCircle } from "lucide-react";

interface Skill {
  name: string;
  score: number;
  isStrength: boolean;
}

interface StrengthsWeaknessesCardProps {
  skills?: Skill[];
  loading?: boolean;
}

export const StrengthsWeaknessesCard: React.FC<StrengthsWeaknessesCardProps> = ({
  skills = [],
  loading = false
}) => {
  // Si pas de données, créer des exemples
  const demoSkills: Skill[] = [
    { name: "JavaScript", score: 85, isStrength: true },
    { name: "HTML/CSS", score: 75, isStrength: true },
    { name: "Python", score: 65, isStrength: true },
    { name: "SQL", score: 45, isStrength: false },
    { name: "React", score: 40, isStrength: false }
  ];
  
  const displaySkills = skills.length > 0 ? skills : demoSkills;
  
  // Séparer les forces et faiblesses
  const strengths = displaySkills.filter(skill => skill.isStrength);
  const weaknesses = displaySkills.filter(skill => !skill.isStrength);
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Forces et Points à améliorer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <p className="text-muted-foreground animate-pulse">Chargement des données...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Forces et Points à améliorer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Forces */}
          <div>
            <h3 className="flex items-center gap-2 font-medium text-green-600 dark:text-green-400 mb-2">
              <TrendingUp className="h-4 w-4" />
              Forces
            </h3>
            
            <div className="space-y-2">
              {strengths.length > 0 ? (
                strengths.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2 bg-green-50 dark:bg-green-900/10 p-2 rounded-md">
                    <Zap className="h-4 w-4 text-green-500" />
                    <span className="font-medium">{skill.name}</span>
                    <div className="ml-auto flex items-center gap-1">
                      <span className="text-sm text-green-600 dark:text-green-400">{skill.score}%</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm text-center p-2">
                  Complétez des exercices pour découvrir vos forces!
                </p>
              )}
            </div>
          </div>
          
          {/* Points à améliorer */}
          <div>
            <h3 className="flex items-center gap-2 font-medium text-amber-600 dark:text-amber-400 mb-2">
              <TrendingDown className="h-4 w-4" />
              Points à améliorer
            </h3>
            
            <div className="space-y-2">
              {weaknesses.length > 0 ? (
                weaknesses.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/10 p-2 rounded-md">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <span className="font-medium">{skill.name}</span>
                    <div className="ml-auto flex items-center gap-1">
                      <span className="text-sm text-amber-600 dark:text-amber-400">{skill.score}%</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm text-center p-2">
                  Continuez à pratiquer pour identifier les domaines à améliorer!
                </p>
              )}
            </div>
          </div>
          
          {displaySkills === demoSkills && (
            <p className="text-xs text-center text-muted-foreground mt-4">
              ⓘ Données d'exemple. Complétez des exercices pour voir vos statistiques réelles.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
