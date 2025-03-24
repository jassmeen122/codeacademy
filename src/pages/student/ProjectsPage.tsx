
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Folder, GitBranch, Star, Users } from "lucide-react";

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  collaborators: number;
  status: "in_progress" | "completed" | "archived";
}

const projects: Project[] = [
  {
    id: 1,
    title: "E-commerce Website",
    description: "A full-stack e-commerce website with React and Node.js",
    technologies: ["React", "Node.js", "PostgreSQL"],
    collaborators: 3,
    status: "in_progress",
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

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Projects</h1>
          <Button>
            <Folder className="mr-2 h-4 w-4" />
            New Project
          </Button>
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
                    <span>{project.collaborators} collaborators</span>
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
