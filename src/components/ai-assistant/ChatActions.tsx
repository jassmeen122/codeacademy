
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trash } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ChatActionsProps {
  onClearChat: () => void;
  onRetry: () => void;
  showRetry: boolean;
}

export const ChatActions = ({ onClearChat, onRetry, showRetry }: ChatActionsProps) => {
  return (
    <div className="flex gap-2">
      <TooltipProvider>
        {showRetry && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" onClick={onRetry} size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Réessayer
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Réessayer la dernière requête</p>
            </TooltipContent>
          </Tooltip>
        )}
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" onClick={onClearChat} size="sm">
              <Trash className="h-4 w-4 mr-2" />
              Effacer
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Effacer l'historique de conversation</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
