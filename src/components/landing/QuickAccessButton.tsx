
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

  const getButtonColor = () => {
    if (!user) return "bg-blue-500 hover:bg-blue-600";
    
    switch (user.role) {
      case 'admin':
        return "bg-green-500 hover:bg-green-600";
      case 'teacher':
        return "bg-blue-500 hover:bg-blue-600";
      case 'student':
        return "bg-green-600 hover:bg-green-700";
      default:
        return "bg-blue-500 hover:bg-blue-600";
    }
  };
  
  const Icon = getIconByRole();
  
  return (
    <div className="fixed bottom-8 right-8 z-40">
      <Button
        size="lg"
        className={`rounded-full shadow-md ${getButtonColor()} p-6`}
        onClick={onClick}
        title={user ? `Access your ${user.role} dashboard` : "Access your dashboard"}
      >
        <Icon className="h-6 w-6" />
      </Button>
    </div>
  );
};
