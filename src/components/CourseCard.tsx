
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Clock, Users, BarChart, Folder, FileVideo, FileText, Layout, User, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Course } from "@/types/course";

interface CourseResource {
  id: string;
  title: string;
  description: string | null;
  type: 'video' | 'pdf' | 'presentation';
  file_url: string;
  order_index: number;
}

const CourseCard = ({ 
  id,
  title, 
  description, 
  duration, 
  students, 
  image,
  difficulty,
  category,
  path,
  materials,
  professor,
  language
}: Course) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [resources, setResources] = useState<CourseResource[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isDialogOpen) {
      fetchCourseResources();
    }
  }, [isDialogOpen]);

  const fetchCourseResources = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('course_resources')
      .select('*')
      .eq('course_id', id)
      .order('order_index');

    if (error) {
      console.error('Error fetching course resources:', error);
    } else if (data) {
      // Type check and filter the data to ensure it matches our CourseResource interface
      const validResources = data.filter((resource): resource is CourseResource => {
        return (
          typeof resource.type === 'string' && 
          ['video', 'pdf', 'presentation'].includes(resource.type)
        );
      });
      setResources(validResources);
    }
    setLoading(false);
  };

  const difficultyColor = {
    Beginner: "text-green-600 bg-green-50",
    Intermediate: "text-yellow-600 bg-yellow-50",
    Advanced: "text-red-600 bg-red-50"
  }[difficulty];

  const pathColor = {
    "Web Development": "text-blue-600 bg-blue-50",
    "Data Science": "text-purple-600 bg-purple-50",
    "Artificial Intelligence": "text-indigo-600 bg-indigo-50"
  }[path];

  const ResourceIcon = {
    video: FileVideo,
    pdf: FileText,
    presentation: Layout
  };

  return (
    <>
      <Card className="overflow-hidden transition-all hover:scale-[1.02] hover:-translate-y-1 duration-300 animate-fadeIn glass-card">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full transition-transform hover:scale-105 duration-700"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className={`px-2 py-1 rounded-md text-xs font-medium ${difficultyColor}`}>
              {difficulty}
            </span>
            <span className={`px-2 py-1 rounded-md text-xs font-medium ${pathColor}`}>
              {path}
            </span>
          </div>
        </div>
        <CardHeader>
          <div className="flex items-center gap-2 text-sm text-primary mb-2">
            <User className="h-4 w-4" />
            {professor.name}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Folder className="h-4 w-4" />
            {category}
          </div>
          <CardTitle className="line-clamp-1 text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-2 mb-4">{description}</p>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {duration}
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {students} students
            </div>
            <div className="flex items-center">
              <BarChart className="h-4 w-4 mr-1" />
              {difficulty}
            </div>
          </div>
          {materials && (
            <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
              {materials.videos && (
                <div className="flex items-center">
                  <FileVideo className="h-4 w-4 mr-1" />
                  {materials.videos} videos
                </div>
              )}
              {materials.pdfs && (
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  {materials.pdfs} PDFs
                </div>
              )}
              {materials.presentations && (
                <div className="flex items-center">
                  <Layout className="h-4 w-4 mr-1" />
                  {materials.presentations} slides
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => setIsDialogOpen(true)}>
            Enroll Now
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Course Description</h3>
              <p className="text-muted-foreground">{description}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Course Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Programming Language</p>
                  <p className="text-muted-foreground">{language}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Category</p>
                  <p className="text-muted-foreground">{category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Learning Path</p>
                  <p className="text-muted-foreground">{path}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Difficulty Level</p>
                  <p className="text-muted-foreground">{difficulty}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Course Materials</h3>
              {loading ? (
                <p className="text-muted-foreground">Loading course materials...</p>
              ) : resources.length > 0 ? (
                <div className="space-y-4">
                  {(['video', 'pdf', 'presentation'] as const).map(type => {
                    const typeResources = resources.filter(r => r.type === type);
                    if (typeResources.length === 0) return null;

                    return (
                      <Card key={type}>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            {ResourceIcon[type] && 
                              React.createElement(ResourceIcon[type], {
                                className: "h-5 w-5"
                              })}
                            {type.charAt(0).toUpperCase() + type.slice(1)}s
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {typeResources.map(resource => (
                              <div key={resource.id} className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">{resource.title}</p>
                                  {resource.description && (
                                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                                  )}
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                  <a href={resource.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                    <Download className="h-4 w-4" />
                                    Download
                                  </a>
                                </Button>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground">No course materials available yet.</p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Instructor</h3>
              <div className="flex items-start gap-4">
                <div>
                  <p className="font-medium">{professor.name}</p>
                  <p className="text-sm text-muted-foreground">{professor.title}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button className="bg-primary hover:bg-primary/90">Confirm Enrollment</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CourseCard;
