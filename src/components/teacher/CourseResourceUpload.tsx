
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileUp, Loader2, Youtube } from "lucide-react";
import { CourseResource, CourseResourceType } from "@/types/course";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CourseResourceUploadProps {
  courseId: string;
  onResourceAdded: (resource: CourseResource) => void;
}

export const CourseResourceUpload = ({ courseId, onResourceAdded }: CourseResourceUploadProps) => {
  const [uploadTab, setUploadTab] = useState<"file" | "youtube">("file");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<CourseResourceType>("pdf");
  const [file, setFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const validateFileType = (file: File, type: CourseResourceType): boolean => {
    if (type === "pdf" && !file.type.includes("pdf")) {
      toast.error("Le fichier doit être au format PDF");
      return false;
    } else if (type === "video" && !file.type.includes("video")) {
      toast.error("Le fichier doit être au format vidéo");
      return false;
    } else if (type === "presentation" && !["application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/pdf"].includes(file.type)) {
      toast.error("Le fichier doit être au format PowerPoint ou PDF");
      return false;
    }
    return true;
  };

  const validateYoutubeUrl = (url: string): boolean => {
    // Simple validation for YouTube URL
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+/;
    if (!youtubeRegex.test(url)) {
      toast.error("Veuillez entrer une URL YouTube valide");
      return false;
    }
    return true;
  };

  const handleSubmitFile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error("Veuillez sélectionner un fichier");
      return;
    }
    
    if (!title.trim()) {
      toast.error("Veuillez ajouter un titre");
      return;
    }
    
    if (!validateFileType(file, type)) {
      return;
    }
    
    try {
      setUploading(true);
      
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `courses/${courseId}/${type}/${fileName}`;
      
      const { error: uploadError, data: storageData } = await supabase.storage
        .from('course_materials')
        .upload(filePath, file, { upsert: true });
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('course_materials')
        .getPublicUrl(filePath);
      
      // Insert resource record in database
      const { data: resourceData, error: resourceError } = await supabase
        .from('course_resources')
        .insert({
          title,
          description: description || null,
          file_url: publicUrlData.publicUrl,
          type,
          course_id: courseId,
          order_index: 1 // Default order
        })
        .select()
        .single();
      
      if (resourceError) throw resourceError;
      
      // Reset form
      setTitle("");
      setDescription("");
      setFile(null);
      
      toast.success("Ressource ajoutée avec succès!");
      
      if (resourceData) {
        onResourceAdded(resourceData as CourseResource);
      }
    } catch (error: any) {
      toast.error(`Erreur lors de l'ajout de la ressource: ${error.message}`);
      console.error("Error uploading resource:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitYoutube = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!youtubeUrl.trim()) {
      toast.error("Veuillez entrer une URL YouTube");
      return;
    }
    
    if (!title.trim()) {
      toast.error("Veuillez ajouter un titre");
      return;
    }
    
    if (!validateYoutubeUrl(youtubeUrl)) {
      return;
    }
    
    try {
      setUploading(true);
      
      // Insert YouTube resource record in database
      const { data: resourceData, error: resourceError } = await supabase
        .from('course_resources')
        .insert({
          title,
          description: description || null,
          file_url: youtubeUrl,
          type: "youtube", // Type spécial pour YouTube
          course_id: courseId,
          order_index: 1 // Default order
        })
        .select()
        .single();
      
      if (resourceError) throw resourceError;
      
      // Reset form
      setTitle("");
      setDescription("");
      setYoutubeUrl("");
      
      toast.success("Vidéo YouTube ajoutée avec succès!");
      
      if (resourceData) {
        onResourceAdded(resourceData as CourseResource);
      }
    } catch (error: any) {
      toast.error(`Erreur lors de l'ajout de la vidéo YouTube: ${error.message}`);
      console.error("Error adding YouTube resource:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Tabs value={uploadTab} onValueChange={(value) => setUploadTab(value as "file" | "youtube")}>
        <TabsList className="w-full grid grid-cols-2 mb-6">
          <TabsTrigger value="file" className="flex items-center gap-1">
            <FileUp className="h-4 w-4" />
            Fichier
          </TabsTrigger>
          <TabsTrigger value="youtube" className="flex items-center gap-1">
            <Youtube className="h-4 w-4" />
            Vidéo YouTube
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="file">
          <form onSubmit={handleSubmitFile} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="resource-title">Titre de la ressource</Label>
              <Input
                id="resource-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Entrez un titre descriptif"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="resource-description">Description (optionnelle)</Label>
              <Textarea
                id="resource-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brève description de cette ressource"
                className="h-20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="resource-type">Type de ressource</Label>
              <Select
                value={type}
                onValueChange={(value) => setType(value as CourseResourceType)}
              >
                <SelectTrigger id="resource-type">
                  <SelectValue placeholder="Sélectionnez un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">Document PDF</SelectItem>
                  <SelectItem value="video">Vidéo</SelectItem>
                  <SelectItem value="presentation">Présentation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="resource-file">Fichier</Label>
              <Input
                id="resource-file"
                type="file"
                onChange={handleFileChange}
                accept={type === "pdf" ? ".pdf" : 
                      type === "video" ? "video/*" : 
                      ".pdf,.ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"}
                className="cursor-pointer"
              />
              {file && (
                <p className="text-sm text-muted-foreground">
                  Fichier sélectionné: {file.name} ({Math.round(file.size / 1024)} KB)
                </p>
              )}
            </div>
            
            <Button type="submit" disabled={uploading} className="w-full">
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ajout en cours...
                </>
              ) : (
                <>
                  <FileUp className="mr-2 h-4 w-4" />
                  Ajouter la ressource
                </>
              )}
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="youtube">
          <form onSubmit={handleSubmitYoutube} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="youtube-title">Titre de la vidéo</Label>
              <Input
                id="youtube-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Entrez un titre descriptif"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="youtube-description">Description (optionnelle)</Label>
              <Textarea
                id="youtube-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brève description de cette vidéo"
                className="h-20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="youtube-url">URL YouTube</Label>
              <Input
                id="youtube-url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                required
              />
            </div>
            
            <Button type="submit" disabled={uploading} className="w-full">
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ajout en cours...
                </>
              ) : (
                <>
                  <Youtube className="mr-2 h-4 w-4" />
                  Ajouter la vidéo YouTube
                </>
              )}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};
