
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SummaryContentProps {
  title: string;
  content: string;
  isRead?: boolean;
  isUpdating?: boolean;
}

export const SummaryContent = ({ 
  title, 
  content, 
  isRead = false, 
  onMarkAsRead,
  isUpdating = false 
}: SummaryContentProps & {
  onMarkAsRead?: () => void;
}) => {
  // La fonction pour formater le contenu avec des sections
  const formatContent = (text: string) => {
    // Diviser le contenu en sections
    const sections = text.split('\n\n');
    
    return sections.map((section, index) => {
      // Vérifier si c'est un titre (hypothèse: les titres commencent par # ou ## et sont sur une seule ligne)
      if (section.startsWith('# ')) {
        return (
          <h2 key={index} className="text-2xl font-bold mt-6 mb-4">
            {section.replace('# ', '')}
          </h2>
        );
      } else if (section.startsWith('## ')) {
        return (
          <h3 key={index} className="text-xl font-semibold mt-5 mb-3">
            {section.replace('## ', '')}
          </h3>
        );
      } else if (section.includes('```')) {
        // Formater les blocs de code
        const code = section.replace(/```(python|java|javascript)?\n/g, '').replace(/```$/g, '');
        return (
          <pre key={index} className="bg-gray-100 p-4 rounded-md my-4 overflow-x-auto">
            <code>{code}</code>
          </pre>
        );
      } else if (section.includes('✔️') || section.includes('✅') || section.includes('🔹') || section.includes('💡')) {
        // Section avec des emoji/points, on préserve le format
        return (
          <div key={index} className="mb-4 text-gray-700 leading-relaxed">
            {section.split('\n').map((line, i) => (
              <p key={i} className={`${line.trim().startsWith('✔️') || line.trim().startsWith('✅') || line.trim().startsWith('🔹') || line.trim().startsWith('💡') ? 'ml-5' : ''} mb-2`}>
                {line}
              </p>
            ))}
          </div>
        );
      } else {
        // Paragraphe normal
        return (
          <p key={index} className="mb-4 text-gray-700 leading-relaxed">
            {section}
          </p>
        );
      }
    });
  };

  return (
    <Card className="w-full bg-white shadow-md mb-6">
      <CardHeader className="pb-2 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-2xl">
            {title}
            {isRead && <CheckCircle className="h-5 w-5 text-green-500" />}
          </CardTitle>
          {!isRead && onMarkAsRead && (
            <Button 
              onClick={onMarkAsRead}
              disabled={isUpdating}
              className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Mark as Read
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="prose max-w-none">
          {formatContent(content)}
        </div>
      </CardContent>
    </Card>
  );
};
