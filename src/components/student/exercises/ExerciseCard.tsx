
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

  const difficultyClasses = {
    "easy": "bg-green-100 text-green-800",
    "medium": "bg-yellow-100 text-yellow-800",
    "hard": "bg-red-100 text-red-800"
  };

  return (
    <Card 
      className={`cursor-pointer hover:shadow-md transition-shadow ${isActive ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'}`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-800">
          {exercise.title}
        </CardTitle>
        {getStatusIcon(exercise.status)}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {exercise.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${difficultyClasses[exercise.difficulty as keyof typeof difficultyClasses] || difficulties[exercise.difficulty].className}`}>
              {renderStars(difficulties[exercise.difficulty].stars)}
            </span>
            {exercise.language && (
              <Badge variant="outline" className="text-xs border-gray-200 text-gray-700">
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
