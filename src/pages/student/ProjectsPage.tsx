
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { Project, ProjectFile } from "@/types/course";
import {
  Download,
  FileCode,
  FilePlus,
  FileText,
  FileZip,
  Loader2,
  UploadCloud,
} from "lucide-react";

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Le titre doit contenir au moins 5 caractères",
  }),
  description: z.string().min(10, {
    message: "La description doit contenir au moins 10 caractères",
  }),
});

const FileIcon = ({ fileName }: { fileName: string }) => {
  if (fileName.endsWith(".zip") || fileName.endsWith(".rar")) {
    return <FileZip className="h-4 w-4 mr-2" />;
  } else if (
    fileName.endsWith(".js") ||
    fileName.endsWith(".ts") ||
    fileName.endsWith(".py") ||
    fileName.endsWith(".java") ||
    fileName.endsWith(".cpp") ||
    fileName.endsWith(".c")
  ) {
    return <FileCode className="h-4 w-4 mr-2" />;
  } else {
    return <FileText className="h-4 w-4 mr-2" />;
  }
};

const ProjectsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthState();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    if (!user) return;

    try {
      setLoading(true);
      // This will need to be created in the database first
      // Create a SQL migration for this first
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Erreur lors du chargement des projets");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user || !files || files.length === 0) {
      toast.error("Veuillez sélectionner au moins un fichier");
      return;
    }

    try {
      setUploading(true);

      // Create new project
      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          title: values.title,
          description: values.description,
          status: "pending",
        })
        .select("*")
        .single();

      if (projectError) throw projectError;

      const project = projectData as Project;

      // Upload files
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split(".").pop();
        const fileName = `${user.id}/${project.id}/${Date.now()}.${fileExt}`;

        // Upload file to storage
        const { error: uploadError } = await supabase.storage
          .from("project_files")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get the public URL
        const { data: urlData } = supabase.storage
          .from("project_files")
          .getPublicUrl(fileName);

        // Store file metadata in the database
        const { error: fileError } = await supabase.from("project_files").insert({
          project_id: project.id,
          file_name: file.name,
          file_url: urlData.publicUrl,
          file_type: fileExt || "unknown",
        });

        if (fileError) throw fileError;
      }

      toast.success("Projet créé avec succès");
      form.reset();
      setFiles(null);
      setOpen(false);
      fetchProjects();
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Erreur lors de la création du projet");
    } finally {
      setUploading(false);
    }
  };

  const viewProjectFiles = async (project: Project) => {
    setSelectedProject(project);

    try {
      const { data, error } = await supabase
        .from("project_files")
        .select("*")
        .eq("project_id", project.id)
        .order("uploaded_at", { ascending: false });

      if (error) throw error;

      setProjectFiles(data || []);
    } catch (error) {
      console.error("Error fetching project files:", error);
      toast.error("Erreur lors du chargement des fichiers");
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Approuvé";
      case "rejected":
        return "Rejeté";
      default:
        return "En attente";
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Mes Projets</h1>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <FilePlus className="h-4 w-4 mr-2" />
                Nouveau Projet
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Créer un nouveau projet</DialogTitle>
                <DialogDescription>
                  Donnez un titre à votre projet et joignez les fichiers
                  nécessaires.
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titre du projet</FormLabel>
                        <FormControl>
                          <Input placeholder="Mon super projet" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Décrivez votre projet..."
                            {...field}
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <Label htmlFor="files">Fichiers du projet</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="files"
                        type="file"
                        multiple
                        onChange={(e) => setFiles(e.target.files)}
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Formats acceptés: .zip, .rar, .py, .js, .java, .cpp, etc.
                    </p>
                  </div>

                  <DialogFooter>
                    <Button
                      type="submit"
                      disabled={uploading}
                      className="w-full"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <UploadCloud className="h-4 w-4 mr-2" />
                          Envoyer le projet
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-gray-50">
            <FileCode className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun projet</h3>
            <p className="text-muted-foreground mb-4">
              Vous n'avez pas encore créé de projet.
            </p>
            <Button onClick={() => setOpen(true)}>
              <FilePlus className="h-4 w-4 mr-2" />
              Créer un projet
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeColor(
                          project.status
                        )}`}
                      >
                        {getStatusText(project.status)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(project.created_at).toLocaleDateString()}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{project.description}</p>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => viewProjectFiles(project)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Voir les fichiers
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* View Project Files Dialog */}
            {selectedProject && (
              <Dialog
                open={!!selectedProject}
                onOpenChange={(open) => !open && setSelectedProject(null)}
              >
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>
                      Fichiers du projet: {selectedProject.title}
                    </DialogTitle>
                    <DialogDescription>
                      Status: {getStatusText(selectedProject.status)}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    {projectFiles.length === 0 ? (
                      <p className="text-center text-muted-foreground py-4">
                        Aucun fichier trouvé pour ce projet
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {projectFiles.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between p-3 rounded-md border"
                          >
                            <div className="flex items-center">
                              <FileIcon fileName={file.file_name} />
                              <span>{file.file_name}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                              title="Télécharger"
                            >
                              <a
                                href={file.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Download className="h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProjectsPage;
