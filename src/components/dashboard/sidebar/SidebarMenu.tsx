
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
                  ? "bg-indigo-100 text-indigo-900 hover:bg-indigo-200 hover:text-indigo-900"
                  : "hover:bg-gray-100 hover:text-gray-900"
              }`}
              title={item.description}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-indigo-600" : ""}`} />
              {item.title}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
};
