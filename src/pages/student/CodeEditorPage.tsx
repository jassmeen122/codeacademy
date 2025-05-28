
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { lazy, Suspense } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, Code, Terminal, Share2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

// Use lazy loading for the CodeEditorWrapper component to improve initial load time
const LazyCodeEditorWrapper = lazy(() => import("@/components/CodeEditor/LazyCodeEditorWrapper"));

const CodeEditorPage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between animate-fade-in">
            <div className="flex flex-col space-y-1">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center hover-scale">
                <Code className="mr-2 h-6 w-6 text-indigo-600 animate-pulse" />
                Éditeur de Code
                <Zap className="ml-2 h-5 w-5 text-yellow-500 animate-bounce" />
              </h1>
              <p className="text-gray-600">Écrivez, exécutez et déboguez du code avec l'assistance IA</p>
            </div>
            <div className="flex gap-2 mt-2 md:mt-0">
              <Button variant="outline" size="sm" className="flex items-center gap-1 hover-scale">
                <Terminal className="h-4 w-4" />
                <span>Console</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1 hover-scale">
                <Share2 className="h-4 w-4" />
                <span>Partager</span>
              </Button>
            </div>
          </div>
          
          <Alert className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 animate-scale-in">
            <InfoIcon className="h-4 w-4 text-indigo-600" />
            <AlertDescription className="text-indigo-700">
              Note: Ce mode démo simule l'exécution du code pour JavaScript et Python. Les autres langages affichent un résultat simulé.
            </AlertDescription>
          </Alert>
          
          {/* Full-height editor to maximize the available space */}
          <div className="h-[calc(100vh-16rem)] rounded-lg overflow-hidden border-2 border-indigo-100 shadow-lg animate-slide-in-right hover:shadow-xl transition-all duration-300">
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
                <div className="flex flex-col items-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                  <p className="text-indigo-600 font-medium animate-pulse">Chargement de l'éditeur...</p>
                </div>
              </div>
            }>
              <LazyCodeEditorWrapper />
            </Suspense>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CodeEditorPage;
