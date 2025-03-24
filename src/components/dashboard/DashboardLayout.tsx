import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/useMobile";
import { useAuthState } from "@/hooks/useAuthState";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { UserDropdownMenu } from "@/components/auth/UserDropdownMenu";

export function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useState<boolean>(false);
  const location = useLocation();
  const { userInfo, userRole, userStatus } = useAuthState();
  const { isMobile } = useMobile();

  const [currentPath, setCurrentPath] = useState<string>("");

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  const isTeacherRoute = currentPath.startsWith("/teacher");
  const isStudentRoute = currentPath.startsWith("/student");

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Drawer open={open} onOpenChange={setOpen}>
        <div
          className={cn(
            "fixed top-0 z-20 w-full flex justify-between bg-background/80 backdrop-blur-sm md:hidden px-4 py-3 border-b"
          )}
        >
          <Link
            to="/"
            className="flex items-center gap-2 font-semibold text-lg"
          >
            <img src="/logo.png" alt="Logo" className="h-8 w-8" />
            <span>CodeAcademy</span>
          </Link>
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </DrawerTrigger>
        </div>
        <DrawerContent side={isMobile ? "right" : "left"} className="md:hidden p-0">
          <DashboardSidebar role={userRole} />
        </DrawerContent>
      </Drawer>
      <div className="hidden border-r bg-gray-100/40 md:block dark:bg-gray-800/40">
        <DashboardSidebar role={userRole} />
      </div>
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6 md:z-20">
          <div className="flex flex-1 items-center gap-4">
            <div className="flex flex-col gap-0.5">
              {userInfo && (
                <>
                  <h1 className="font-semibold text-lg">
                    {userInfo.full_name || userInfo.email}
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    {userRole === "student" && "Étudiant"}
                    {userRole === "teacher" && "Professeur"}
                    {userRole === "admin" && "Administrateur"}
                  </p>
                </>
              )}
            </div>
          </div>
          <UserDropdownMenu avatar_url={userInfo?.avatar_url} />
        </header>
        <main className="flex flex-1 flex-col pt-4 md:pt-0">
          {children}
        </main>
      </div>
    </div>
  );
}
