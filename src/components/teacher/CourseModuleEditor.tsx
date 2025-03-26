
import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, GripVertical, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { toast } from "sonner";
import { CourseModule } from "@/types/course";

interface CourseModuleEditorProps {
  courseId: string;
  modules: CourseModule[];
  onModulesChange: (modules: CourseModule[]) => void;
}

export const CourseModuleEditor = ({ 
  courseId, 
  modules = [], 
  onModulesChange 
}: CourseModuleEditorProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleModuleExpansion = (moduleId: string) => {
    setExpanded(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const handleAddModule = () => {
    const newModule: CourseModule = {
      id: `temp-${Date.now()}`, // Will be replaced with real ID from backend
      title: "New Module",
      description: "",
      order_index: modules.length,
      lessons: []
    };
    
    const updatedModules = [...modules, newModule];
    onModulesChange(updatedModules);
    
    // Auto-expand the new module
    setExpanded(prev => ({
      ...prev,
      [newModule.id]: true
    }));
  };

  const handleRemoveModule = (moduleId: string) => {
    const updatedModules = modules.filter(module => module.id !== moduleId);
    // Update order_index for remaining modules
    updatedModules.forEach((module, index) => {
      module.order_index = index;
    });
    onModulesChange(updatedModules);
  };

  const handleModuleChange = (moduleId: string, field: string, value: any) => {
    const updatedModules = modules.map(module => {
      if (module.id === moduleId) {
        return { ...module, [field]: value };
      }
      return module;
    });
    onModulesChange(updatedModules);
  };

  const handleAddLesson = (moduleId: string) => {
    const updatedModules = modules.map(module => {
      if (module.id === moduleId) {
        const lessons = module.lessons || [];
        return {
          ...module,
          lessons: [
            ...lessons,
            {
              id: `temp-lesson-${Date.now()}`, // Will be replaced with real ID from backend
              title: "New Lesson",
              content: "",
              order_index: lessons.length,
              module_id: moduleId
            }
          ]
        };
      }
      return module;
    });
    onModulesChange(updatedModules);
  };

  const handleRemoveLesson = (moduleId: string, lessonId: string) => {
    const updatedModules = modules.map(module => {
      if (module.id === moduleId) {
        const filteredLessons = (module.lessons || []).filter(
          lesson => lesson.id !== lessonId
        );
        // Update order_index for remaining lessons
        filteredLessons.forEach((lesson, index) => {
          lesson.order_index = index;
        });
        return { ...module, lessons: filteredLessons };
      }
      return module;
    });
    onModulesChange(updatedModules);
  };

  const handleLessonChange = (moduleId: string, lessonId: string, field: string, value: any) => {
    const updatedModules = modules.map(module => {
      if (module.id === moduleId) {
        const updatedLessons = (module.lessons || []).map(lesson => {
          if (lesson.id === lessonId) {
            return { ...lesson, [field]: value };
          }
          return lesson;
        });
        return { ...module, lessons: updatedLessons };
      }
      return module;
    });
    onModulesChange(updatedModules);
  };

  const moveModule = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    
    const updatedModules = [...modules];
    const [movedModule] = updatedModules.splice(fromIndex, 1);
    updatedModules.splice(toIndex, 0, movedModule);
    
    // Update order_index for all modules
    updatedModules.forEach((module, index) => {
      module.order_index = index;
    });
    
    onModulesChange(updatedModules);
  };

  const moveLesson = (moduleId: string, fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    
    const updatedModules = modules.map(module => {
      if (module.id === moduleId) {
        const updatedLessons = [...(module.lessons || [])];
        const [movedLesson] = updatedLessons.splice(fromIndex, 1);
        updatedLessons.splice(toIndex, 0, movedLesson);
        
        // Update order_index for all lessons
        updatedLessons.forEach((lesson, index) => {
          lesson.order_index = index;
        });
        
        return { ...module, lessons: updatedLessons };
      }
      return module;
    });
    
    onModulesChange(updatedModules);
  };

  const handleDragEnd = (result: any) => {
    const { source, destination, type } = result;
    
    // Dropped outside the list
    if (!destination) return;
    
    // No change
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    
    // Module reordering
    if (type === 'MODULE') {
      moveModule(source.index, destination.index);
      return;
    }
    
    // Lesson reordering within the same module
    if (type === 'LESSON' && source.droppableId === destination.droppableId) {
      moveLesson(source.droppableId, source.index, destination.index);
      return;
    }
    
    // Moving a lesson between modules is more complex and not implemented here
    if (type === 'LESSON' && source.droppableId !== destination.droppableId) {
      toast.error("Moving lessons between modules is not supported yet");
      return;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Course Modules</h3>
        <Button 
          onClick={handleAddModule} 
          variant="outline" 
          size="sm"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Module
        </Button>
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="modules" type="MODULE">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {modules.length === 0 ? (
                <Card className="bg-muted/30 border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <p className="text-muted-foreground mb-4">No modules yet. Add your first module to get started.</p>
                    <Button onClick={handleAddModule} variant="outline">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create First Module
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                modules.map((module, index) => (
                  <Draggable
                    key={module.id}
                    draggableId={module.id}
                    index={index}
                  >
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="border-l-4 border-l-primary"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center">
                            <div
                              {...provided.dragHandleProps}
                              className="mr-2 text-muted-foreground cursor-move"
                            >
                              <GripVertical className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <Input
                                  value={module.title}
                                  onChange={(e) => handleModuleChange(module.id, 'title', e.target.value)}
                                  placeholder="Module Title"
                                  className="font-medium text-base border-none px-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 w-auto"
                                />
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => toggleModuleExpansion(module.id)}
                                  >
                                    {expanded[module.id] ? (
                                      <ChevronUp className="h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4" />
                                    )}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveModule(module.id)}
                                    className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        
                        {expanded[module.id] && (
                          <>
                            <CardContent className="pb-3">
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-xs text-muted-foreground">Module Description</Label>
                                  <Textarea
                                    value={module.description || ""}
                                    onChange={(e) => handleModuleChange(module.id, 'description', e.target.value)}
                                    placeholder="Describe what students will learn in this module"
                                    className="mt-1 min-h-[80px]"
                                  />
                                </div>
                                
                                <Separator />
                                
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <Label className="text-sm font-medium">Lessons</Label>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleAddLesson(module.id)}
                                    >
                                      <PlusCircle className="h-3.5 w-3.5 mr-1" />
                                      Add Lesson
                                    </Button>
                                  </div>
                                  
                                  <Droppable droppableId={module.id} type="LESSON">
                                    {(provided) => (
                                      <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="space-y-2"
                                      >
                                        {(module.lessons || []).length === 0 ? (
                                          <p className="text-sm text-muted-foreground italic">
                                            No lessons yet. Add your first lesson to this module.
                                          </p>
                                        ) : (
                                          (module.lessons || []).map((lesson, lessonIndex) => (
                                            <Draggable
                                              key={lesson.id}
                                              draggableId={lesson.id}
                                              index={lessonIndex}
                                            >
                                              {(provided) => (
                                                <div
                                                  ref={provided.innerRef}
                                                  {...provided.draggableProps}
                                                  className="border rounded-md p-3 bg-background"
                                                >
                                                  <div className="flex items-center">
                                                    <div
                                                      {...provided.dragHandleProps}
                                                      className="mr-2 text-muted-foreground cursor-move"
                                                    >
                                                      <GripVertical className="h-4 w-4" />
                                                    </div>
                                                    <Input
                                                      value={lesson.title}
                                                      onChange={(e) => handleLessonChange(module.id, lesson.id, 'title', e.target.value)}
                                                      placeholder="Lesson Title"
                                                      className="flex-1 h-8 text-sm border-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                                    />
                                                    <Button
                                                      variant="ghost"
                                                      size="icon"
                                                      onClick={() => handleRemoveLesson(module.id, lesson.id)}
                                                      className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                                    >
                                                      <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                  </div>
                                                </div>
                                              )}
                                            </Draggable>
                                          ))
                                        )}
                                        {provided.placeholder}
                                      </div>
                                    )}
                                  </Droppable>
                                </div>
                              </div>
                            </CardContent>
                          </>
                        )}
                      </Card>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
