
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
          <h1 className="text-3xl font-bold text-gray-800">Exercices de Programmation</h1>
          <p className="text-gray-600">Pratiquez et améliorez vos compétences de programmation</p>
        </div>
        <div className="flex-shrink-0">
          <Button onClick={() => navigate("/student/code-editor")} className="flex items-center gap-2">
            <FileCode className="h-4 w-4" />
            Éditeur de Code
          </Button>
        </div>
      </div>

      <Alert className="bg-blue-50 border-blue-200 mb-4">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-700">
          Complétez des exercices pour gagner des points et des badges. Votre progression est suivie automatiquement.
        </AlertDescription>
      </Alert>
    </>
  );
};
