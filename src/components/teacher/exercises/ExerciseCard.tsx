
import { Exercise } from "@/types/exercise";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileCode, BarChart, Clock, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ExerciseCardProps {
  exercise: Exercise;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Exercise["status"]) => void;
}

export const ExerciseCard = ({ exercise, onDelete, onStatusChange }: ExerciseCardProps) => {
  const navigate = useNavigate();

  const getExerciseTypeIcon = (type: Exercise["type"]) => {
    switch (type) {
      case 'coding':
        return <FileCode className="h-5 w-5" />;
      case 'mcq':
        return <BarChart className="h-5 w-5" />;
      default:
        return <FileCode className="h-5 w-5" />;
    }
  };

  const getStatusBadgeColor = (status: Exercise["status"]) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {getExerciseTypeIcon(exercise.type)}
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              {
                Beginner: "bg-green-100 text-green-800",
                Intermediate: "bg-yellow-100 text-yellow-800",
                Advanced: "bg-red-100 text-red-800"
              }[exercise.difficulty]
            }`}>
              {exercise.difficulty}
            </span>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusBadgeColor(exercise.status)}`}>
              {exercise.status.charAt(0).toUpperCase() + exercise.status.slice(1)}
            </span>
          </div>
        </div>
        <CardTitle className="text-xl mt-2">{exercise.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-2 mb-3">
          {exercise.description || "No description provided."}
        </p>
        
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          {exercise.time_limit && (
            <div className="flex items-center mr-4">
              <Clock className="h-4 w-4 mr-1" />
              {exercise.time_limit} min
            </div>
          )}
          <div className="flex items-center">
            <FileCode className="h-4 w-4 mr-1" />
            {exercise.type.replace('_', ' ').charAt(0).toUpperCase() + exercise.type.replace('_', ' ').slice(1)}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => navigate(`/teacher/exercises/edit/${exercise.id}`)}
          >
            <Edit className="h-3.5 w-3.5 mr-1" />
            Edit
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            className="flex-1"
            onClick={() => onDelete(exercise.id)}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Delete
          </Button>
        </div>
        
        <div className="flex gap-2 mt-2">
          {exercise.status !== 'published' && (
            <Button
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={() => onStatusChange(exercise.id, 'published')}
            >
              Publish
            </Button>
          )}
          {exercise.status !== 'draft' && (
            <Button
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={() => onStatusChange(exercise.id, 'draft')}
            >
              Save as Draft
            </Button>
          )}
          {exercise.status !== 'archived' && (
            <Button
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={() => onStatusChange(exercise.id, 'archived')}
            >
              Archive
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
