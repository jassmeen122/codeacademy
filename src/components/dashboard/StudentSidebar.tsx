import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthState } from "@/hooks/useAuthState";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Book,
  User,
  Settings,
  HelpCircle,
  LogOut,
  LineChart,
} from "lucide-react";
import { NavItem } from "./NavItem";
import { useProgrammingCourses } from "@/hooks/useProgrammingCourses";

export function StudentSidebar() {
  const { user, signOut } = useAuthState();
  const navigate = useNavigate();
  const { languages } = useProgrammingCourses();

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="mr-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar_url || ""} alt={user?.name || "Profile"} />
              <AvatarFallback>{user?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:w-64">
          <SheetHeader>
            <SheetTitle>Profile</SheetTitle>
            <SheetDescription>
              Manage your account settings and set preferences.
            </SheetDescription>
          </SheetHeader>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/student/profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/student/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/help")}>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help & Feedback</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </SheetContent>
      </Sheet>
      
      <div className="space-y-1 px-2">
        <NavItem 
          to="/student/dashboard"
          icon={<Home className="h-4 w-4" />}
        >
          Dashboard
        </NavItem>
        <NavItem 
          to="/student/courses"
          icon={<Book className="h-4 w-4" />}
        >
          Courses
        </NavItem>
        <NavItem 
          to="/student/progress-dashboard"
          icon={<LineChart className="h-4 w-4" />}
        >
          Progress Dashboard
        </NavItem>
      </div>
      
      <div className="mt-auto border-t p-4">
        <p className="text-sm text-muted-foreground">
          {user?.email}
        </p>
        <p className="text-sm">
          {user?.points} Points
        </p>
      </div>
    </div>
  );
}
