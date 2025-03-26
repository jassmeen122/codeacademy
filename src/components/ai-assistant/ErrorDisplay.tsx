
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  errorMessage: string | null;
  onRetry?: () => void;
  children?: React.ReactNode;
}

export const ErrorDisplay = ({ errorMessage, onRetry, children }: ErrorDisplayProps) => {
  if (!errorMessage) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Erreur</AlertTitle>
      <AlertDescription className="flex flex-wrap items-center">
        <span>{errorMessage}</span>
        <div className="mt-2 flex gap-2">
          {onRetry && (
            <Button 
              onClick={onRetry} 
              variant="outline" 
              size="sm"
            >
              Réessayer
            </Button>
          )}
          {children}
        </div>
      </AlertDescription>
    </Alert>
  );
};
