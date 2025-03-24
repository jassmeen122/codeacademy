
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useLanguageSummary } from '@/hooks/useLanguageSummary';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, BookOpen, CheckCircle, Code } from "lucide-react";
import { useAuthState } from '@/hooks/useAuthState';
import { CodeBlock } from '@/components/ai-assistant/CodeBlock';
import { toast } from 'sonner';

const LanguageSummaryPage = () => {
  const { languageId } = useParams<{ languageId: string }>();
  const navigate = useNavigate();
  const { summary, userProgress, loading, error, markAsRead } = useLanguageSummary(languageId ?? null);
  const { user } = useAuthState();

  useEffect(() => {
    if (error) {
      toast.error("Erreur lors du chargement du résumé");
      console.error("Error loading summary:", error);
    }
  }, [error]);

  const handleMarkAsRead = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    const success = await markAsRead();
    if (success) {
      // We don't need to navigate away as the state will update
      toast.success("Résumé marqué comme lu !");
    }
  };

  // Function to detect language from code
  const detectLanguage = (codeBlock: string): string => {
    if (codeBlock.includes('System.out.println')) return 'java';
    if (codeBlock.includes('function') || codeBlock.includes('let ') || codeBlock.includes('const ') || codeBlock.includes('console.log')) return 'javascript';
    if (codeBlock.includes('print(') || codeBlock.includes('def ')) return 'python';
    if (codeBlock.includes('#include <stdio.h>') || (codeBlock.includes('printf') && codeBlock.includes('int main'))) return 'c';
    if (codeBlock.includes('using namespace std') || codeBlock.includes('cout <<') || (codeBlock.includes('#include <iostream>') && codeBlock.includes('int main'))) return 'cpp';
    if (codeBlock.includes('<?php') || codeBlock.includes('echo ') || codeBlock.includes('$')) return 'php';
    if (codeBlock.includes('SELECT ') || codeBlock.includes('CREATE TABLE') || codeBlock.includes('INSERT INTO')) return 'sql';
    return 'plaintext';
  };

  // Function to render the content with proper formatting
  const renderSummaryContent = (content: string) => {
    // Split by double line breaks to identify paragraphs
    const paragraphs = content.split('\n\n');
    
    return paragraphs.map((paragraph, index) => {
      // Check if this is a heading (starts with a number followed by a dot)
      if (/^\d+\.\s/.test(paragraph)) {
        return (
          <h2 key={index} className="text-2xl font-bold mt-8 mb-4">
            {paragraph}
          </h2>
        );
      }
      
      // Check if this is a sub-heading or explanation
      if (paragraph.startsWith('🔹') || paragraph.startsWith('💡') || paragraph.startsWith('📌')) {
        return (
          <div key={index} className="bg-blue-50 p-4 rounded-md my-4">
            <p>{paragraph}</p>
          </div>
        );
      }
      
      // Check for code blocks
      if (paragraph.includes('```') || paragraph.match(/^(java|python|js|javascript|c|cpp|php|sql)\s*\n/)) {
        // Handle markdown code blocks ```language\ncode\n```
        const codeMatch = paragraph.match(/```(\w+)?\n([\s\S]+?)\n```/);
        if (codeMatch) {
          const language = codeMatch[1] || detectLanguage(codeMatch[2]);
          const code = codeMatch[2];
          return (
            <div key={index} className="my-4">
              <CodeBlock code={code} language={language} />
            </div>
          );
        }
        
        // Handle language prefix code blocks (e.g., java\ncode)
        const langPrefixMatch = paragraph.match(/^(java|python|js|javascript|c|cpp|php|sql)\s*\n([\s\S]+)$/);
        if (langPrefixMatch) {
          let language = langPrefixMatch[1];
          if (language === 'js') language = 'javascript';
          const code = langPrefixMatch[2];
          return (
            <div key={index} className="my-4">
              <CodeBlock code={code} language={language} />
            </div>
          );
        }
        
        // If we can detect code but no explicit language
        if (/if\s*\(|\}\s*else\s*\{|function\s+\w+\s*\(|let\s+\w+\s*=|const\s+\w+\s*=|System\.out\.println|public\s+static|import\s+java\.|#include|printf|cout|void\s+\w+\s*\(|int\s+main|echo\s+|<?php|SELECT\s+|CREATE\s+TABLE|INSERT\s+INTO/.test(paragraph)) {
          const language = detectLanguage(paragraph);
          return (
            <div key={index} className="my-4">
              <CodeBlock code={paragraph} language={language} />
            </div>
          );
        }
      }
      
      // Check if paragraph starts with Type followed by Description and Example (likely a table)
      if (paragraph.includes('Type') && paragraph.includes('Description') && (paragraph.includes('Exemple') || paragraph.includes('Example'))) {
        const rows = paragraph.split('\n');
        return (
          <div key={index} className="overflow-x-auto my-4">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  {rows[0].split('\t').map((header, i) => (
                    <th key={i} className="border p-2 text-left">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    {row.split('\t').map((cell, cellIndex) => (
                      <td key={cellIndex} className="border p-2">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      
      // Regular paragraph
      return <p key={index} className="my-3">{paragraph}</p>;
    });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        
        {loading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="h-4 bg-gray-100 rounded w-1/4 mb-8" />
            <div className="h-96 bg-gray-100 rounded" />
          </div>
        ) : summary ? (
          <>
            <Card className="border-t-4 border-t-blue-500">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-2xl">{summary.title}</CardTitle>
                    {userProgress?.summary_read && (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-5 w-5 mr-1" />
                        <span className="text-sm font-medium">Lu</span>
                      </div>
                    )}
                  </div>
                  <CardDescription>
                    Résumé des concepts fondamentaux du langage
                  </CardDescription>
                </div>
                {!userProgress?.summary_read && (
                  <Button 
                    onClick={handleMarkAsRead}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Marquer comme Lu
                  </Button>
                )}
              </CardHeader>
              <CardContent className="prose max-w-none">
                {renderSummaryContent(summary.content)}
              </CardContent>
            </Card>
            
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              
              {!userProgress?.summary_read ? (
                <Button 
                  onClick={handleMarkAsRead}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Marquer comme Lu
                </Button>
              ) : (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-1" />
                  <span className="font-medium">Résumé Complété</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Code className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium mb-2">Résumé non disponible</h3>
              <p className="text-gray-500 max-w-md text-center mb-6">
                Le résumé pour ce langage n'est pas encore disponible.
              </p>
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LanguageSummaryPage;
