
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
      {menuItems.map((item, index) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        return (
          <Link key={item.href} to={item.href}>
            <Button
              variant={isActive ? "secondary" : "ghost"}
              className={`w-full justify-start gap-2 font-mono ${
                isActive 
                  ? "bg-gray-800 text-primary border-l-2 border-primary font-medium"
                  : "hover:bg-gray-800 text-gray-400 hover:text-gray-200"
              }`}
              title={item.description}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} />
              {item.title}
              {index % 3 === 0 && (
                <span className="ml-auto text-xs text-gray-500 opacity-70">{`{${index}}`}</span>
              )}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
};
