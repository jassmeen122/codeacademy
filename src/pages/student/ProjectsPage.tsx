
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Folder, GitBranch, Star, Users, Upload, FileUp, File, Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  collaborators: number;
  status: "in_progress" | "completed" | "archived";
  files?: ProjectFile[];
}

interface ProjectFile {
  id: number;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "E-commerce Website",
    description: "A full-stack e-commerce website with React and Node.js",
    technologies: ["React", "Node.js", "PostgreSQL"],
    collaborators: 3,
    status: "in_progress",
    files: [
      {
        id: 1,
        name: "documentation.pdf",
        size: "2.4 MB",
        type: "pdf",
        uploadedAt: "2023-05-15"
      }
    ]
  },
  {
    id: 2,
    title: "Weather App",
    description: "A weather application using OpenWeather API",
    technologies: ["JavaScript", "CSS", "API"],
    collaborators: 1,
    status: "completed",
  },
  {
    id: 3,
    title: "Task Manager",
    description: "A task management application with authentication",
    technologies: ["React", "Firebase", "Tailwind"],
    collaborators: 2,
    status: "archived",
  },
];

export default function ProjectsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "in_progress":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "archived":
        return "bg-gray-500";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files);
    }
  };

  const handleUpload = () => {
    if (!selectedFiles) {
      toast.error("Veuillez sélectionner des fichiers à télécharger");
      return;
    }

    // Mock upload success for demonstration purposes
    toast.success(`${selectedFiles.length} fichier(s) téléchargé(s) avec succès`);
    setIsDialogOpen(false);
    setSelectedFiles(null);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Mes Projets</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Folder className="mr-2 h-4 w-4" />
                Nouveau Projet
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Créer un nouveau projet</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Titre du projet</Label>
                  <Input id="title" placeholder="Mon projet incroyable" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Une description de votre projet" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="technologies">Technologies (séparées par des virgules)</Label>
                  <Input id="technologies" placeholder="React, TypeScript, Node.js" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="files">Fichiers du projet</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Input
                      id="files"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <Label htmlFor="files" className="cursor-pointer block">
                      <FileUp className="mx-auto h-10 w-10 text-gray-400" />
                      <span className="mt-2 block text-sm font-semibold">
                        {selectedFiles ? `${selectedFiles.length} fichier(s) sélectionné(s)` : "Cliquez pour sélectionner des fichiers"}
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        Formats acceptés: .zip, .rar, .pdf, .py, .java, .js, .ts, etc.
                      </span>
                    </Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="button" onClick={handleUpload}>
                  <Upload className="mr-2 h-4 w-4" />
                  Créer le projet
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{project.title}</span>
                  <Badge
                    className={getStatusColor(project.status)}
                  >
                    {project.status === "in_progress" ? "En cours" : 
                     project.status === "completed" ? "Terminé" : "Archivé"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
                
                {project.files && project.files.length > 0 && (
                  <div className="mt-4 mb-4">
                    <h4 className="text-sm font-medium mb-2">Fichiers</h4>
                    <div className="space-y-2">
                      {project.files.map(file => (
                        <div 
                          key={file.id} 
                          className="flex items-center p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          <File className="h-4 w-4 mr-2 text-blue-500" />
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-gray-500 ml-auto">{file.size}</span>
                          <Button variant="ghost" size="sm" className="ml-2 h-6 w-6 p-0">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{project.collaborators} collaborateurs</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <GitBranch className="h-4 w-4" />
                      <span>4</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      <span>3</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
