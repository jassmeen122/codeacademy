
import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

interface StudentLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export const StudentLayout: React.FC<StudentLayoutProps> = ({ 
  children, 
  title, 
  description 
}) => {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        {(title || description) && (
          <div className="mb-8">
            {title && (
              <h1 className="text-4xl font-bold font-display mb-3 text-foreground">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-muted-foreground text-lg">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </DashboardLayout>
  );
};
