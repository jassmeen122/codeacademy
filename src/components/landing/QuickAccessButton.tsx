
import React from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Database, Code, Terminal } from "lucide-react";
import { useAuthState } from "@/hooks/useAuthState";

interface QuickAccessButtonProps {
  onClick: () => void;
}

export const QuickAccessButton: React.FC<QuickAccessButtonProps> = ({ onClick }) => {
  const { user } = useAuthState();
  
  // Determine which icon to show based on user role
  const getIconByRole = () => {
    if (!user) return BookOpen;
    
    switch (user.role) {
      case 'admin':
        return Database;
      case 'teacher':
        return Code;
      case 'student':
        return Terminal;
      default:
        return BookOpen;
    }
  };
  
  const Icon = getIconByRole();
  
  return (
    <div className="fixed bottom-8 right-8 z-40">
      <Button
        size="lg"
        className="rounded-full shadow-md bg-primary hover:bg-primary/90 p-6"
        onClick={onClick}
        title={user ? `Access your ${user.role} dashboard` : "Access your dashboard"}
      >
        <Icon className="h-6 w-6" />
      </Button>
    </div>
  );
};
