
import React, { useState, useEffect } from 'react';
import { getUserNotes, deleteExerciseNote } from '@/utils/noteStorage';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Trash2, ExternalLink, Calendar } from 'lucide-react';
import { useAuthState } from '@/hooks/useAuthState';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export const NotesTab: React.FC = () => {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthState();
  
  useEffect(() => {
    const fetchNotes = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { success, data } = await getUserNotes(user.id);
        
        if (success && data) {
          setNotes(data);
        }
      } catch (error) {
        console.error('Error fetching notes:', error);
        toast.error('Impossible de charger vos notes');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotes();
  }, [user]);
  
  const handleDeleteNote = async (noteId: string) => {
    if (!user) return;
    
    try {
      const { success } = await deleteExerciseNote(user.id, noteId);
      
      if (success) {
        setNotes(notes.filter(note => note.id !== noteId));
        toast.success('Note supprimée avec succès');
      } else {
        toast.error('Erreur lors de la suppression de la note');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Erreur lors de la suppression de la note');
    }
  };
  
  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-6">Vos notes</h2>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="mb-4">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
  
  if (notes.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-6">Vos notes</h2>
        <Card className="text-center p-6">
          <CardContent>
            <p className="text-muted-foreground my-6">
              Vous n'avez pas encore créé de notes. Créez des notes pendant vos exercices pour les retrouver ici.
            </p>
            <Button asChild>
              <Link to="/student/exercises">
                Explorer les exercices
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Vos notes ({notes.length})</h2>
      
      {notes.map((note) => (
        <Card key={note.id} className="mb-4">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle>{note.exercises?.title || 'Exercice sans titre'}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteNote(note.id)}
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {note.updated_at && format(new Date(note.updated_at), 'dd/MM/yyyy HH:mm')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap bg-muted p-4 rounded-md text-sm">
              {note.content}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" asChild>
              <Link to={`/student/exercises/${note.exercise_id}`}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Voir l'exercice
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
