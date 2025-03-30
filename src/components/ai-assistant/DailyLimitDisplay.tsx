
import React from "react";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Clock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DailyLimitDisplayProps {
  count: number;
  limit: number;
  limitReached: boolean;
  resetTime?: string;
}

export const DailyLimitDisplay: React.FC<DailyLimitDisplayProps> = ({
  count,
  limit,
  limitReached,
  resetTime
}) => {
  const percentage = Math.min((count / limit) * 100, 100);
  
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium">Daily Questions</span>
        <span className="text-sm font-medium">{count}/{limit}</span>
      </div>
      
      <Progress 
        value={percentage} 
        className={`h-2 ${limitReached ? 'bg-red-100' : 'bg-gray-100'}`}
        indicatorClassName={limitReached ? 'bg-red-500' : 'bg-blue-500'}
      />
      
      {limitReached && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center gap-1">
            <span>Daily limit reached. Resets at midnight</span>
            {resetTime && (
              <span className="flex items-center text-xs ml-1">
                <Clock className="h-3 w-3 mr-1" />
                {resetTime}
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
