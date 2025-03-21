
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bug, Lightbulb, Shield, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface OutputConsoleProps {
  output: string;
  analysis: string;
  activeTab: "output" | "analysis";
  onTabChange: (value: "output" | "analysis") => void;
  isAnalyzing: boolean;
  errorMessage?: string | null;
}

export const OutputConsole: React.FC<OutputConsoleProps> = ({
  output,
  analysis,
  activeTab,
  onTabChange,
  isAnalyzing,
  errorMessage
}) => {
  return (
    <div className="h-full bg-black text-white rounded-lg overflow-hidden flex flex-col">
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => onTabChange(value as "output" | "analysis")}
        className="h-full flex flex-col"
      >
        <div className="bg-gray-900 px-4 py-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="output" className="flex items-center gap-2">
              <Bug className="h-4 w-4" />
              Output
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              AI Analysis
            </TabsTrigger>
          </TabsList>
        </div>

        {errorMessage && (
          <Alert variant="destructive" className="m-2 bg-red-900 border-red-800">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <TabsContent value="output" className="flex-1 p-4 overflow-auto">
          <pre className="whitespace-pre-wrap">{output || "Program output will appear here..."}</pre>
        </TabsContent>
        <TabsContent value="analysis" className="flex-1 p-4 overflow-auto">
          {isAnalyzing ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-pulse text-blue-400">Analyzing your code...</div>
            </div>
          ) : analysis ? (
            <div className="whitespace-pre-wrap">
              <div className="flex items-center gap-2 mb-2 text-blue-400">
                <Lightbulb className="h-4 w-4" />
                <span className="font-semibold">AI Code Analysis</span>
              </div>
              <div className="text-green-300">{analysis}</div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Lightbulb className="h-8 w-8 mb-2 opacity-50" />
              <p>Run your code or click "Get AI Help" to receive code analysis</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
