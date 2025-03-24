
import React, { useState } from 'react';
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, FileIcon, FolderIcon, GitBranchIcon, GithubIcon, PlusIcon, UploadIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { toast } from "sonner";

// Define a simple interface for project files
interface ProjectFile {
  id: string;
  name: string;
  type: string;
  size: string;
  lastModified: Date;
  url?: string;
}

// Interface for student projects
interface StudentProject {
  id: string;
  title: string;
  description: string;
  created_at: string;
  status: 'submitted' | 'pending' | 'approved' | 'rejected';
  feedback?: string;
  files: ProjectFile[];
}

export default function ProjectsPage() {
  const { user } = useAuthState();
  const [projects, setProjects] = useState<StudentProject[]>([
    {
      id: "1",
      title: "Application Web React",
      description: "Une application React qui affiche des données depuis une API",
      created_at: "2023-05-15T10:30:00",
      status: "approved",
      feedback: "Excellent travail ! La structure du code est claire et les composants bien organisés.",
      files: [
        { id: "f1", name: "App.js", type: "js", size: "25 KB", lastModified: new Date("2023-05-15") },
        { id: "f2", name: "index.css", type: "css", size: "8 KB", lastModified: new Date("2023-05-14") },
        { id: "f3", name: "package.json", type: "json", size: "2 KB", lastModified: new Date("2023-05-13") }
      ]
    },
    {
      id: "2",
      title: "Algorithme de tri en Python",
      description: "Implémentation de différents algorithmes de tri en Python",
      created_at: "2023-04-20T14:20:00",
      status: "rejected",
      feedback: "Votre algorithme de tri rapide présente un bug dans le cas de tableaux avec des éléments identiques. Veuillez corriger et soumettre à nouveau.",
      files: [
        { id: "f4", name: "sorting.py", type: "py", size: "12 KB", lastModified: new Date("2023-04-20") },
        { id: "f5", name: "test_sorting.py", type: "py", size: "15 KB", lastModified: new Date("2023-04-19") }
      ]
    },
    {
      id: "3",
      title: "Backend Node.js",
      description: "API RESTful avec Express et MongoDB",
      created_at: "2023-06-10T09:15:00",
      status: "pending",
      files: [
        { id: "f6", name: "server.js", type: "js", size: "18 KB", lastModified: new Date("2023-06-10") },
        { id: "f7", name: "routes.js", type: "js", size: "22 KB", lastModified: new Date("2023-06-09") },
        { id: "f8", name: "database.js", type: "js", size: "10 KB", lastModified: new Date("2023-06-08") }
      ]
    }
  ]);
  
  const [newProject, setNewProject] = useState({
    title: "",
    description: ""
  });
  
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);
  
  // Function to handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files);
    }
  };
  
  // Function to submit a new project
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Vous devez être connecté pour soumettre un projet");
      return;
    }
    
    if (!newProject.title || !newProject.description) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    if (!selectedFiles || selectedFiles.length === 0) {
      toast.error("Veuillez sélectionner au moins un fichier");
      return;
    }
    
    setUploading(true);
    
    try {
      // Create a new project entry in the database
      const { data: projectData, error: projectError } = await supabase
        .from('student_projects')
        .insert({
          user_id: user.id,
          title: newProject.title,
          description: newProject.description,
          status: 'pending'
        })
        .select()
        .single();
      
      if (projectError) throw projectError;
      
      // Upload all selected files
      const uploadedFiles: ProjectFile[] = [];
      
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${projectData.id}/${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { data: fileData, error: fileError } = await supabase.storage
          .from('project_files')
          .upload(fileName, file);
        
        if (fileError) throw fileError;
        
        // Get the public URL for the file
        const { data: urlData } = supabase.storage
          .from('project_files')
          .getPublicUrl(fileName);
        
        // Add file metadata to the files table
        const { data: fileMetadata, error: metadataError } = await supabase
          .from('project_files')
          .insert({
            project_id: projectData.id,
            file_name: file.name,
            file_type: fileExt || 'unknown',
            file_size: file.size,
            file_path: fileName,
            file_url: urlData?.publicUrl || ''
          })
          .select()
          .single();
        
        if (metadataError) throw metadataError;
        
        uploadedFiles.push({
          id: fileMetadata.id,
          name: file.name,
          type: fileExt || 'unknown',
          size: `${Math.round(file.size / 1024)} KB`,
          lastModified: new Date(),
          url: urlData?.publicUrl
        });
      }
      
      // Add the new project to the state
      const newProjectEntry: StudentProject = {
        id: projectData.id,
        title: projectData.title,
        description: projectData.description,
        created_at: projectData.created_at,
        status: 'pending',
        files: uploadedFiles
      };
      
      setProjects([newProjectEntry, ...projects]);
      
      // Reset form
      setNewProject({ title: "", description: "" });
      setSelectedFiles(null);
      setOpen(false);
      
      toast.success("Projet soumis avec succès !");
    } catch (error) {
      console.error("Error submitting project:", error);
      toast.error("Erreur lors de la soumission du projet. Veuillez réessayer.");
    } finally {
      setUploading(false);
    }
  };
  
  const getStatusBadge = (status: StudentProject['status']) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Approuvé</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Rejeté</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">En attente</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">Soumis</Badge>;
    }
  };
  
  // Function to get file icon based on file type
  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return <FileIcon className="h-5 w-5 text-yellow-500" />;
      case 'css':
      case 'scss':
        return <FileIcon className="h-5 w-5 text-blue-500" />;
      case 'html':
        return <FileIcon className="h-5 w-5 text-orange-500" />;
      case 'json':
        return <FileIcon className="h-5 w-5 text-gray-500" />;
      case 'py':
        return <FileIcon className="h-5 w-5 text-green-500" />;
      case 'java':
        return <FileIcon className="h-5 w-5 text-red-500" />;
      default:
        return <FileIcon className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Mes Projets</h1>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusIcon className="h-4 w-4" />
                Nouveau Projet
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Soumettre un Nouveau Projet</DialogTitle>
                  <DialogDescription>
                    Soumettez votre projet pour évaluation. Les fichiers acceptés sont .zip, .rar, .py, .java, .js, etc.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre du Projet *</Label>
                    <Input 
                      id="title" 
                      value={newProject.title}
                      onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Input 
                      id="description" 
                      value={newProject.description}
                      onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="files">Fichiers *</Label>
                    <div className="border border-dashed border-gray-300 rounded-md p-6 text-center">
                      <UploadIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 mb-2">
                        Glissez-déposez vos fichiers ici ou cliquez pour parcourir
                      </p>
                      <Input 
                        id="files" 
                        type="file" 
                        className="hidden" 
                        multiple
                        onChange={handleFileChange}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => document.getElementById('files')?.click()}
                      >
                        Parcourir
                      </Button>
                      {selectedFiles && selectedFiles.length > 0 && (
                        <div className="mt-2 text-sm text-left">
                          <p className="font-medium">{selectedFiles.length} fichier(s) sélectionné(s):</p>
                          <ul className="mt-1 list-disc pl-5">
                            {Array.from(selectedFiles).slice(0, 3).map((file, index) => (
                              <li key={index} className="text-gray-600">{file.name}</li>
                            ))}
                            {selectedFiles.length > 3 && (
                              <li className="text-gray-600">...et {selectedFiles.length - 3} autre(s)</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="submit" disabled={uploading}>
                    {uploading ? "Envoi en cours..." : "Soumettre le Projet"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="pending">En attente</TabsTrigger>
            <TabsTrigger value="approved">Approuvés</TabsTrigger>
            <TabsTrigger value="rejected">Rejetés</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </TabsContent>
          
          <TabsContent value="pending" className="space-y-4">
            {projects.filter(p => p.status === 'pending').map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </TabsContent>
          
          <TabsContent value="approved" className="space-y-4">
            {projects.filter(p => p.status === 'approved').map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </TabsContent>
          
          <TabsContent value="rejected" className="space-y-4">
            {projects.filter(p => p.status === 'rejected').map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

interface ProjectCardProps {
  project: StudentProject;
}

function ProjectCard({ project }: ProjectCardProps) {
  const statusBadge = () => {
    switch (project.status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Approuvé</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Rejeté</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">En attente</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">Soumis</Badge>;
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{project.title}</CardTitle>
            <CardDescription className="mt-1">{project.description}</CardDescription>
          </div>
          {statusBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center text-sm text-gray-500">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <span>Soumis le {format(new Date(project.created_at), "dd/MM/yyyy 'à' HH:mm")}</span>
          </div>
          
          <div className="border rounded-md p-3">
            <h4 className="text-sm font-medium mb-2">Fichiers du projet</h4>
            <div className="space-y-2">
              {project.files.map((file) => (
                <div key={file.id} className="flex items-center justify-between bg-muted/40 rounded-md p-2">
                  <div className="flex items-center">
                    <div className="mr-2">
                      {file.type && getFileIcon(file.type)}
                    </div>
                    <span className="text-sm font-medium">{file.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-gray-500">{file.size}</span>
                    {file.url && (
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                        download
                      >
                        Télécharger
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {project.feedback && (
            <div className={`p-3 rounded-md ${
              project.status === 'approved' ? 'bg-green-50 border border-green-200' : 
              project.status === 'rejected' ? 'bg-red-50 border border-red-200' : 
              'bg-gray-50 border border-gray-200'
            }`}>
              <h4 className="text-sm font-medium mb-1">Feedback de l'enseignant</h4>
              <p className="text-sm">{project.feedback}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
