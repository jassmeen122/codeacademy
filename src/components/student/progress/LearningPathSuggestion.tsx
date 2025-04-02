
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface LearningPathStep {
  title: string;
  description: string;
  status: string;
  icon: LucideIcon;
}

interface LearningPathSuggestionProps {
  pathSteps: LearningPathStep[];
  onStartPath: (step: string) => void;
}

export const LearningPathSuggestion = ({ pathSteps, onStartPath }: LearningPathSuggestionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Parcours d'apprentissage suggéré
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          {pathSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === 0;
            const isCompleted = false;
            
            return (
              <div key={step.title} className="ml-8 mb-8 relative">
                <div className={`absolute -left-10 w-6 h-6 rounded-full flex items-center justify-center ${
                  isCompleted 
                    ? "bg-green-500 text-white" 
                    : isActive 
                      ? "bg-primary text-white" 
                      : "bg-gray-200 text-gray-500"
                }`}>
                  <span className="text-xs">{index + 1}</span>
                </div>
                
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <h3 className="font-medium">{step.title}</h3>
                    <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {step.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                  {isActive && (
                    <Button 
                      size="sm" 
                      className="mt-2"
                      onClick={() => onStartPath(step.title)}
                    >
                      Commencer
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
