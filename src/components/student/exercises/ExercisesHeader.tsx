
import React from "react";
import { FileCode, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";

interface ExercisesHeaderProps {
  totalProgress: number;
}

export const ExercisesHeader: React.FC<ExercisesHeaderProps> = ({ totalProgress }) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Programming Exercises</h1>
          <p className="text-gray-600">Practice and improve your coding skills</p>
        </div>
        <div className="flex-shrink-0">
          <Button onClick={() => navigate("/student/code-editor")} className="flex items-center gap-2 bg-primary hover:bg-primary/90">
            <FileCode className="h-4 w-4" />
            Code Editor
          </Button>
        </div>
      </div>

      <Alert className="bg-blue-50 border-blue-200 mb-4">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-700">
          Complete exercises to earn points and badges. Your progress is tracked automatically.
        </AlertDescription>
      </Alert>
    </>
  );
};
