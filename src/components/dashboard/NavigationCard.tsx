
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface NavigationCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonText: string;
  buttonVariant?: "default" | "outline";
  onClick?: () => void;
  children?: React.ReactNode;
}

export const NavigationCard = ({
  icon: Icon,
  title,
  description,
  buttonText,
  buttonVariant = "outline",
  onClick,
  children
}: NavigationCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        {children || (
          <Button 
            className="w-full" 
            variant={buttonVariant}
            onClick={onClick}
          >
            {buttonText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
