
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { PenTool } from "lucide-react";
import { lazy, Suspense } from "react";

// Use lazy loading for the CodeEditorWrapper component to improve initial load time
const LazyCodeEditorWrapper = lazy(() => import("@/components/CodeEditor/LazyCodeEditorWrapper"));

const CodeEditorPage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold text-gray-800">Code Editor</h1>
            <p className="text-gray-600">Write, run and debug code with AI assistance</p>
          </div>
          
          <div className="flex justify-center mb-4">
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm hover:shadow-md transition-shadow duration-200 w-full max-w-lg">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-center">
                  <div className="mr-4 bg-purple-100 p-3 rounded-full">
                    <PenTool className="h-7 w-7 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-purple-800">Practice Coding</h3>
                    <p className="text-purple-700">Test code snippets and algorithms instantly</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Full-height editor to maximize the available space */}
          <div className="h-[calc(100vh-15rem)] md:h-[calc(100vh-12rem)]">
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>}>
              <LazyCodeEditorWrapper />
            </Suspense>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CodeEditorPage;
