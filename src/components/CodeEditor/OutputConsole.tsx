
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bug, Lightbulb, Shield } from "lucide-react";

interface OutputConsoleProps {
  output: string;
  analysis: string;
  activeTab: "output" | "analysis";
  onTabChange: (value: "output" | "analysis") => void;
  isAnalyzing: boolean;
}

export const OutputConsole: React.FC<OutputConsoleProps> = ({
  output,
  analysis,
  activeTab,
  onTabChange,
  isAnalyzing
}) => {
  return (
    <div className="min-h-[400px] bg-black text-white rounded-lg overflow-hidden flex flex-col">
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => onTabChange(value as "output" | "analysis")}
        className="h-full"
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
        <TabsContent value="output" className="h-[360px] p-4 overflow-auto">
          <pre className="whitespace-pre-wrap">{output || "Program output will appear here..."}</pre>
        </TabsContent>
        <TabsContent value="analysis" className="h-[360px] p-4 overflow-auto">
          {analysis ? (
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
