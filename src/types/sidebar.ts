
import { LucideIcon } from "lucide-react";

export interface MenuItem {
  title: string;
  icon: LucideIcon;
  href: string;
  description?: string;
}

export interface SidebarItem {
  title: string;
  items: MenuItem[];
}
