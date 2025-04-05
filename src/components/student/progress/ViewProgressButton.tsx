
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { ChartLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ViewProgressButtonProps extends ButtonProps {
  courseId?: string;
  exerciseId?: string;
  moduleId?: string;
  skillName?: string;
}

export const ViewProgressButton: React.FC<ViewProgressButtonProps> = ({
  courseId,
  exerciseId,
  moduleId,
  skillName,
  className,
  children,
  ...props
}) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    // Construct the URL with appropriate query parameters
    let url = '/student/progress';
    
    if (courseId) {
      url += `?course=${courseId}`;
    } else if (exerciseId) {
      url += `?exercise=${exerciseId}`;
    } else if (moduleId) {
      url += `?module=${moduleId}`;
    } else if (skillName) {
      url += `?skill=${encodeURIComponent(skillName)}`;
    }
    
    navigate(url);
  };
  
  return (
    <Button 
      onClick={handleClick}
      variant="outline"
      className={`flex items-center gap-2 ${className}`}
      {...props}
    >
      <ChartLine className="h-4 w-4" />
      {children || 'View Progress'}
    </Button>
  );
};
