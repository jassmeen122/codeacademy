
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseResourceUpload } from "@/components/teacher/CourseResourceUpload";
import { CourseResourceItem } from "@/components/teacher/CourseResourceItem";
import { useCourseResources } from "@/hooks/useCourseResources";
import { File, Video, PresentationIcon } from "lucide-react";
import { CourseResource } from "@/types/course";

interface CourseResourceManagerProps {
  courseId: string;
}

export const CourseResourceManager = ({ courseId }: CourseResourceManagerProps) => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const { resources, loading, removeResource, fetchResources } = useCourseResources(courseId);

  const handleResourceAdded = (newResource: CourseResource) => {
    // Rafraîchir la liste après l'ajout
    fetchResources();
    
    // Changer l'onglet actif en fonction du type de ressource ajoutée
    switch (newResource.type) {
      case "pdf":
        setActiveTab("documents");
        break;
      case "video":
        setActiveTab("videos");
        break;
      case "presentation":
        setActiveTab("presentations");
        break;
      default:
        setActiveTab("all");
    }
  };

  const handleDelete = async (resourceId: string) => {
    await removeResource(resourceId);
  };

  const filteredResources = {
    all: resources,
    documents: resources.filter(r => r.type === "pdf"),
    videos: resources.filter(r => r.type === "video"),
    presentations: resources.filter(r => r.type === "presentation")
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Ressources du cours</CardTitle>
        <CardDescription>
          Ajoutez des documents, vidéos et présentations pour enrichir votre cours.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload" className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Ajouter une ressource</TabsTrigger>
            <TabsTrigger value="manage">Gérer les ressources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="p-4 border rounded-md mt-4">
            <CourseResourceUpload courseId={courseId} onResourceAdded={handleResourceAdded} />
          </TabsContent>
          
          <TabsContent value="manage" className="p-4 border rounded-md mt-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="documents" className="flex items-center gap-1">
                  <File className="h-4 w-4" />
                  Documents
                </TabsTrigger>
                <TabsTrigger value="videos" className="flex items-center gap-1">
                  <Video className="h-4 w-4" />
                  Vidéos
                </TabsTrigger>
                <TabsTrigger value="presentations" className="flex items-center gap-1">
                  <PresentationIcon className="h-4 w-4" />
                  Présentations
                </TabsTrigger>
              </TabsList>
              
              <div className="space-y-4">
                {loading ? (
                  <p>Chargement des ressources...</p>
                ) : filteredResources[activeTab as keyof typeof filteredResources].length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    Aucune ressource {activeTab !== "all" ? "de ce type" : ""} disponible
                  </p>
                ) : (
                  filteredResources[activeTab as keyof typeof filteredResources].map(resource => (
                    <CourseResourceItem 
                      key={resource.id} 
                      resource={resource} 
                      onDelete={handleDelete} 
                    />
                  ))
                )}
              </div>
            </Tabs>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
