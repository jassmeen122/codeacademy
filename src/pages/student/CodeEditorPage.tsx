
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CodeEditorWrapper } from "@/components/CodeEditor/CodeEditorWrapper";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Code, PenTool, Server } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const CodeEditorPage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold text-gray-800">Code Editor</h1>
            <p className="text-gray-600">Write, run and debug code with AI assistance</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="mr-4 bg-blue-100 p-2 rounded-full">
                    <Code className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800">Multi-language Support</h3>
                    <p className="text-sm text-blue-700">Python, Java, JavaScript, C, C++, PHP, and SQL</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="mr-4 bg-purple-100 p-2 rounded-full">
                    <PenTool className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-800">Practice Coding</h3>
                    <p className="text-sm text-purple-700">Test code snippets and algorithms instantly</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="mr-4 bg-emerald-100 p-2 rounded-full">
                    <Server className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-emerald-800">Cloud Execution</h3>
                    <p className="text-sm text-emerald-700">Code runs in the cloud, no local setup needed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Alert className="bg-blue-50 border-blue-200 mb-6">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertTitle className="text-blue-700">Pro Tip</AlertTitle>
            <AlertDescription className="text-blue-600">
              Use the "Get AI Help" button when you're stuck to receive code suggestions and explanations.
            </AlertDescription>
          </Alert>
          
          <div className="h-[calc(100vh-24rem)] md:h-[calc(100vh-20rem)]">
            <CodeEditorWrapper />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CodeEditorPage;
