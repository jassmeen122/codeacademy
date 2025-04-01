
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthState } from '@/hooks/useAuthState';
import { Code, Image, Users, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CreatePostFormProps {
  onSubmit: (content: string, codeSnippet?: string, language?: string) => Promise<any>;
}

export function CreatePostForm({ onSubmit }: CreatePostFormProps) {
  const [content, setContent] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('javascript');
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
    if (!content.trim() && !codeSnippet.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(
        content, 
        showCodeEditor && codeSnippet ? codeSnippet : undefined,
        showCodeEditor && codeSnippet ? codeLanguage : undefined
      );
      setContent('');
      setCodeSnippet('');
      setShowCodeEditor(false);
    } finally {
      setIsSubmitting(false);
    }
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
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between px-4 pb-4">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setShowCodeEditor(!showCodeEditor)}
          >
            <Code className="h-4 w-4" />
            Code
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
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
          disabled={(!content.trim() && (!showCodeEditor || !codeSnippet.trim())) || isSubmitting}
        >
          Post
        </Button>
      </CardFooter>
    </Card>
  );
}
