
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavigationCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonText: string;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "developer" | "tutorial" | "project";
}

export const NavigationCard = ({
  icon: Icon,
  title,
  description,
  buttonText,
  onClick,
  className,
  variant = "default",
}: NavigationCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "developer":
        return "border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10";
      case "tutorial":
        return "border-green-500/30 bg-green-500/5 hover:bg-green-500/10";
      case "project":
        return "border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10";
      default:
        return "border-border hover:bg-accent/50";
    }
  };

  const getIconStyles = () => {
    switch (variant) {
      case "developer":
        return "text-blue-500";
      case "tutorial":
        return "text-green-500";
      case "project":
        return "text-purple-500";
      default:
        return "text-primary";
    }
  };

  const getButtonVariant = () => {
    switch (variant) {
      case "developer":
        return "text-blue-500 border-blue-500 hover:bg-blue-500/20";
      case "tutorial":
        return "text-green-500 border-green-500 hover:bg-green-500/20";
      case "project":
        return "text-purple-500 border-purple-500 hover:bg-purple-500/20";
      default:
        return "secondary";
    }
  };

  return (
    <div 
      className={cn(
        "border rounded-lg p-5 transition-all duration-200",
        getVariantStyles(),
        className
      )}
    >
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <Icon className={cn("h-7 w-7", getIconStyles())} />
        </div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4 flex-grow">{description}</p>
        <Button 
          onClick={onClick} 
          className="w-full mt-auto"
          variant={variant === "default" ? "secondary" : "outline"}
          style={variant !== "default" ? {
            borderColor: `var(--${getButtonVariant().split("-")[1]}-500)`,
            color: `var(--${getButtonVariant().split("-")[1]}-500)`
          } : {}}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};
