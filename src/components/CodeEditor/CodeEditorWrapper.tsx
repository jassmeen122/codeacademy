
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Play, Lightbulb, Bug } from "lucide-react";
import MonacoEditor from '@monaco-editor/react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type ProgrammingLanguage = "python" | "java" | "javascript" | "c" | "cpp" | "php" | "sql";

interface CodeEditorWrapperProps {
  initialLanguage?: ProgrammingLanguage;
  initialCode?: string;
}

const languageOptions: Record<ProgrammingLanguage, { label: string, monacoId: string }> = {
  python: { label: "Python", monacoId: "python" },
  java: { label: "Java", monacoId: "java" },
  javascript: { label: "JavaScript", monacoId: "javascript" },
  c: { label: "C", monacoId: "c" },
  cpp: { label: "C++", monacoId: "cpp" },
  php: { label: "PHP", monacoId: "php" },
  sql: { label: "SQL", monacoId: "sql" }
};

const defaultCode: Record<ProgrammingLanguage, string> = {
  python: '# Write your Python code here\nprint("Hello, World!")',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
  javascript: '// Write your JavaScript code here\nconsole.log("Hello, World!");',
  c: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
  cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
  php: '<?php\n// Write your PHP code here\necho "Hello, World!";',
  sql: '-- Write your SQL query here\nSELECT "Hello, World!" as greeting;'
};

export const CodeEditorWrapper: React.FC<CodeEditorWrapperProps> = ({
  initialLanguage = "python",
  initialCode,
}) => {
  const [language, setLanguage] = useState<ProgrammingLanguage>(initialLanguage);
  const [code, setCode] = useState<string>(initialCode || defaultCode[initialLanguage]);
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput("");
    
    try {
      const { data, error } = await supabase.functions.invoke('execute-code', {
        body: {
          language,
          code
        }
      });

      if (error) throw error;

      setOutput(data.output || "Program executed successfully!");
      
      if (data.error) {
        // If there's an error, automatically get AI assistance
        handleGetAIHelp();
      }
    } catch (error) {
      console.error('Error executing code:', error);
      setOutput('Error executing code. Please try again.');
      toast.error("Failed to execute code");
    } finally {
      setIsRunning(false);
    }
  };

  const handleGetAIHelp = async () => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-code', {
        body: {
          language,
          code,
          output
        }
      });

      if (error) throw error;

      setOutput(prev => `${prev}\n\n🤖 AI Assistant:\n${data.analysis}`);
    } catch (error) {
      console.error('Error getting AI help:', error);
      toast.error("Failed to get AI assistance");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Code Editor</CardTitle>
          <div className="flex items-center gap-4">
            <Select
              value={language}
              onValueChange={(value) => {
                setLanguage(value as ProgrammingLanguage);
                setCode(defaultCode[value as ProgrammingLanguage]);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(languageOptions).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleGetAIHelp}
              variant="outline"
              disabled={isAnalyzing || !code}
            >
              <Lightbulb className="mr-2 h-4 w-4" />
              Get AI Help
            </Button>
            <Button
              onClick={handleRunCode}
              disabled={isRunning || !code}
            >
              <Play className="mr-2 h-4 w-4" />
              Run Code
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Code Editor */}
          <div className="min-h-[400px] border rounded-lg overflow-hidden">
            <MonacoEditor
              height="400px"
              language={languageOptions[language].monacoId}
              value={code}
              onChange={(value) => setCode(value || "")}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
              }}
            />
          </div>
          {/* Output Console */}
          <div className="min-h-[400px] bg-black text-white p-4 font-mono text-sm rounded-lg overflow-auto">
            <div className="flex items-center gap-2 mb-2 text-gray-400">
              <Bug className="h-4 w-4" />
              Output Console
            </div>
            <pre className="whitespace-pre-wrap">{output || "Program output will appear here..."}</pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
