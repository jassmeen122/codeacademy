import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UniversalContentEditor } from './UniversalContentEditor';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  Dumbbell, 
  CheckCircle,
  Clock,
  Code2
} from 'lucide-react';

interface ExerciseContent {
  id: string;
  title: string;
  description: string;
  content: string;
  exercise_type: string;
  difficulty: string;
  language: string;
  starter_code: string;
  expected_output: string;
  hints: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export const ExerciseContentManager = () => {
  const [exercises, setExercises] = useState<ExerciseContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingExercise, setEditingExercise] = useState<ExerciseContent | null>(null);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Vous devez être connecté');
        return;
      }

      const { data, error } = await supabase
        .from('exercise_content')
        .select('*')
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setExercises(data || []);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      toast.error('Erreur lors du chargement des exercices');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveExercise = async (exerciseData: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Vous devez être connecté');
        return;
      }

      if (editingExercise) {
        // Update existing exercise
        const { error } = await supabase
          .from('exercise_content')
          .update({
            title: exerciseData.title,
            description: exerciseData.description,
            content: exerciseData.content,
            exercise_type: exerciseData.exercise_type,
            difficulty: exerciseData.difficulty,
            language: exerciseData.language,
            starter_code: exerciseData.starter_code,
            expected_output: exerciseData.expected_output,
            hints: exerciseData.hints,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingExercise.id);
        
        if (error) throw error;
        toast.success('Exercice mis à jour');
      } else {
        // Create new exercise
        const { error } = await supabase
          .from('exercise_content')
          .insert({
            teacher_id: user.id,
            title: exerciseData.title,
            description: exerciseData.description,
            content: exerciseData.content,
            exercise_type: exerciseData.exercise_type,
            difficulty: exerciseData.difficulty,
            language: exerciseData.language,
            starter_code: exerciseData.starter_code,
            expected_output: exerciseData.expected_output,
            hints: exerciseData.hints,
            is_published: false
          });
        
        if (error) throw error;
        toast.success('Exercice créé');
      }
      
      fetchExercises();
      setShowEditor(false);
      setEditingExercise(null);
    } catch (error) {
      console.error('Error saving exercise:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const togglePublished = async (exercise: ExerciseContent) => {
    try {
      const { error } = await supabase
        .from('exercise_content')
        .update({ is_published: !exercise.is_published })
        .eq('id', exercise.id);
      
      if (error) throw error;
      
      toast.success(exercise.is_published ? 'Exercice dépublié' : 'Exercice publié');
      fetchExercises();
    } catch (error) {
      console.error('Error toggling publish status:', error);
      toast.error('Erreur lors de la publication');
    }
  };

  const deleteExercise = async (exerciseId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet exercice ?')) return;
    
    try {
      const { error } = await supabase
        .from('exercise_content')
        .delete()
        .eq('id', exerciseId);
      
      if (error) throw error;
      
      toast.success('Exercice supprimé');
      fetchExercises();
    } catch (error) {
      console.error('Error deleting exercise:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const getExerciseTypeLabel = (type: string) => {
    switch (type) {
      case 'coding': return 'Programmation';
      case 'quiz': return 'Quiz';
      case 'assignment': return 'Devoir';
      default: return type;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>;
  }

  if (showEditor) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {editingExercise ? 'Modifier l\'exercice' : 'Nouvel exercice'}
          </h3>
          <Button
            variant="outline"
            onClick={() => {
              setShowEditor(false);
              setEditingExercise(null);
            }}
          >
            Annuler
          </Button>
        </div>
        
        <UniversalContentEditor
          contentType="exercise"
          onSave={handleSaveExercise}
          initialContent={editingExercise}
        />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            Mes Exercices
          </CardTitle>
          <Button onClick={() => setShowEditor(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvel Exercice
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {exercises.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Code2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Aucun exercice créé pour le moment</p>
            <p className="text-sm">Cliquez sur "Nouvel Exercice" pour commencer</p>
          </div>
        ) : (
          <div className="space-y-4">
            {exercises.map((exercise) => (
              <Card key={exercise.id} className="border">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-blue-100 text-blue-800">
                          {getExerciseTypeLabel(exercise.exercise_type)}
                        </Badge>
                        <Badge className={getDifficultyColor(exercise.difficulty)}>
                          {exercise.difficulty}
                        </Badge>
                        <Badge className="bg-purple-100 text-purple-800">
                          {exercise.language}
                        </Badge>
                        <Badge variant={exercise.is_published ? "default" : "secondary"}>
                          {exercise.is_published ? "Publié" : "Brouillon"}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-lg mb-2">{exercise.title}</h4>
                      {exercise.description && (
                        <p className="text-gray-600 mb-2 text-sm">{exercise.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            Créé le {new Date(exercise.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingExercise(exercise);
                          setShowEditor(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={exercise.is_published ? "secondary" : "default"}
                        size="sm"
                        onClick={() => togglePublished(exercise)}
                      >
                        {exercise.is_published ? (
                          <>
                            <Eye className="h-4 w-4 mr-1" />
                            Publié
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Publier
                          </>
                        )}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteExercise(exercise.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
