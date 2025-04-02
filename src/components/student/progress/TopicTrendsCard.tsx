
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { formatAsPercentage } from "@/utils/chartUtils";

interface TopicTrend {
  name: string;
  trend: number;
}

interface TopicTrendsCardProps {
  topics: TopicTrend[];
}

export const TopicTrendsCard = ({ topics }: TopicTrendsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LineChart className="h-5 w-5 text-blue-500" />
          Tendances et sujets populaires
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topics.map((topic) => (
            <div key={topic.name} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{topic.name}</span>
                <span className="font-medium text-blue-600">{formatAsPercentage(topic.trend)}</span>
              </div>
              <Progress value={topic.trend} className="h-2" />
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Basé sur les tendances actuelles du marché et votre profil d'apprentissage
        </p>
      </CardContent>
    </Card>
  );
};
