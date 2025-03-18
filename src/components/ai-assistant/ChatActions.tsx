
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trash } from "lucide-react";

interface ChatActionsProps {
  onClearChat: () => void;
  onRetry: () => void;
  showRetry: boolean;
}

export const ChatActions = ({ onClearChat, onRetry, showRetry }: ChatActionsProps) => {
  return (
    <div className="flex gap-2">
      {showRetry && (
        <Button variant="outline" onClick={onRetry}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      )}
      <Button variant="outline" onClick={onClearChat}>
        <Trash className="h-4 w-4 mr-2" />
        Clear Chat
      </Button>
    </div>
  );
};
