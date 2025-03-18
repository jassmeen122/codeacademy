
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/hooks/useAuthState";
import { toast } from "sonner";
import { Camera, Upload, Trash2, User } from "lucide-react";

interface ProfilePhotoUploadProps {
  user: UserProfile | null;
  onPhotoChange: (url: string) => void;
}

export const ProfilePhotoUpload = ({ user, onPhotoChange }: ProfilePhotoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatar_url || null);

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${user?.id}.${fileExt}`;

      // Check if the storage bucket exists
      const { data: bucketData, error: bucketError } = await supabase.storage.getBucket("avatars");
      
      if (bucketError && bucketError.message.includes("not found")) {
        // Create bucket if it doesn't exist
        const { error: createBucketError } = await supabase.storage.createBucket("avatars", {
          public: true
        });
        
        if (createBucketError) {
          throw createBucketError;
        }
      }

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Update user profile with avatar URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrlData.publicUrl })
        .eq("id", user?.id);

      if (updateError) {
        throw updateError;
      }

      setAvatarUrl(publicUrlData.publicUrl);
      onPhotoChange(publicUrlData.publicUrl);
      toast.success("Profile photo updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Error uploading profile photo");
      console.error("Error uploading avatar:", error);
    } finally {
      setUploading(false);
    }
  };

  const removeAvatar = async () => {
    try {
      setUploading(true);

      // Update user profile to remove avatar URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: null })
        .eq("id", user?.id);

      if (updateError) {
        throw updateError;
      }

      setAvatarUrl(null);
      onPhotoChange("");
      toast.success("Profile photo removed successfully!");
    } catch (error: any) {
      toast.error(error.message || "Error removing profile photo");
      console.error("Error removing avatar:", error);
    } finally {
      setUploading(false);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-32 w-32 border-2 border-primary">
        <AvatarImage src={avatarUrl || ""} alt={user?.full_name || "Profile"} />
        <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
          {getInitials(user?.full_name)}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col space-y-2">
        <Label htmlFor="avatar" className="cursor-pointer">
          <div className="flex items-center justify-center p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
            <Camera className="mr-2 h-4 w-4" />
            <span>{avatarUrl ? "Change Photo" : "Upload Photo"}</span>
          </div>
          <input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
            className="sr-only"
          />
        </Label>
        
        {avatarUrl && (
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={removeAvatar}
            disabled={uploading}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remove Photo
          </Button>
        )}
      </div>
    </div>
  );
};
