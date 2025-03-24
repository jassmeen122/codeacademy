
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Lightbulb, Code, RefreshCw } from "lucide-react";
import { CodeEditorProps, defaultCode } from './types';
import { LanguageSelector } from './LanguageSelector';
import { MonacoEditorWrapper } from './MonacoEditorWrapper';
import { OutputConsole } from './OutputConsole';
import { useCodeExecution } from './useCodeExecution';
import { toast } from "sonner";

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
    if (!code.trim()) {
      toast.error("Please enter some code to execute");
      return;
    }
    runCode(code, language);
  };

  const handleGetAIHelp = () => {
    if (!code.trim()) {
      toast.error("Please enter some code for analysis");
      return;
    }
    getAIHelp(code, language);
  };

  const handleResetCode = () => {
    setCode(defaultCode[language]);
    toast.info(`Code reset to default ${language} example`);
  };

  return (
    <Card className="w-full h-full border-[1.5px] shadow-md overflow-hidden">
      <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b py-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <CardTitle className="flex items-center text-lg">
            <Code className="mr-2 h-5 w-5 text-blue-500" />
            {language.charAt(0).toUpperCase() + language.slice(1)} Code Editor
          </CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <LanguageSelector 
              language={language} 
              onChange={handleLanguageChange} 
            />
            <Button
              onClick={handleResetCode}
              variant="outline"
              size="sm"
              className="text-xs h-8"
            >
              <RefreshCw className="mr-1 h-3 w-3" />
              Reset
            </Button>
            <Button
              onClick={handleGetAIHelp}
              variant="outline"
              size="sm"
              className="text-xs h-8 bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
              disabled={isAnalyzing || !code}
            >
              <Lightbulb className="mr-1 h-3 w-3" />
              AI Help
            </Button>
            <Button
              onClick={handleRunCode}
              size="sm"
              className="text-xs h-8 bg-blue-600 hover:bg-blue-700"
              disabled={isRunning || !code}
            >
              <Play className="mr-1 h-3 w-3" />
              Run
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 h-[calc(100%-52px)]">
        <div className="grid h-full md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x">
          {/* Code Editor */}
          <div className="h-[400px] md:h-full">
            <MonacoEditorWrapper
              language={language}
              code={code}
              onChange={setCode}
            />
          </div>
          {/* Output and Analysis Console */}
          <div className="h-[300px] md:h-full overflow-hidden">
            <OutputConsole
              output={output}
              analysis={analysis}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              isAnalyzing={isAnalyzing}
              isRunning={isRunning}
              errorMessage={errorMessage}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
