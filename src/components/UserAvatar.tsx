
import { GraduationCap, UserCog, Shield, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfile } from "@/hooks/useAuthState";

interface UserAvatarProps {
  user: UserProfile | null;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showFallbackIcon?: boolean;
}

export const UserAvatar = ({ 
  user, 
  className = "", 
  size = "md", 
  showFallbackIcon = true 
}: UserAvatarProps) => {
  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const getRoleStyles = () => {
    switch (user?.role) {
      case "admin":
        return "bg-purple-500 text-purple-50 border-purple-400";
      case "teacher":
        return "bg-amber-500 text-amber-50 border-amber-400";
      case "student":
        return "bg-blue-500 text-blue-50 border-blue-400";
      default:
        return "bg-gray-500 text-gray-50 border-gray-400";
    }
  };

  const getRoleIcon = () => {
    switch (user?.role) {
      case "admin":
        return <Shield className="h-1/2 w-1/2" />;
      case "teacher":
        return <UserCog className="h-1/2 w-1/2" />;
      case "student":
        return <GraduationCap className="h-1/2 w-1/2" />;
      default:
        return <User className="h-1/2 w-1/2" />;
    }
  };

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
    xl: "h-24 w-24"
  };

  return (
    <Avatar className={`border-2 ${getRoleStyles()} ${sizeClasses[size]} ${className}`}>
      <AvatarImage src={user?.avatar_url || ""} alt={user?.full_name || "User"} />
      <AvatarFallback className={getRoleStyles()}>
        {showFallbackIcon ? getRoleIcon() : getInitials(user?.full_name)}
      </AvatarFallback>
    </Avatar>
  );
};
