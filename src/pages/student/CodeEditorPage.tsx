
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { PenTool } from "lucide-react";
import { lazy, Suspense } from "react";

// Use lazy loading for the CodeEditorWrapper component to improve initial load time
const LazyCodeEditorWrapper = lazy(() => import("@/components/CodeEditor/LazyCodeEditorWrapper"));

const CodeEditorPage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col space-y-1">
            <h1 className="text-2xl font-bold text-gray-800">Code Editor</h1>
            <p className="text-gray-600">Write, run and debug code with AI assistance</p>
          </div>
          
          {/* Full-height editor to maximize the available space */}
          <div className="h-[calc(100vh-10rem)]">
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
