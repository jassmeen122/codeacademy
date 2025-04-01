
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface QuickAccessButtonProps {
  onClick: () => void;
}

export const QuickAccessButton: React.FC<QuickAccessButtonProps> = ({ onClick }) => {
  return (
    <div className="fixed bottom-8 right-8 z-40">
      <Button
        size="lg"
        className="rounded-full shadow-lg bg-primary hover:bg-primary/90 p-6"
        onClick={onClick}
        title="Accéder à votre tableau de bord"
      >
        <ArrowRight className="h-6 w-6" />
      </Button>
    </div>
  );
};
