
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface ActionCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  icon: Icon,
  onClick,
  className = '',
  children
}) => {
  return (
    <Card 
      className={`professional-card cursor-pointer hover:border-primary/50 transition-all duration-300 ${className}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-lg">
          <Icon className="h-6 w-6 text-primary" />
          <span className="font-display font-semibold text-foreground">{title}</span>
        </CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      {children && (
        <CardContent>
          {children}
        </CardContent>
      )}
    </Card>
  );
};
