
import React from 'react';
import { Button } from "@/components/ui/button";
import { CardTitle, CardDescription, CardHeader } from "@/components/ui/card";
import { BookOpen, CheckCircle } from "lucide-react";

interface SummaryHeaderProps {
  title: string;
  isRead: boolean;
  onMarkAsRead: () => void;
}

export const SummaryHeader: React.FC<SummaryHeaderProps> = ({ 
  title, 
  isRead, 
  onMarkAsRead 
}) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <div>
        <div className="flex items-center gap-2">
          <CardTitle className="text-2xl">{title}</CardTitle>
          {isRead && (
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-5 w-5 mr-1" />
              <span className="text-sm font-medium">Lu</span>
            </div>
          )}
        </div>
        <CardDescription>
          Résumé des concepts fondamentaux du langage
        </CardDescription>
      </div>
      {!isRead && (
        <Button 
          onClick={onMarkAsRead}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Marquer comme Lu
        </Button>
      )}
    </CardHeader>
  );
};
