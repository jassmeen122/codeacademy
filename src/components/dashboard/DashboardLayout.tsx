
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import Navigation from "@/components/Navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <div className="flex-1">
          <Navigation />
          <main className="pt-16 min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
