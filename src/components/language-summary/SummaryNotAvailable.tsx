
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Code } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export const SummaryNotAvailable: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Code className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-medium mb-2">Résumé non disponible</h3>
        <p className="text-gray-500 max-w-md text-center mb-6">
          Le résumé pour ce langage n'est pas encore disponible.
        </p>
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
      </CardContent>
    </Card>
  );
};
