
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { lazy, Suspense } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

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
          
          <Alert className="bg-blue-50 border-blue-200">
            <InfoIcon className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700">
              Note: Ce mode démo simule l'exécution du code pour JavaScript et Python. Les autres langages affichent un résultat simulé.
            </AlertDescription>
          </Alert>
          
          {/* Full-height editor to maximize the available space */}
          <div className="h-[calc(100vh-16rem)]">
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
