
import React from "react";
import { CodeBlock } from "./CodeBlock";

interface FormattedMessageProps {
  content: string;
}

export const FormattedMessage: React.FC<FormattedMessageProps> = ({ content }) => {
  // This regex looks for code blocks in markdown format: ```language\ncode\n```
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)\n```/g;
  const parts = [];
  
  let lastIndex = 0;
  let match;
  
  // Find all code blocks and process them
  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Add the text before the code block
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        content: content.substring(lastIndex, match.index),
      });
    }
    
    // Add the code block
    const language = match[1] || "plaintext";
    const code = match[2];
    
    parts.push({
      type: "code",
      language,
      code,
    });
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add any remaining text after the last code block
  if (lastIndex < content.length) {
    parts.push({
      type: "text",
      content: content.substring(lastIndex),
    });
  }
  
  return (
    <div className="whitespace-pre-wrap">
      {parts.map((part, index) => {
        if (part.type === "code") {
          return (
            <CodeBlock 
              key={index} 
              language={part.language} 
              code={part.code} 
            />
          );
        } else {
          return (
            <div key={index} className="mb-4">
              {part.content.split("\n").map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < part.content.split("\n").length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
          );
        }
      })}
    </div>
  );
};
