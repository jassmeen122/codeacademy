
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Star, Brain, Code, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProgressTipsCardProps {
  exercisesCompleted: number;
  coursesCompleted: number;
}

export const ProgressTipsCard: React.FC<ProgressTipsCardProps> = ({
  exercisesCompleted,
  coursesCompleted
}) => {
  // Générer des conseils basés sur les points de l'utilisateur
  const generateTips = () => {
    const tips = [];
    
    // Conseils basés sur les exercices complétés
    if (exercisesCompleted === 0) {
      tips.push({
        title: "Commencez votre parcours",
        description: "Essayez de compléter un exercice simple aujourd'hui pour débuter!",
        icon: <Star className="h-5 w-5 text-amber-500" />,
        level: "débutant"
      });
    } else if (exercisesCompleted < 5) {
      tips.push({
        title: "Créer une habitude",
        description: "Essayez de compléter un exercice par jour pendant une semaine!",
        icon: <Star className="h-5 w-5 text-amber-500" />,
        level: "débutant"
      });
    } else if (exercisesCompleted < 20) {
      tips.push({
        title: "Variez les défis",
        description: "Essayez un exercice d'un autre langage de programmation pour élargir vos compétences!",
        icon: <Code className="h-5 w-5 text-purple-500" />,
        level: "intermédiaire" 
      });
    } else {
      tips.push({
        title: "Devenez un mentor",
        description: "À ce stade, vous pourriez aider d'autres débutants sur le forum!",
        icon: <Brain className="h-5 w-5 text-blue-500" />,
        level: "avancé"
      });
    }
    
    // Conseils basés sur les cours complétés
    if (coursesCompleted === 0) {
      tips.push({
        title: "Explorer les cours",
        description: "Parcourez notre catalogue et choisissez un cours qui vous intéresse!",
        icon: <BookOpen className="h-5 w-5 text-green-500" />,
        level: "débutant"
      });
    } else if (coursesCompleted < 3) {
      tips.push({
        title: "Approfondissez vos connaissances",
        description: "Terminez les modules avancés des cours que vous avez commencés!",
        icon: <BookOpen className="h-5 w-5 text-green-500" />,
        level: "intermédiaire"
      });
    } else {
      tips.push({
        title: "Créez un projet personnel",
        description: "Utilisez vos connaissances pour créer un projet qui vous passionne!",
        icon: <BookOpen className="h-5 w-5 text-green-500" />,
        level: "avancé"
      });
    }
    
    return tips;
  };
  
  const tips = generateTips();
  
  // Afficher un conseil au hasard
  const showRandomTip = () => {
    if (tips.length === 0) return;
    
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    toast.info(`Conseil: ${randomTip.description}`, {
      icon: randomTip.icon
    });
  };
  
  return (
    <Card className="border-l-4 border-l-amber-500">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          Conseils personnalisés
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tips.length === 0 ? (
            <p className="text-muted-foreground text-center py-2">
              Connectez-vous pour voir des conseils personnalisés!
            </p>
          ) : (
            <>
              {tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg">
                  {tip.icon}
                  <div>
                    <h4 className="font-medium text-sm">{tip.title}</h4>
                    <p className="text-sm text-muted-foreground">{tip.description}</p>
                    <span className="text-xs font-medium mt-1 inline-block px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
                      Niveau: {tip.level}
                    </span>
                  </div>
                </div>
              ))}
              
              <Button 
                onClick={showRandomTip} 
                variant="outline" 
                className="w-full mt-2 text-amber-600 border-amber-300 hover:bg-amber-50 dark:border-amber-700 dark:hover:bg-amber-900/20"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Afficher un autre conseil
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
