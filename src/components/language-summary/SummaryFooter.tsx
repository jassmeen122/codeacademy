
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, CheckCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface SummaryFooterProps {
  isRead: boolean;
  onMarkAsRead: () => void;
}

export const SummaryFooter: React.FC<SummaryFooterProps> = ({ 
  isRead, 
  onMarkAsRead 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between mt-8">
      <Button
        variant="outline"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour
      </Button>
      
      {!isRead ? (
        <Button 
          onClick={onMarkAsRead}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Marquer comme Lu
        </Button>
      ) : (
        <div className="flex items-center text-green-600">
          <CheckCircle className="h-5 w-5 mr-1" />
          <span className="font-medium">Résumé Complété</span>
        </div>
      )}
    </div>
  );
};
