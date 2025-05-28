
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, Download, Rocket } from "lucide-react";
import { ProjectSpecs, PreviewMode } from "@/types/project";
import { generateSimplePageHTML, downloadHTMLFile } from "@/utils/projectGenerator";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { ProjectPreview } from "@/components/projects/ProjectPreview";

const ProjectsPage = () => {
  const [specs, setSpecs] = useState<ProjectSpecs>({
    projectName: "",
    description: "",
    primaryColor: "#3b82f6",
    secondaryColor: "#1e40af",
    sections: []
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('form');

  const generateSimplePage = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const htmlCode = generateSimplePageHTML(specs);
      setGeneratedCode(htmlCode);
      setPreviewMode('preview');
      setIsGenerating(false);
      toast.success("Page générée avec succès!");
    }, 1000);
  };

  const downloadCode = () => {
    if (!generatedCode) return;
    downloadHTMLFile(generatedCode, specs.projectName);
    toast.success("Fichier téléchargé!");
  };

  const resetForm = () => {
    setSpecs({
      projectName: "",
      description: "",
      primaryColor: "#3b82f6",
      secondaryColor: "#1e40af",
      sections: []
    });
    setGeneratedCode(null);
    setPreviewMode('form');
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-lg">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Générateur de Pages Web</h1>
                <p className="text-muted-foreground">Créez une page web simple en quelques clics</p>
              </div>
            </div>
            
            {generatedCode && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setPreviewMode(previewMode === 'form' ? 'preview' : 'form')}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  {previewMode === 'form' ? 'Voir l\'aperçu' : 'Voir le formulaire'}
                </Button>
                <Button variant="outline" onClick={downloadCode}>
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Nouveau projet
                </Button>
              </div>
            )}
          </div>

          {previewMode === 'form' ? (
            <ProjectForm
              specs={specs}
              onSpecsChange={setSpecs}
              onGenerate={generateSimplePage}
              isGenerating={isGenerating}
            />
          ) : (
            <ProjectPreview
              specs={specs}
              generatedCode={generatedCode}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectsPage;
