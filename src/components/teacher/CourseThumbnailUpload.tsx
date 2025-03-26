
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Image as ImageIcon, X, Loader2 } from "lucide-react";

interface CourseThumbnailUploadProps {
  courseId: string;
  currentThumbnail: string | null;
  onThumbnailChange: (url: string) => void;
}

export const CourseThumbnailUpload = ({
  courseId,
  currentThumbnail,
  onThumbnailChange
}: CourseThumbnailUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentThumbnail);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    
    // Validate file type
    if (!file.type.includes('image')) {
      toast.error("Please select an image file");
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Create a local preview
      const localPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(localPreviewUrl);
      
      // Generate a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${courseId}_thumbnail_${Date.now()}.${fileExt}`;
      const filePath = `course_thumbnails/${fileName}`;
      
      // Upload to Supabase Storage
      const { error: uploadError, data: storageData } = await supabase.storage
        .from('course_assets')
        .upload(filePath, file, { upsert: true });
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('course_assets')
        .getPublicUrl(filePath);
      
      // Call the callback with the new URL
      onThumbnailChange(publicUrlData.publicUrl);
      
      toast.success("Thumbnail uploaded successfully");
    } catch (err: any) {
      console.error("Error uploading thumbnail:", err);
      toast.error("Failed to upload thumbnail");
      // Revert to previous thumbnail if upload fails
      setPreviewUrl(currentThumbnail);
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleRemoveThumbnail = () => {
    setPreviewUrl(null);
    onThumbnailChange('');
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <Label className="text-base font-medium block mb-2">Course Thumbnail</Label>
        
        <div className="space-y-4">
          {previewUrl ? (
            <div className="relative rounded-md overflow-hidden aspect-video bg-muted">
              <img 
                src={previewUrl} 
                alt="Course thumbnail" 
                className="w-full h-full object-cover"
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                onClick={handleRemoveThumbnail}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-muted-foreground/20 rounded-md p-6 text-center flex flex-col items-center justify-center aspect-video bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
              <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground font-medium mb-1">Upload course thumbnail</p>
              <p className="text-xs text-muted-foreground mb-4">Recommended size: 1280×720 pixels (16:9 ratio)</p>
              <Label htmlFor="thumbnail-upload" className="cursor-pointer">
                <Button 
                  variant="outline" 
                  disabled={isUploading}
                  className="relative"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Select Image
                    </>
                  )}
                  <input
                    id="thumbnail-upload"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                </Button>
              </Label>
            </div>
          )}
          
          <p className="text-xs text-muted-foreground">
            Upload a high-quality image to make your course stand out. 
            A good thumbnail grabs attention and conveys the subject matter clearly.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
