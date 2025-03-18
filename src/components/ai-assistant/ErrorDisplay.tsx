
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ErrorDisplayProps {
  errorMessage: string | null;
}

export const ErrorDisplay = ({ errorMessage }: ErrorDisplayProps) => {
  if (!errorMessage) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {errorMessage}
        <div className="mt-2 text-sm">
          Make sure your OpenAI API key is configured correctly in Supabase Edge Function secrets.
        </div>
      </AlertDescription>
    </Alert>
  );
};
