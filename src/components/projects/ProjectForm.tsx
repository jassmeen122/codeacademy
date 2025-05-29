
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, Rocket, Palette, Users, Target } from "lucide-react";
import { ProjectSpecs } from "@/types/project";

interface ProjectFormProps {
  specs: ProjectSpecs;
  onSpecsChange: (specs: ProjectSpecs) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const availableSections = [
  "À propos",
  "Services", 
  "Contact"
];

export const ProjectForm = ({ specs, onSpecsChange, onGenerate, isGenerating }: ProjectFormProps) => {
  const handleSectionChange = (section: string, checked: boolean) => {
    onSpecsChange({
      ...specs,
      sections: checked 
        ? [...specs.sections, section]
        : specs.sections.filter(s => s !== section)
    });
  };

  const handleGenerate = () => {
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

    onGenerate();
  };

  return (
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
                onChange={(e) => onSpecsChange({ ...specs, projectName: e.target.value })}
                placeholder="Ex: Mon Site Web"
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={specs.description}
                onChange={(e) => onSpecsChange({ ...specs, description: e.target.value })}
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
                    onChange={(e) => onSpecsChange({ ...specs, primaryColor: e.target.value })}
                    className="w-16 h-10"
                  />
                  <Input
                    value={specs.primaryColor}
                    onChange={(e) => onSpecsChange({ ...specs, primaryColor: e.target.value })}
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
                    onChange={(e) => onSpecsChange({ ...specs, secondaryColor: e.target.value })}
                    className="w-16 h-10"
                  />
                  <Input
                    value={specs.secondaryColor}
                    onChange={(e) => onSpecsChange({ ...specs, secondaryColor: e.target.value })}
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
            onClick={handleGenerate} 
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
  );
};
