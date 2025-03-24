
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
    <div className="h-full w-full bg-gray-900 text-white rounded-tr-lg rounded-br-lg overflow-hidden flex flex-col">
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => onTabChange(value as "output" | "analysis")}
        className="h-full flex flex-col"
      >
        <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
          <TabsList className="grid w-full grid-cols-2 bg-gray-700">
            <TabsTrigger 
              value="output" 
              className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Bug className="h-4 w-4" />
              Output
            </TabsTrigger>
            <TabsTrigger 
              value="analysis" 
              className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
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

        <TabsContent value="output" className="flex-1 p-4 overflow-auto font-mono">
          {output ? (
            <pre className="whitespace-pre-wrap text-green-300">{output}</pre>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-gray-400 text-center">
                <Bug className="h-12 w-12 mb-3 mx-auto opacity-20" />
                <p>Run your code to see program output here</p>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="analysis" className="flex-1 p-4 overflow-auto">
          {isAnalyzing ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-pulse flex flex-col items-center text-blue-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mb-3"></div>
                <p>Analyzing your code...</p>
              </div>
            </div>
          ) : analysis ? (
            <div className="whitespace-pre-wrap font-mono">
              <div className="flex items-center gap-2 mb-4 text-purple-400">
                <Lightbulb className="h-5 w-5" />
                <span className="font-semibold">AI Code Analysis</span>
              </div>
              <div className="text-purple-200 leading-relaxed pl-2 border-l-2 border-purple-400">
                {analysis}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Lightbulb className="h-12 w-12 mb-3 opacity-20" />
              <p className="text-center">Run your code or click "Get AI Help" to receive code analysis</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
