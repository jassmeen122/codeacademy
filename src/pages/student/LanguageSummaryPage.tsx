
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useLanguageSummary } from '@/hooks/useLanguageSummary';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, BookOpen, CheckCircle } from "lucide-react";
import { useAuthState } from '@/hooks/useAuthState';
import { CodeBlock } from '@/components/ai-assistant/CodeBlock';

const LanguageSummaryPage = () => {
  const { languageId } = useParams<{ languageId: string }>();
  const navigate = useNavigate();
  const { summary, userProgress, loading, markAsRead } = useLanguageSummary(languageId ?? null);
  const { user } = useAuthState();

  const handleMarkAsRead = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    const success = await markAsRead();
    if (success) {
      // We don't need to navigate away as the state will update
    }
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
      
      // Check for code blocks (detect language by looking for java or python indicators)
      const codeMatch = paragraph.match(/^(java|python)\s*\n([\s\S]+)$/);
      if (codeMatch) {
        const language = codeMatch[1];
        const code = codeMatch[2];
        return (
          <div key={index} className="my-4">
            <CodeBlock code={code} language={language} />
          </div>
        );
      }
      
      // Check if paragraph starts with Type followed by Description and Example (likely a table)
      if (paragraph.startsWith('Type') && paragraph.includes('Description') && paragraph.includes('Exemple')) {
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
              <BookOpen className="h-16 w-16 text-gray-300 mb-4" />
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
