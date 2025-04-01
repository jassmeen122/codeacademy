
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Star } from "lucide-react";
import { ExerciseUI } from "@/types/exerciseUI";

interface ExerciseCardProps {
  exercise: ExerciseUI;
  isActive: boolean;
  onClick: () => void;
  difficulties: Record<string, { stars: number; className: string }>;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ 
  exercise, 
  isActive, 
  onClick, 
  difficulties 
}) => {
  const getStatusIcon = (status: ExerciseUI["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in_progress":
        return <Circle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-300" />;
    }
  };

  const renderStars = (count: number) => {
    return Array(count).fill(0).map((_, i) => <Star key={i} className="h-4 w-4 inline-block text-yellow-500 fill-yellow-500" />);
  };

  return (
    <Card 
      className={`cursor-pointer hover:shadow-md transition-shadow ${isActive ? 'border-blue-500 ring-2 ring-blue-200' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {exercise.title}
        </CardTitle>
        {getStatusIcon(exercise.status)}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {exercise.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${difficulties[exercise.difficulty].className}`}>
              {renderStars(difficulties[exercise.difficulty].stars)}
            </span>
            {exercise.language && (
              <Badge variant="outline" className="text-xs">
                {exercise.language}
              </Badge>
            )}
          </div>
          {exercise.theme && <Badge className="bg-blue-100 text-blue-800 border-none">{exercise.theme}</Badge>}
        </div>
      </CardContent>
    </Card>
  );
};
