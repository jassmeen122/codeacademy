
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
  Save,
  Eye,
  FileText
} from "lucide-react";
import { toast } from "sonner";

interface ContentEditorProps {
  onSave: (content: any) => void;
  initialContent?: any;
  contentType: 'course' | 'exercise';
  courseId?: string;
}

export const UniversalContentEditor = ({ 
  onSave, 
  initialContent, 
  contentType,
  courseId 
}: ContentEditorProps) => {
  const [title, setTitle] = useState(initialContent?.title || '');
  const [content, setContent] = useState(initialContent?.content || '');
  const [description, setDescription] = useState(initialContent?.description || '');
  const [activeTab, setActiveTab] = useState('editor');
  const [selectedContentType, setSelectedContentType] = useState(
    initialContent?.content_type || 'chapter'
  );
  const [exerciseType, setExerciseType] = useState(
    initialContent?.exercise_type || 'coding'
  );
  const [difficulty, setDifficulty] = useState(
    initialContent?.difficulty || 'beginner'
  );
  const [language, setLanguage] = useState(initialContent?.language || 'javascript');
  const [starterCode, setStarterCode] = useState(initialContent?.starter_code || '');
  const [expectedOutput, setExpectedOutput] = useState(initialContent?.expected_output || '');
  const [hints, setHints] = useState(
    initialContent?.hints ? initialContent.hints.join('\n') : ''
  );
  
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
        newText = `\`\`\`${language}\n${selectedText}\n\`\`\``;
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

    let saveData;

    if (contentType === 'course') {
      saveData = {
        title: title.trim(),
        content,
        content_type: selectedContentType,
        course_id: courseId,
        is_published: false
      };
    } else {
      saveData = {
        title: title.trim(),
        description: description.trim(),
        content,
        exercise_type: exerciseType,
        difficulty,
        language,
        starter_code: starterCode,
        expected_output: expectedOutput,
        hints: hints.split('\n').filter(hint => hint.trim()),
        is_published: false
      };
    }

    onSave(saveData);
    toast.success('Contenu sauvegardé !');
  };

  const renderPreview = () => {
    return (
      <div className="prose max-w-none">
        <h1 className="text-3xl font-bold mb-6">{title}</h1>
        {contentType === 'exercise' && description && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800">Description:</h3>
            <p className="text-blue-700">{description}</p>
          </div>
        )}
        <div dangerouslySetInnerHTML={{ 
          __html: content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-4 rounded"><code>$1</code></pre>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-500 underline">$1</a>')
            .replace(/^- (.*)$/gm, '<li>$1</li>')
            .replace(/^1\. (.*)$/gm, '<ol><li>$1</li></ol>')
            .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />')
            .replace(/\n/g, '<br>')
        }} />
        
        {contentType === 'exercise' && starterCode && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Code de départ:</h3>
            <pre className="bg-gray-100 p-4 rounded"><code>{starterCode}</code></pre>
          </div>
        )}
        
        {contentType === 'exercise' && expectedOutput && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Résultat attendu:</h3>
            <pre className="bg-green-50 p-4 rounded border border-green-200"><code>{expectedOutput}</code></pre>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {contentType === 'course' ? 'Éditeur de Contenu de Cours' : 'Éditeur d\'Exercice'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre du contenu"
              className="text-lg font-semibold"
            />
          </div>

          {contentType === 'course' && (
            <div>
              <Label htmlFor="content-type">Type de contenu</Label>
              <Select value={selectedContentType} onValueChange={setSelectedContentType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chapter">Chapitre</SelectItem>
                  <SelectItem value="module">Module</SelectItem>
                  <SelectItem value="summary">Résumé</SelectItem>
                  <SelectItem value="lesson">Leçon</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {contentType === 'exercise' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="exercise-type">Type d'exercice</Label>
                <Select value={exerciseType} onValueChange={setExerciseType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coding">Programmation</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="assignment">Devoir</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="difficulty">Difficulté</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Débutant</SelectItem>
                    <SelectItem value="intermediate">Intermédiaire</SelectItem>
                    <SelectItem value="advanced">Avancé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="language">Langage</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="css">CSS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {contentType === 'exercise' && (
            <div>
              <Label htmlFor="description">Description de l'exercice</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez ce que l'étudiant doit faire..."
                className="min-h-[100px]"
              />
            </div>
          )}

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
                placeholder="Commencez à écrire votre contenu ici..."
                className="min-h-[400px] font-mono"
              />

              {contentType === 'exercise' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="starter-code">Code de départ (optionnel)</Label>
                    <Textarea
                      id="starter-code"
                      value={starterCode}
                      onChange={(e) => setStarterCode(e.target.value)}
                      placeholder="// Code de départ pour l'étudiant"
                      className="min-h-[150px] font-mono"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="expected-output">Résultat attendu (optionnel)</Label>
                    <Textarea
                      id="expected-output"
                      value={expectedOutput}
                      onChange={(e) => setExpectedOutput(e.target.value)}
                      placeholder="Résultat attendu de l'exercice"
                      className="min-h-[150px] font-mono"
                    />
                  </div>
                </div>
              )}

              {contentType === 'exercise' && (
                <div>
                  <Label htmlFor="hints">Indices (un par ligne)</Label>
                  <Textarea
                    id="hints"
                    value={hints}
                    onChange={(e) => setHints(e.target.value)}
                    placeholder="Indice 1&#10;Indice 2&#10;Indice 3"
                    className="min-h-[100px]"
                  />
                </div>
              )}
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
