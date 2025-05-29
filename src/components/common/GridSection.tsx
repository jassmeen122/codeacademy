
import React from 'react';

interface GridSectionProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const GridSection: React.FC<GridSectionProps> = ({ 
  children, 
  columns = 2, 
  gap = 'md',
  className = '' 
}) => {
  const gridClass = `grid gap-${gap === 'sm' ? '4' : gap === 'lg' ? '8' : '6'} grid-cols-1 ${
    columns >= 2 ? 'md:grid-cols-2' : ''
  } ${
    columns >= 3 ? 'lg:grid-cols-3' : ''
  } ${
    columns >= 4 ? 'xl:grid-cols-4' : ''
  }`;

  return (
    <div className={`${gridClass} ${className}`}>
      {children}
    </div>
  );
};
