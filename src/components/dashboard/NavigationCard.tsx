
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface NavigationCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonText: string;
  onClick?: () => void;
  className?: string;
  isNew?: boolean;
}

export const NavigationCard = ({
  icon: Icon,
  title,
  description,
  buttonText,
  onClick,
  className,
  isNew,
}: NavigationCardProps) => {
  return (
    <div 
      className={cn(
        "border rounded-lg p-5 hover:shadow-md transition-all duration-200", 
        className
      )}
    >
      <div className="flex flex-col h-full">
        <div className="mb-4 flex justify-between items-start">
          <Icon className="h-7 w-7 text-primary" />
          {isNew && (
            <Badge variant="default" className="bg-green-500 text-white">Nouveau</Badge>
          )}
        </div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4 flex-grow">{description}</p>
        <Button 
          onClick={onClick} 
          className="w-full mt-auto"
          variant="secondary"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};
