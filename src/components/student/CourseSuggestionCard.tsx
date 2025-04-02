
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CourseSuggestionCardProps {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  relevanceScore: number;
  path: string;
}

export const CourseSuggestionCard = ({
  id,
  title,
  description,
  difficulty,
  relevanceScore,
  path
}: CourseSuggestionCardProps) => {
  const navigate = useNavigate();
  
  // Get badge color based on difficulty
  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Intermediate':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Advanced':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'Expert':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Get path badge color
  const getPathColor = () => {
    switch (path) {
      case 'frontend':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      case 'backend':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300';
      case 'fullstack':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'mobile':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'devops':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Relevance score to percentage match
  const matchPercentage = Math.round(relevanceScore * 100);

  return (
    <div className="border rounded-lg overflow-hidden transition-all hover:shadow-md bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            {matchPercentage}% Match
          </span>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getDifficultyColor()}`}>
            {difficulty}
          </span>
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getPathColor()}`}>
            {path.charAt(0).toUpperCase() + path.slice(1)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => window.open(`/student/courses/${id}/details`, '_blank')}
          >
            View Details
          </Button>
          
          <Button 
            variant="default" 
            size="sm" 
            className="flex items-center"
            onClick={() => navigate(`/student/courses/${id}/learn`)}
          >
            Start Learning
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
