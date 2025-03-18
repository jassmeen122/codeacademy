
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { File, Video, PresentationIcon, ExternalLink, Youtube } from "lucide-react";
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
      case "youtube":
        return <Youtube className="h-6 w-6 text-red-600" />;
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
      case "youtube":
        return "Vidéo YouTube";
      case "presentation":
        return "Présentation";
      default:
        return "Fichier";
    }
  };

  const handleOpenResource = (resource: CourseResource) => {
    window.open(resource.file_url, '_blank');
  };

  return (
    <div className="space-y-4">
      {resources.map((resource) => (
        <Card key={resource.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between p-4">
            <div className="flex items-center gap-3">
              {getIcon(resource.type)}
              <div>
                <h3 className="text-lg font-semibold">{resource.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {getResourceTypeLabel(resource.type)}
                </p>
                {resource.description && (
                  <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                )}
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => handleOpenResource(resource)}
            >
              <ExternalLink className="h-4 w-4" />
              {resource.type === "youtube" ? "Regarder" : "Ouvrir"}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
