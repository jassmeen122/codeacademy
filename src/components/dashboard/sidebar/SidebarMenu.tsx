
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MenuItem, SidebarItem } from "@/types/sidebar";
import { Fragment } from "react";

interface SidebarMenuProps {
  menuItems: MenuItem[] | SidebarItem[];
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({ menuItems }) => {
  const location = useLocation();
  
  // Function to check if the item is a MenuItem or SidebarItem
  const isSidebarItem = (item: MenuItem | SidebarItem): item is SidebarItem => {
    return 'items' in item;
  };

  return (
    <div className="space-y-2">
      {menuItems.map((item, index) => {
        if (isSidebarItem(item)) {
          // This is a SidebarItem with nested items
          return (
            <div key={item.title} className="mb-4">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                {item.title}
              </h3>
              <nav className="space-y-1">
                {item.items.map((subItem, subIndex) => {
                  const Icon = subItem.icon;
                  const isActive = location.pathname === subItem.href;
                  return (
                    <Link key={subItem.href} to={subItem.href}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={`w-full justify-start gap-2 font-mono ${
                          isActive 
                            ? "bg-gray-800 text-primary border-l-2 border-primary font-medium"
                            : "hover:bg-gray-800 text-gray-400 hover:text-gray-200"
                        }`}
                        title={subItem.description}
                      >
                        <Icon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} />
                        {subItem.title}
                        {subIndex % 3 === 0 && (
                          <span className="ml-auto text-xs text-gray-500 opacity-70">{`{${subIndex}}`}</span>
                        )}
                      </Button>
                    </Link>
                  );
                })}
              </nav>
            </div>
          );
        } else {
          // This is a regular MenuItem
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
        }
      })}
    </div>
  );
};
