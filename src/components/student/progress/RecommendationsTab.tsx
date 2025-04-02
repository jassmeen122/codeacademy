
import React from "react";
import { CourseRecommendations } from "./CourseRecommendations";
import { LearningPathSuggestion } from "./LearningPathSuggestion";
import { TopicTrendsCard } from "./TopicTrendsCard";
import { Target, Code, BarChart, LineChart } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface RecommendationsTabProps {
  recommendations: {
    title: string;
    description: string;
    relevance: number;
    icon: LucideIcon;
  }[];
  onTrackActivity: (activityType: string) => void;
}

export const RecommendationsTab = ({ recommendations, onTrackActivity }: RecommendationsTabProps) => {
  const handleRecommendationClick = (title: string) => {
    onTrackActivity(`Viewed ${title} recommendation`);
  };

  const handleStartPath = (step: string) => {
    onTrackActivity(`Started path step: ${step}`);
  };

  const pathSteps = [
    {
      title: "Maîtrise TypeScript",
      description: "Concentrez-vous sur les types avancés et les modèles pour renforcer vos fondamentaux",
      status: "Actuel", 
      icon: Target
    },
    {
      title: "Développement Backend Node.js",
      description: "Créez des API RESTful et comprenez les concepts côté serveur",
      status: "Prochaine étape", 
      icon: Code
    },
    {
      title: "Projet d'intégration Full-Stack",
      description: "Combinez vos compétences frontend et backend dans un projet complet",
      status: "Futur", 
      icon: BarChart
    },
    {
      title: "Tests & DevOps",
      description: "Apprenez à tester vos applications et à les déployer efficacement",
      status: "Futur", 
      icon: LineChart
    },
  ];

  const topicTrends = [
    { name: "Développement mobile React Native", trend: 92 },
    { name: "Serverless Architecture", trend: 87 },
    { name: "DevOps et CI/CD", trend: 83 },
    { name: "Intelligence artificielle et ML", trend: 78 },
    { name: "Blockchain et Web3", trend: 72 }
  ];

  return (
    <div className="space-y-8">
      <CourseRecommendations 
        recommendations={recommendations} 
        onRecommendationClick={handleRecommendationClick} 
      />
      <LearningPathSuggestion 
        pathSteps={pathSteps} 
        onStartPath={handleStartPath} 
      />
      <TopicTrendsCard topics={topicTrends} />
    </div>
  );
};
