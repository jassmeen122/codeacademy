
import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

interface FormattedMessageProps {
  content: string;
}

export const FormattedMessage: React.FC<FormattedMessageProps> = ({ content }) => {
  const formatContent = (text: string) => {
    const lines = text.split('\n');
    const result: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      
      // Detect code blocks
      if (line.trim().startsWith('```')) {
        const language = line.trim().substring(3);
        const codeLines: string[] = [];
        i++; // Skip the opening ```
        
        // Collect code lines until closing ```
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        
        // Add code block
        result.push(
          <div key={`code-${result.length}`} className="my-2">
            <SyntaxHighlighter
              language={language || 'text'}
              style={tomorrow}
              customStyle={{
                fontSize: '0.875rem',
                borderRadius: '0.375rem',
                padding: '1rem',
              }}
            >
              {codeLines.join('\n')}
            </SyntaxHighlighter>
          </div>
        );
        
        i++; // Skip the closing ```
      } else {
        // Regular text line
        if (line.trim()) {
          // Handle inline code with backticks
          const parts = line.split(/(`[^`]+`)/g);
          const lineContent = parts.map((part, index) => {
            if (part.startsWith('`') && part.endsWith('`')) {
              return (
                <code 
                  key={index}
                  className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono"
                >
                  {part.slice(1, -1)}
                </code>
              );
            }
            return part;
          });
          
          result.push(
            <p key={`text-${result.length}`} className="mb-2 last:mb-0">
              {lineContent}
            </p>
          );
        } else {
          // Empty line creates spacing
          result.push(<br key={`br-${result.length}`} />);
        }
        i++;
      }
    }

    return result;
  };

  return (
    <div className="whitespace-pre-wrap">
      {formatContent(content)}
    </div>
  );
};
