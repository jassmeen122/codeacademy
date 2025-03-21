
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CodeEditorWrapper } from "@/components/CodeEditor/CodeEditorWrapper";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const CodeEditorPage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-4 h-[calc(100vh-64px)]">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Code Editor</h1>
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertTitle>Multi-language Support</AlertTitle>
          <AlertDescription>
            Write, run, and get AI assistance for Python, Java, JavaScript, C, C++, PHP, and SQL code. 
            Perfect for practicing or testing code snippets.
          </AlertDescription>
        </Alert>
        <div className="h-[calc(100vh-180px)]">
          <CodeEditorWrapper />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CodeEditorPage;
