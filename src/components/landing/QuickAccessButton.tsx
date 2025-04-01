
import React from "react";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

interface QuickAccessButtonProps {
  onClick: () => void;
}

export const QuickAccessButton: React.FC<QuickAccessButtonProps> = ({ onClick }) => {
  return (
    <div className="fixed bottom-8 right-8 z-40">
      <Button
        size="lg"
        className="rounded-full shadow-md bg-primary hover:bg-primary/90 p-6"
        onClick={onClick}
        title="Access your dashboard"
      >
        <BookOpen className="h-6 w-6" />
      </Button>
    </div>
  );
};
