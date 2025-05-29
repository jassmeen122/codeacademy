
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  Image, 
  Video, 
  Code, 
  FileText,
  Save,
  Eye
} from "lucide-react";
import { toast } from "sonner";

interface RichTextEditorProps {
  onSave: (content: any) => void;
  initialContent?: any;
  courseId: string;
}

export const RichTextEditor = ({ onSave, initialContent, courseId }: RichTextEditorProps) => {
  const [title, setTitle] = useState(initialContent?.title || '');
  const [content, setContent] = useState(initialContent?.content || '');
  const [activeTab, setActiveTab] = useState('editor');
  const [selectedFormat, setSelectedFormat] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyFormat = (format: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    let newText = '';

    switch (format) {
      case 'bold':
        newText = `**${selectedText}**`;
        break;
      case 'italic':
        newText = `*${selectedText}*`;
        break;
      case 'underline':
        newText = `<u>${selectedText}</u>`;
        break;
      case 'list':
        newText = `\n- ${selectedText}`;
        break;
      case 'ordered-list':
        newText = `\n1. ${selectedText}`;
        break;
      case 'code':
        newText = `\`\`\`\n${selectedText}\n\`\`\``;
        break;
      case 'link':
        const url = prompt('Entrez l\'URL:');
        if (url) newText = `[${selectedText || 'lien'}](${url})`;
        break;
      default:
        return;
    }

    const newContent = content.substring(0, start) + newText + content.substring(end);
    setContent(newContent);
  };

  const insertMedia = (type: string) => {
    const url = prompt(`Entrez l'URL ${type === 'image' ? 'de l\'image' : 'de la vidéo'}:`);
    if (!url) return;

    let mediaText = '';
    if (type === 'image') {
      mediaText = `\n![Image](${url})\n`;
    } else if (type === 'video') {
      mediaText = `\n<video src="${url}" controls width="100%"></video>\n`;
    }

    setContent(prev => prev + mediaText);
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast.error('Le titre est requis');
      return;
    }

    const chapterData = {
      title: title.trim(),
      content,
      courseId,
      created_at: new Date().toISOString(),
      published: false
    };

    onSave(chapterData);
    toast.success('Chapitre sauvegardé');
  };

  const renderPreview = () => {
    return (
      <div className="prose max-w-none">
        <h1 className="text-3xl font-bold mb-6">{title}</h1>
        <div dangerouslySetInnerHTML={{ 
          __html: content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-4 rounded"><code>$1</code></pre>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-500 underline">$1</a>')
            .replace(/^- (.*)$/gm, '<li>$1</li>')
            .replace(/^1\. (.*)$/gm, '<ol><li>$1</li></ol>')
            .replace(/\n/g, '<br>')
        }} />
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Éditeur de Contenu de Cours</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="chapter-title">Titre du Chapitre</Label>
            <Input
              id="chapter-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Chapitre 1 – Les Bases de Python"
              className="text-lg font-semibold"
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="editor">Éditeur</TabsTrigger>
              <TabsTrigger value="preview">Aperçu</TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="space-y-4">
              {/* Toolbar */}
              <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-gray-50">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => applyFormat('bold')}
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => applyFormat('italic')}
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => applyFormat('underline')}
                >
                  <Underline className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => applyFormat('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => applyFormat('ordered-list')}
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => applyFormat('link')}
                >
                  <Link className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => insertMedia('image')}
                >
                  <Image className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => insertMedia('video')}
                >
                  <Video className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => applyFormat('code')}
                >
                  <Code className="h-4 w-4" />
                </Button>
              </div>

              <Textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Commencez à écrire votre chapitre ici..."
                className="min-h-[400px] font-mono"
              />
            </TabsContent>

            <TabsContent value="preview">
              <div className="min-h-[400px] p-6 border rounded-lg bg-white">
                {title || content ? renderPreview() : (
                  <p className="text-gray-500 text-center">Aucun contenu à prévisualiser</p>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setActiveTab('preview')}
            >
              <Eye className="h-4 w-4 mr-2" />
              Aperçu
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
