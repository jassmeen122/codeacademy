
import { User, GraduationCap, ShieldCheck } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  user: {
    full_name?: string | null;
    avatar_url?: string | null;
    role?: 'admin' | 'teacher' | 'student' | string;
  } | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const UserAvatar = ({ user, size = "md", className }: UserAvatarProps) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
    xl: "h-24 w-24"
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const getRoleIcon = () => {
    switch (user?.role) {
      case "admin":
        return <ShieldCheck className="h-1/2 w-1/2" />;
      case "teacher":
        return <GraduationCap className="h-1/2 w-1/2" />;
      default:
        return <User className="h-1/2 w-1/2" />;
    }
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case "admin":
        return "bg-purple-100 text-purple-500 dark:bg-purple-900 dark:text-purple-300";
      case "teacher":
        return "bg-amber-100 text-amber-500 dark:bg-amber-900 dark:text-amber-300";
      case "student":
        return "bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  return (
    <Avatar className={cn(sizeClasses[size], "border-2 border-primary", className)}>
      <AvatarImage 
        src={user?.avatar_url || ""} 
        alt={user?.full_name || "User"} 
      />
      <AvatarFallback className={cn("flex items-center justify-center", getRoleColor())}>
        {user?.full_name ? getInitials(user.full_name) : getRoleIcon()}
      </AvatarFallback>
    </Avatar>
  );
};
