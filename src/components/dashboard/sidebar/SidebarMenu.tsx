
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MenuItem } from "@/types/sidebar";

interface SidebarMenuProps {
  menuItems: MenuItem[];
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({ menuItems }) => {
  const location = useLocation();

  return (
    <nav className="space-y-1 p-2">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        return (
          <Link key={item.href} to={item.href}>
            <Button
              variant={isActive ? "secondary" : "ghost"}
              className={`w-full justify-start gap-2 ${
                isActive 
                  ? "bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30 text-indigo-900 dark:text-indigo-200 border-l-2 border-indigo-500 font-medium"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              title={item.description}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-indigo-600 dark:text-indigo-400" : ""}`} />
              {item.title}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
};
