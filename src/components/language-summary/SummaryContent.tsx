
import React from 'react';
import { CodeBlock } from '@/components/ai-assistant/CodeBlock';

interface SummaryContentProps {
  content: string;
}

export const SummaryContent: React.FC<SummaryContentProps> = ({ content }) => {
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

  return <div className="prose max-w-none">{renderSummaryContent(content)}</div>;
};
