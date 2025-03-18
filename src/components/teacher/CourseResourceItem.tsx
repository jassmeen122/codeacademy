
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { File, Video, PresentationIcon, Trash2, ExternalLink, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CourseResource } from "@/types/course";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CourseResourceItemProps {
  resource: CourseResource;
  onDelete: (id: string) => Promise<void>;
}

export const CourseResourceItem = ({ resource, onDelete }: CourseResourceItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      // Si c'est une ressource stockée (pas YouTube), on supprime le fichier
      if (resource.type !== "youtube") {
        // Extraire le chemin du fichier à partir de l'URL
        const filePathMatch = resource.file_url.match(/course_materials\/([^?]+)/);
        if (filePathMatch && filePathMatch[1]) {
          // Supprimer le fichier du stockage
          await supabase.storage
            .from('course_materials')
            .remove([filePathMatch[1]]);
        }
      }
      
      // Supprimer l'enregistrement de la base de données
      await onDelete(resource.id);
      
      toast.success("Ressource supprimée avec succès");
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast.error("Erreur lors de la suppression de la ressource");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenResource = () => {
    window.open(resource.file_url, '_blank');
  };

  return (
    <Card>
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
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={handleOpenResource}
            >
              <ExternalLink className="h-4 w-4" />
              {resource.type === "youtube" ? "Regarder" : "Ouvrir"}
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="flex items-center gap-1">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer cette ressource ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. {resource.type !== "youtube" ? "Le fichier et ses métadonnées seront supprimés définitivement." : "Le lien vers cette vidéo sera supprimé."}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete();
                    }}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? "Suppression..." : "Supprimer"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      {resource.description && (
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground">{resource.description}</p>
        </CardContent>
      )}
    </Card>
  );
};
