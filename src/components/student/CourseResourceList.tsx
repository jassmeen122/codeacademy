
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { File, Video, PresentationIcon, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseResource } from "@/types/course";

interface CourseResourceListProps {
  resources: CourseResource[];
  isLoading?: boolean;
}

export const CourseResourceList = ({ resources, isLoading = false }: CourseResourceListProps) => {
  if (isLoading) {
    return <div className="py-4">Chargement des ressources...</div>;
  }

  if (resources.length === 0) {
    return (
      <div className="py-4 text-center text-muted-foreground">
        Aucune ressource disponible pour ce cours.
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <File className="h-6 w-6 text-red-500" />;
      case "video":
        return <Video className="h-6 w-6 text-blue-500" />;
      case "presentation":
        return <PresentationIcon className="h-6 w-6 text-green-500" />;
      default:
        return <File className="h-6 w-6" />;
    }
  };

  const getResourceTypeLabel = (type: string) => {
    switch (type) {
      case "pdf":
        return "Document PDF";
      case "video":
        return "Vidéo";
      case "presentation":
        return "Présentation";
      default:
        return "Fichier";
    }
  };

  return (
    <div className="space-y-4">
      {resources.map((resource) => (
        <Card key={resource.id}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {getIcon(resource.type)}
                <div>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  <CardDescription className="text-xs">
                    {getResourceTypeLabel(resource.type)}
                  </CardDescription>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => window.open(resource.file_url, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
                Ouvrir
              </Button>
            </div>
          </CardHeader>
          {resource.description && (
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">{resource.description}</p>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};
