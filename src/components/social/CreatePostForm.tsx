
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthState } from '@/hooks/useAuthState';
import { Code, Image, Users, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface CreatePostFormProps {
  onSubmit: (content: string, codeSnippet?: string, language?: string, imageUrl?: string) => Promise<any>;
}

export function CreatePostForm({ onSubmit }: CreatePostFormProps) {
  const [content, setContent] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user } = useAuthState();
  
  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">You need to sign in to create posts</p>
        </CardContent>
      </Card>
    );
  }
  
  const handleSubmit = async () => {
    if (!content.trim() && !codeSnippet.trim() && !selectedImage) return;
    
    setIsSubmitting(true);
    try {
      let imageUrl: string | undefined = undefined;
      
      // Upload image if selected
      if (selectedImage) {
        const fileExt = selectedImage.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        
        console.log("Uploading to:", filePath);
        
        const { error: uploadError, data } = await supabase.storage
          .from('post_images')
          .upload(filePath, selectedImage, {
            cacheControl: '3600',
            upsert: false
          });
          
        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw uploadError;
        }
        
        console.log("Upload successful:", data);
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('post_images')
          .getPublicUrl(filePath);
          
        console.log("Public URL:", publicUrl);
        imageUrl = publicUrl;
      }
      
      await onSubmit(
        content, 
        showCodeEditor && codeSnippet ? codeSnippet : undefined,
        showCodeEditor && codeSnippet ? codeLanguage : undefined,
        imageUrl
      );
      
      setContent('');
      setCodeSnippet('');
      setShowCodeEditor(false);
      setSelectedImage(null);
      setImagePreview(null);
      setShowImageUpload(false);
      setUploadProgress(0);
      
      toast.success('Post created successfully!');
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast.error(`Error creating post: ${error.message || 'Please try again'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedImage(null);
      setImagePreview(null);
      return;
    }
    
    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image size should be less than 5MB');
      return;
    }
    
    setSelectedImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImagePreview(e.target?.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'cpp', label: 'C++' },
    { value: 'php', label: 'PHP' },
    { value: 'swift', label: 'Swift' },
    { value: 'go', label: 'Go' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'sql', label: 'SQL' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' }
  ];

  return (
    <Card className="mb-6">
      <CardContent className="p-4 pt-6">
        <div className="flex space-x-3">
          <Avatar>
            <AvatarImage src={user.avatar_url || ''} alt={user.full_name || 'User'} />
            <AvatarFallback>{(user.full_name || 'U').charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder={`What's on your mind, ${user.full_name?.split(' ')[0] || 'there'}?`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] border-none focus-visible:ring-0 resize-none"
            />
            
            {showCodeEditor && (
              <div className="mt-4 border rounded-md overflow-hidden">
                <div className="bg-gray-100 dark:bg-gray-800 p-2 flex justify-between items-center">
                  <select
                    value={codeLanguage}
                    onChange={(e) => setCodeLanguage(e.target.value)}
                    className="text-sm bg-transparent border-0 focus:ring-0"
                  >
                    {languageOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setShowCodeEditor(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea
                  placeholder="// Paste your code here"
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  className="min-h-[150px] font-mono border-none rounded-none focus-visible:ring-0"
                />
              </div>
            )}
            
            {showImageUpload && (
              <div className="mt-4 border rounded-md overflow-hidden p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium">Add an image</h3>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setShowImageUpload(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {!imagePreview ? (
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6">
                    <Image className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-2">Click to upload an image (max 5MB)</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="w-full cursor-pointer"
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-h-64 max-w-full mx-auto rounded-md"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 rounded-full h-8 w-8"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between px-4 pb-4">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => {
              setShowCodeEditor(!showCodeEditor);
              if (showImageUpload) setShowImageUpload(false);
            }}
          >
            <Code className="h-4 w-4" />
            Code
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => {
              setShowImageUpload(!showImageUpload);
              if (showCodeEditor) setShowCodeEditor(false);
            }}
          >
            <Image className="h-4 w-4" />
            Photo
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Users className="h-4 w-4" />
            Tag
          </Button>
        </div>
        
        <Button 
          onClick={handleSubmit} 
          disabled={(
            !content.trim() && 
            (!showCodeEditor || !codeSnippet.trim()) && 
            !selectedImage
          ) || isSubmitting}
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </Button>
      </CardFooter>
    </Card>
  );
}
