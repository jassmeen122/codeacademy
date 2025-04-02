
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface CourseRecommendation {
  title: string;
  description: string;
  relevance: number;
  icon: LucideIcon;
}

interface CourseRecommendationsProps {
  recommendations: CourseRecommendation[];
  onRecommendationClick: (title: string) => void;
}

export const CourseRecommendations = ({ recommendations, onRecommendationClick }: CourseRecommendationsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Cours recommandés
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec) => {
            const Icon = rec.icon;
            return (
              <Card key={rec.title} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{rec.title}</h3>
                        <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
                          {rec.relevance}% correspondance
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {rec.description}
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => onRecommendationClick(rec.title)}
                      >
                        Voir le cours
                      </Button>
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
