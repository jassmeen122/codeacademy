
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Exercise, ExerciseTabValue } from "@/types/exercise";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ExerciseCard } from "./ExerciseCard";

interface ExerciseTabsProps {
  currentTab: ExerciseTabValue;
  onTabChange: (value: ExerciseTabValue) => void;
  filteredExercises: Exercise[];
  loading: boolean;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Exercise["status"]) => void;
}

export const ExerciseTabs = ({
  currentTab,
  onTabChange,
  filteredExercises,
  loading,
  onDelete,
  onStatusChange
}: ExerciseTabsProps) => {
  const navigate = useNavigate();

  return (
    <Tabs defaultValue="all" value={currentTab} onValueChange={(value) => onTabChange(value as ExerciseTabValue)}>
      <TabsList className="mb-6">
        <TabsTrigger value="all">All Exercises</TabsTrigger>
        <TabsTrigger value="published">Published</TabsTrigger>
        <TabsTrigger value="draft">Drafts</TabsTrigger>
        <TabsTrigger value="archived">Archived</TabsTrigger>
      </TabsList>

      <TabsContent value={currentTab}>
        {loading ? (
          <div className="text-center py-8">Loading exercises...</div>
        ) : filteredExercises.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No exercises found in this category.</p>
              <Button onClick={() => navigate("/teacher/exercises/create")}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Your First Exercise
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercises.map((exercise) => (
              <ExerciseCard 
                key={exercise.id}
                exercise={exercise}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
              />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};
