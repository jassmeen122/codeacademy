
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Folder, 
  GitBranch, 
  Star, 
  Users, 
  Upload, 
  FileUp, 
  Download, 
  Calendar, 
  Clock,
  Eye
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  collaborators: number;
  status: "in_progress" | "completed" | "archived";
  created_at?: string;
  files?: ProjectFile[];
}

interface ProjectFile {
  id: number;
  name: string;
  size: string;
  uploaded_at: string;
  type: string;
  url: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "E-commerce Website",
    description: "A full-stack e-commerce website with React and Node.js",
    technologies: ["React", "Node.js", "PostgreSQL"],
    collaborators: 3,
    status: "in_progress",
    created_at: "2023-06-15",
    files: [
      {
        id: 1,
        name: "frontend-code.zip",
        size: "2.4 MB",
        uploaded_at: "2023-06-20",
        type: "zip",
        url: "#"
      },
      {
        id: 2,
        name: "database-schema.sql",
        size: "45 KB",
        uploaded_at: "2023-06-18",
        type: "sql",
        url: "#"
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
    created_at: "2023-05-10",
    files: [
      {
        id: 3,
        name: "weather-app-source.zip",
        size: "1.1 MB",
        uploaded_at: "2023-05-15",
        type: "zip",
        url: "#"
      }
    ]
  },
  {
    id: 3,
    title: "Task Manager",
    description: "A task management application with authentication",
    technologies: ["React", "Firebase", "Tailwind"],
    collaborators: 2,
    status: "archived",
    created_at: "2023-03-22",
    files: []
  },
];

export default function ProjectsPage() {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    technologies: ""
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProject(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitProject = () => {
    // Dans une implémentation réelle, vous enverriez les données au serveur ici
    toast.success("Projet créé avec succès !");
    setIsUploadDialogOpen(false);
    setNewProject({
      title: "",
      description: "",
      technologies: ""
    });
    setUploadedFiles([]);
  };
  
  const openProjectDetails = (project: Project) => {
    setSelectedProject(project);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'zip':
      case 'rar':
        return <Folder className="h-4 w-4" />;
      case 'sql':
        return <Database className="h-4 w-4" />;
      default:
        return <FileUp className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Mes Projets</h1>
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <FileUp className="mr-2 h-4 w-4" />
                Nouveau Projet
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Créer un nouveau projet</DialogTitle>
                <DialogDescription>
                  Remplissez les détails du projet et téléchargez vos fichiers
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Titre du projet</Label>
                  <Input 
                    id="title" 
                    name="title"
                    value={newProject.title}
                    onChange={handleInputChange}
                    placeholder="Entrez le titre de votre projet"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description"
                    value={newProject.description}
                    onChange={handleInputChange}
                    placeholder="Décrivez votre projet"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="technologies">Technologies (séparées par des virgules)</Label>
                  <Input 
                    id="technologies" 
                    name="technologies"
                    value={newProject.technologies}
                    onChange={handleInputChange}
                    placeholder="React, Node.js, MongoDB, etc."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="files">Fichiers du projet</Label>
                  <div className="border border-dashed border-gray-300 rounded-md p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Glissez-déposez vos fichiers ici ou cliquez pour parcourir
                    </p>
                    <Input 
                      id="files" 
                      type="file" 
                      multiple 
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <Button variant="outline" size="sm" onClick={() => document.getElementById('files')?.click()}>
                      Parcourir
                    </Button>
                  </div>
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="grid gap-2">
                    <Label>Fichiers téléchargés</Label>
                    <ScrollArea className="h-24 rounded-md border">
                      <div className="p-2">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex justify-between items-center py-1">
                            <div className="flex items-center gap-2">
                              <FileUp className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{file.name}</span>
                              <span className="text-xs text-muted-foreground">
                                ({(file.size / 1024).toFixed(2)} KB)
                              </span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6" 
                              onClick={() => handleRemoveFile(index)}
                            >
                              ✕
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleSubmitProject}>Soumettre le projet</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="projects" className="mb-8">
          <TabsList>
            <TabsTrigger value="projects">Tous les projets</TabsTrigger>
            <TabsTrigger value="in_progress">En cours</TabsTrigger>
            <TabsTrigger value="completed">Terminés</TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Card 
                  key={project.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => openProjectDetails(project)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{project.title}</span>
                      <Badge
                        className={getStatusColor(project.status)}
                      >
                        {project.status.replace("_", " ")}
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
                    {project.files && project.files.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Fichiers</span>
                          <span className="text-xs text-muted-foreground">{project.files.length} fichier(s)</span>
                        </div>
                        <ScrollArea className="h-16">
                          {project.files.map(file => (
                            <div key={file.id} className="flex items-center justify-between py-1">
                              <div className="flex items-center gap-2">
                                {getFileIcon(file.type)}
                                <span className="text-sm">{file.name}</span>
                              </div>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </ScrollArea>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="in_progress">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.filter(p => p.status === "in_progress").map((project) => (
                <Card 
                  key={project.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => openProjectDetails(project)}
                >
                  {/* Same as above card content */}
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{project.title}</span>
                      <Badge
                        className={getStatusColor(project.status)}
                      >
                        {project.status.replace("_", " ")}
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
                    {project.files && project.files.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Fichiers</span>
                          <span className="text-xs text-muted-foreground">{project.files.length} fichier(s)</span>
                        </div>
                        <ScrollArea className="h-16">
                          {project.files.map(file => (
                            <div key={file.id} className="flex items-center justify-between py-1">
                              <div className="flex items-center gap-2">
                                {getFileIcon(file.type)}
                                <span className="text-sm">{file.name}</span>
                              </div>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </ScrollArea>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="completed">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.filter(p => p.status === "completed").map((project) => (
                <Card 
                  key={project.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => openProjectDetails(project)}
                >
                  {/* Same as above card content */}
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{project.title}</span>
                      <Badge
                        className={getStatusColor(project.status)}
                      >
                        {project.status.replace("_", " ")}
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
                    {project.files && project.files.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Fichiers</span>
                          <span className="text-xs text-muted-foreground">{project.files.length} fichier(s)</span>
                        </div>
                        <ScrollArea className="h-16">
                          {project.files.map(file => (
                            <div key={file.id} className="flex items-center justify-between py-1">
                              <div className="flex items-center gap-2">
                                {getFileIcon(file.type)}
                                <span className="text-sm">{file.name}</span>
                              </div>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </ScrollArea>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Dialogue pour afficher les détails du projet */}
        <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
          <DialogContent className="sm:max-w-[700px]">
            {selectedProject && (
              <>
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <DialogTitle>{selectedProject.title}</DialogTitle>
                    <Badge className={getStatusColor(selectedProject.status)}>
                      {selectedProject.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <DialogDescription>
                    Créé le: {selectedProject.created_at}
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground mb-4">{selectedProject.description}</p>
                  
                  <h3 className="font-semibold mb-2">Technologies</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedProject.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <h3 className="font-semibold mb-2">Collaborateurs</h3>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedProject.collaborators} collaborateurs</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Statistiques</h3>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <GitBranch className="h-4 w-4 text-muted-foreground" />
                          <span>4 commits</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-muted-foreground" />
                          <span>3 favoris</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold mb-2">Fichiers du projet</h3>
                  {selectedProject.files && selectedProject.files.length > 0 ? (
                    <ScrollArea className="h-52 rounded-md border">
                      <div className="p-4">
                        {selectedProject.files.map(file => (
                          <div key={file.id} className="flex items-center justify-between py-2 border-b last:border-0">
                            <div className="flex items-center gap-3">
                              {getFileIcon(file.type)}
                              <div>
                                <div className="font-medium">{file.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {file.size} • Téléchargé le {file.uploaded_at}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                Aperçu
                              </Button>
                              <Button size="sm">
                                <Download className="h-4 w-4 mr-1" />
                                Télécharger
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <p className="text-muted-foreground text-center py-8 border rounded-md">
                      Aucun fichier n'a été téléchargé pour ce projet.
                    </p>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSelectedProject(null)}>Fermer</Button>
                  <Button>Ajouter des fichiers</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
