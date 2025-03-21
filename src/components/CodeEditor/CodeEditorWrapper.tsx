
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Lightbulb } from "lucide-react";
import { CodeEditorProps, defaultCode } from './types';
import { LanguageSelector } from './LanguageSelector';
import { MonacoEditorWrapper } from './MonacoEditorWrapper';
import { OutputConsole } from './OutputConsole';
import { useCodeExecution } from './useCodeExecution';

export const CodeEditorWrapper: React.FC<CodeEditorProps> = ({
  initialLanguage = "python",
  initialCode,
}) => {
  const [language, setLanguage] = useState(initialLanguage);
  const [code, setCode] = useState<string>(initialCode || defaultCode[initialLanguage]);
  
  const {
    output,
    analysis,
    isRunning,
    isAnalyzing,
    activeTab,
    errorMessage,
    setActiveTab,
    runCode,
    getAIHelp
  } = useCodeExecution();

  const handleLanguageChange = (newLanguage: typeof language) => {
    setLanguage(newLanguage);
    // Only change the code if it's currently the default for the previous language
    if (code === defaultCode[language]) {
      setCode(defaultCode[newLanguage]);
    }
  };

  const handleRunCode = () => {
    runCode(code, language);
  };

  const handleGetAIHelp = () => {
    getAIHelp(code, language);
  };

  return (
    <Card className="w-full h-full mx-auto">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <CardTitle>Code Editor</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <LanguageSelector 
              language={language} 
              onChange={handleLanguageChange} 
            />
            <Button
              onClick={handleGetAIHelp}
              variant="outline"
              disabled={isAnalyzing || !code}
              size="sm"
            >
              <Lightbulb className="mr-2 h-4 w-4" />
              AI Help
            </Button>
            <Button
              onClick={handleRunCode}
              disabled={isRunning || !code}
              size="sm"
            >
              <Play className="mr-2 h-4 w-4" />
              Run Code
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid md:grid-cols-2 gap-4 h-[calc(100vh-240px)]">
          {/* Code Editor */}
          <div className="h-full border rounded-lg overflow-hidden">
            <MonacoEditorWrapper
              language={language}
              code={code}
              onChange={setCode}
              height="100%"
            />
          </div>
          {/* Output and Analysis Console */}
          <OutputConsole
            output={output}
            analysis={analysis}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isAnalyzing={isAnalyzing}
            errorMessage={errorMessage}
          />
        </div>
      </CardContent>
    </Card>
  );
};
