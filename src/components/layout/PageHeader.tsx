
import React from 'react';

interface PageHeaderProps {
  heading: string;
  subheading?: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  heading, 
  subheading, 
  children 
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{heading}</h1>
        {subheading && (
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            {subheading}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center space-x-2 mt-2 md:mt-0">
          {children}
        </div>
      )}
    </div>
  );
};
