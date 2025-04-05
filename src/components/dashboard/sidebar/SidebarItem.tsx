
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface SidebarItemProps {
  title: string;
  href: string;
  icon: ReactNode;
  isActive: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  title,
  href,
  icon,
  isActive,
}) => {
  return (
    <Link to={href}>
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start gap-2 font-mono",
          isActive
            ? "bg-gray-800 text-primary border-l-2 border-primary font-medium"
            : "hover:bg-gray-800 text-gray-400 hover:text-gray-200"
        )}
        title={title}
      >
        {icon}
        {title}
      </Button>
    </Link>
  );
};
