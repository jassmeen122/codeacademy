
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, Eye, Download, Rocket, Palette, Users, Target } from "lucide-react";

interface ProjectSpecs {
  projectName: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  sections: string[];
}

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
  const [previewMode, setPreviewMode] = useState<'form' | 'preview'>('form');

  const availableSections = [
    "À propos",
    "Services", 
    "Contact"
  ];

  const handleSectionChange = (section: string, checked: boolean) => {
    setSpecs(prev => ({
      ...prev,
      sections: checked 
        ? [...prev.sections, section]
        : prev.sections.filter(s => s !== section)
    }));
  };

  const generateSimplePage = () => {
    if (!specs.projectName.trim()) {
      toast.error("Veuillez entrer le nom du projet");
      return;
    }

    if (!specs.description.trim()) {
      toast.error("Veuillez entrer une description");
      return;
    }

    if (specs.sections.length === 0) {
      toast.error("Veuillez sélectionner au moins une section");
      return;
    }

    setIsGenerating(true);
    
    // Générer le code HTML/CSS simple
    setTimeout(() => {
      const htmlCode = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${specs.projectName}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        header {
            background-color: ${specs.primaryColor};
            color: white;
            padding: 60px 0;
            text-align: center;
        }
        
        header h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        
        header p {
            font-size: 1.3rem;
            opacity: 0.9;
        }
        
        section {
            padding: 60px 0;
        }
        
        section:nth-child(even) {
            background-color: #f8f9fa;
        }
        
        section h2 {
            color: ${specs.secondaryColor};
            font-size: 2.5rem;
            margin-bottom: 2rem;
            text-align: center;
        }
        
        section p {
            font-size: 1.2rem;
            text-align: center;
            max-width: 800px;
            margin: 0 auto;
        }
        
        footer {
            background-color: ${specs.secondaryColor};
            color: white;
            text-align: center;
            padding: 40px 0;
        }
        
        @media (max-width: 768px) {
            header h1 {
                font-size: 2rem;
            }
            
            section h2 {
                font-size: 1.8rem;
            }
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <h1>${specs.projectName}</h1>
            <p>${specs.description}</p>
        </div>
    </header>
    
    <main>
${specs.sections.map(section => {
  if (section === "À propos") {
    return `        <section>
            <div class="container">
                <h2>À propos</h2>
                <p>Découvrez notre histoire et notre mission. Nous sommes passionnés par ce que nous faisons et nous nous engageons à vous offrir le meilleur service possible.</p>
            </div>
        </section>`;
  }
  if (section === "Services") {
    return `        <section>
            <div class="container">
                <h2>Nos Services</h2>
                <p>Nous offrons une gamme complète de services de qualité. Notre équipe expérimentée est là pour répondre à tous vos besoins.</p>
            </div>
        </section>`;
  }
  if (section === "Contact") {
    return `        <section>
            <div class="container">
                <h2>Contact</h2>
                <p>Contactez-nous dès aujourd'hui pour discuter de votre projet. Nous serons ravis de vous aider à concrétiser vos idées.</p>
            </div>
        </section>`;
  }
  return "";
}).join('\n\n')}
    </main>
    
    <footer>
        <div class="container">
            <p>&copy; 2024 ${specs.projectName}. Tous droits réservés.</p>
        </div>
    </footer>
</body>
</html>`;

      setGeneratedCode(htmlCode);
      setPreviewMode('preview');
      setIsGenerating(false);
      toast.success("Page générée avec succès!");
    }, 1000);
  };

  const downloadCode = () => {
    if (!generatedCode) return;
    
    const blob = new Blob([generatedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${specs.projectName.replace(/\s+/g, '-').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Créer votre page web
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="projectName">Nom du projet *</Label>
                      <Input
                        id="projectName"
                        value={specs.projectName}
                        onChange={(e) => setSpecs(prev => ({ ...prev, projectName: e.target.value }))}
                        placeholder="Ex: Mon Site Web"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={specs.description}
                        onChange={(e) => setSpecs(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Décrivez votre projet en quelques mots..."
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="primaryColor" className="flex items-center gap-2">
                          <Palette className="h-4 w-4" />
                          Couleur principale
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="primaryColor"
                            type="color"
                            value={specs.primaryColor}
                            onChange={(e) => setSpecs(prev => ({ ...prev, primaryColor: e.target.value }))}
                            className="w-16 h-10"
                          />
                          <Input
                            value={specs.primaryColor}
                            onChange={(e) => setSpecs(prev => ({ ...prev, primaryColor: e.target.value }))}
                            placeholder="#3b82f6"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="secondaryColor">Couleur secondaire</Label>
                        <div className="flex gap-2">
                          <Input
                            id="secondaryColor"
                            type="color"
                            value={specs.secondaryColor}
                            onChange={(e) => setSpecs(prev => ({ ...prev, secondaryColor: e.target.value }))}
                            className="w-16 h-10"
                          />
                          <Input
                            value={specs.secondaryColor}
                            onChange={(e) => setSpecs(prev => ({ ...prev, secondaryColor: e.target.value }))}
                            placeholder="#1e40af"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="flex items-center gap-2 mb-3">
                        <Users className="h-4 w-4" />
                        Sections de la page *
                      </Label>
                      <div className="space-y-2">
                        {availableSections.map((section) => (
                          <div key={section} className="flex items-center space-x-2">
                            <Checkbox
                              id={section}
                              checked={specs.sections.includes(section)}
                              onCheckedChange={(checked) => handleSectionChange(section, checked as boolean)}
                            />
                            <Label htmlFor={section} className="text-sm">{section}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button 
                    onClick={generateSimplePage} 
                    disabled={isGenerating}
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Génération...
                      </>
                    ) : (
                      <>
                        <Rocket className="mr-2 h-4 w-4" />
                        Générer la page
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
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
                        <Button variant="outline" size="sm" onClick={downloadCode}>
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
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectsPage;
