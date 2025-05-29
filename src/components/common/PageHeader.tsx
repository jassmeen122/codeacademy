
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  children 
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-display mb-3 flex items-center gap-3">
            {Icon && <Icon className="h-10 w-10 text-primary" />}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {title}
            </span>
          </h1>
          {description && (
            <p className="text-muted-foreground text-lg">
              {description}
            </p>
          )}
        </div>
        {children && (
          <div className="flex gap-2">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
