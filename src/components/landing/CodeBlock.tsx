
import React from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import java from "react-syntax-highlighter/dist/esm/languages/prism/java";

// Register languages
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("java", java);

interface CodeBlockProps {
  code: string;
  language: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  return (
    <SyntaxHighlighter
      language={language}
      style={vscDarkPlus}
      customStyle={{
        borderRadius: "0.375rem",
        margin: 0,
        fontSize: "0.9rem",
        backgroundColor: "transparent",
      }}
      showLineNumbers={true}
      wrapLines={true}
    >
      {code}
    </SyntaxHighlighter>
  );
};
