
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Download } from "lucide-react";
import { ProjectSpecs } from "@/types/project";
import { downloadHTMLFile } from "@/utils/projectGenerator";
import { toast } from "sonner";

interface ProjectPreviewProps {
  specs: ProjectSpecs;
  generatedCode: string | null;
}

export const ProjectPreview = ({ specs, generatedCode }: ProjectPreviewProps) => {
  const handleDownloadCode = () => {
    if (!generatedCode) return;
    
    downloadHTMLFile(generatedCode, specs.projectName);
    toast.success("Fichier téléchargé!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Votre page web générée
        </CardTitle>
      </CardHeader>
      <CardContent>
        {generatedCode ? (
          <div className="space-y-4">
            <div className="bg-gray-50 border rounded-lg p-4">
              <div className="mb-4 flex justify-between items-center">
                <h3 className="font-medium">Projet: {specs.projectName}</h3>
                <Button variant="outline" size="sm" onClick={handleDownloadCode}>
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger HTML
                </Button>
              </div>
              
              <div className="border rounded-lg bg-white overflow-hidden">
                <iframe
                  srcDoc={generatedCode}
                  className="w-full h-[600px] border-0"
                  title="Aperçu de votre page web"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucune page générée</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
