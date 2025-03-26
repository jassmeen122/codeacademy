
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

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {errorMessage}
        {isOpenAIApiKeyError && (
          <div className="mt-2 text-sm space-y-2">
            <p>
              Pour résoudre ce problème, vous devez ajouter une clé API OpenAI valide aux secrets de votre fonction Edge Supabase.
            </p>
            <ol className="list-decimal ml-5 space-y-1">
              <li>Accédez au tableau de bord Supabase</li>
              <li>Naviguez vers Edge Functions → Paramètres</li>
              <li>Ajoutez ou mettez à jour le secret <code className="bg-gray-200 px-1 rounded">OPENAI_API_KEY</code> avec votre clé API valide</li>
            </ol>
          </div>
        )}
        {isOpenAIQuotaError && (
          <div className="mt-2 text-sm space-y-2">
            <p>
              Votre clé API OpenAI a atteint ses limites d'utilisation. Pour résoudre ce problème :
            </p>
            <ol className="list-decimal ml-5 space-y-1">
              <li>Vérifiez l'état de votre facturation sur le tableau de bord OpenAI</li>
              <li>Ajoutez du crédit à votre compte ou mettez à niveau votre forfait</li>
              <li>Ou utilisez une clé API différente avec un quota disponible</li>
              <li>Mettez à jour la <code className="bg-gray-200 px-1 rounded">OPENAI_API_KEY</code> dans les secrets de la fonction Edge Supabase</li>
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
            Réessayer
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};
