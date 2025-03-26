
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  errorMessage: string | null;
  onRetry?: () => void;
}

export const ErrorDisplay = ({ errorMessage, onRetry }: ErrorDisplayProps) => {
  if (!errorMessage) return null;

  const isOpenAIApiKeyError = errorMessage.includes("OPENAI_API_KEY") || 
                            errorMessage.includes("OpenAI") || 
                            errorMessage.includes("configured");
                        
  const isOpenAIQuotaError = errorMessage.includes("insufficient quota") || 
                           errorMessage.includes("exceeded your current quota") ||
                           errorMessage.includes("billing");
                           
  const isHuggingFaceApiKeyError = errorMessage.includes("HUGGINGFACE_API_KEY") || 
                                 errorMessage.includes("Hugging Face") || 
                                 errorMessage.includes("HuggingFace");

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {errorMessage}
        {isOpenAIApiKeyError && (
          <div className="mt-2 text-sm space-y-2">
            <p>
              To fix this issue, you need to add a valid OpenAI API key to your Supabase Edge Function secrets.
            </p>
            <ol className="list-decimal ml-5 space-y-1">
              <li>Go to the Supabase dashboard</li>
              <li>Navigate to Edge Functions → Settings</li>
              <li>Add or update the <code className="bg-gray-200 px-1 rounded">OPENAI_API_KEY</code> secret with your valid API key</li>
            </ol>
          </div>
        )}
        {isOpenAIQuotaError && (
          <div className="mt-2 text-sm space-y-2">
            <p>
              Your OpenAI API key has reached its usage limits. To fix this issue:
            </p>
            <ol className="list-decimal ml-5 space-y-1">
              <li>Check your billing status on the OpenAI dashboard</li>
              <li>Add credit to your account or upgrade your plan</li>
              <li>Or use a different API key with available quota</li>
              <li>Update the <code className="bg-gray-200 px-1 rounded">OPENAI_API_KEY</code> in Supabase Edge Function secrets</li>
            </ol>
            <p className="mt-2">
              Alternatively, you can use the Hugging Face model instead by selecting it from the model dropdown.
            </p>
          </div>
        )}
        {isHuggingFaceApiKeyError && (
          <div className="mt-2 text-sm space-y-2">
            <p>
              To fix this issue, you need to add a valid Hugging Face API key to your Supabase Edge Function secrets.
            </p>
            <ol className="list-decimal ml-5 space-y-1">
              <li>Go to the Supabase dashboard</li>
              <li>Navigate to Edge Functions → Settings</li>
              <li>Add or update the <code className="bg-gray-200 px-1 rounded">HUGGINGFACE_API_KEY</code> secret with your valid API key</li>
              <li>You can get an API key from <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Hugging Face's tokens page</a></li>
            </ol>
          </div>
        )}
        {onRetry && (
          <Button 
            onClick={onRetry} 
            variant="outline" 
            size="sm" 
            className="mt-2"
          >
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};
