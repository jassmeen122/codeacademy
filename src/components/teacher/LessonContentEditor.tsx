
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Code, FileText, Video, Image as ImageIcon, Upload, Link, Save } from "lucide-react";
import { toast } from "sonner";

interface LessonContentEditorProps {
  lessonId: string;
  content: string;
  onContentChange: (content: string) => void;
  onSave: () => void;
  isSaving?: boolean;
}

export const LessonContentEditor = ({ 
  lessonId, 
  content, 
  onContentChange, 
  onSave,
  isSaving = false 
}: LessonContentEditorProps) => {
  const [activeTab, setActiveTab] = useState<string>("edit");
  const [mediaType, setMediaType] = useState<string>("none");
  const [mediaUrl, setMediaUrl] = useState<string>("");

  const handleInsertMedia = () => {
    if (!mediaUrl.trim()) {
      toast.error("Please enter a valid URL");
      return;
    }

    let mediaHtml = '';
    
    switch (mediaType) {
      case 'image':
        mediaHtml = `\n<img src="${mediaUrl}" alt="Lesson image" class="my-4 rounded-md max-w-full" />\n`;
        break;
      case 'video':
        mediaHtml = `\n<video src="${mediaUrl}" controls class="my-4 rounded-md max-w-full"></video>\n`;
        break;
      case 'youtube':
        // Extract video ID if it's a full YouTube URL
        const videoId = mediaUrl.includes('youtube.com/watch?v=') 
          ? mediaUrl.split('v=')[1].split('&')[0]
          : mediaUrl.includes('youtu.be/') 
            ? mediaUrl.split('youtu.be/')[1].split('?')[0]
            : mediaUrl;
            
        mediaHtml = `\n<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="my-4 rounded-md max-w-full"></iframe>\n`;
        break;
      case 'link':
        mediaHtml = `\n<a href="${mediaUrl}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">${mediaUrl}</a>\n`;
        break;
      default:
        return;
    }
    
    onContentChange(content + mediaHtml);
    setMediaUrl("");
    toast.success(`${mediaType} added successfully!`);
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Lesson Content</CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="edit" className="space-y-4">
            <Textarea
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              placeholder="Enter lesson content here. You can use Markdown for formatting or insert HTML."
              className="min-h-[300px] font-mono text-sm"
            />
            
            <div className="border rounded-lg p-4 bg-muted/20">
              <Label className="font-medium mb-2 block">Insert Media</Label>
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={mediaType} onValueChange={setMediaType}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Select media type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select type...</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="link">Link</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder={mediaType === 'youtube' ? 'YouTube URL or video ID' : 'Enter URL'}
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    disabled={mediaType === 'none'}
                    className="flex-1"
                  />
                  
                  <Button 
                    type="button" 
                    onClick={handleInsertMedia}
                    disabled={mediaType === 'none' || !mediaUrl.trim()}
                    size="icon"
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={onSave} 
                disabled={isSaving}
                className="w-full sm:w-auto"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Lesson Content'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="preview">
            <div className="border rounded-lg p-6 min-h-[300px] bg-white">
              {content ? (
                <div className="prose max-w-none prose-sm sm:prose-base prose-stone" dangerouslySetInnerHTML={{ __html: content }} />
              ) : (
                <div className="text-muted-foreground text-center py-10">
                  <FileText className="h-10 w-10 mx-auto mb-4 opacity-20" />
                  <p>No content yet. Start writing in the Edit tab.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
