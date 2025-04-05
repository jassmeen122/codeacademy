
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, BookOpen, Trash2, Edit } from 'lucide-react';
import { useAuthState } from '@/hooks/useAuthState';
import { getUserNotes, deleteExerciseNote } from '@/utils/noteStorage';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Note {
  id: string;
  exercise_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  exercises: {
    title: string;
    description: string;
    difficulty: string;
  };
}

export const NotesTab: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuthState();
  
  const fetchNotes = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { success, data } = await getUserNotes(user.id);
      
      if (success && data) {
        setNotes(data);
      } else {
        setNotes([]);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Erreur lors du chargement des notes');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
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
  
  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      'Beginner': 'bg-green-100 text-green-800 border-green-200',
      'Intermediate': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Advanced': 'bg-orange-100 text-orange-800 border-orange-200',
      'Expert': 'bg-red-100 text-red-800 border-red-200'
    };
    
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };
  
  const filteredNotes = notes.filter(note => 
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
    note.exercises.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="bg-gradient-to-r from-amber-50 to-background">
        <CardTitle className="flex items-center text-2xl">
          <BookOpen className="h-6 w-6 mr-2 text-amber-600" />
          Vos Notes
        </CardTitle>
        <CardDescription className="text-base">
          Retrouvez toutes vos notes d'exercices pour faciliter votre révision
        </CardDescription>
      </CardHeader>
      
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher dans vos notes..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={fetchNotes} variant="outline" size="icon" title="Actualiser">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>}
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Chargement de vos notes...</p>
            </div>
          </div>
        ) : filteredNotes.length > 0 ? (
          <div className="space-y-4">
            {filteredNotes.map(note => (
              <div key={note.id} className="bg-white dark:bg-gray-800 rounded-lg border p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-lg">{note.exercises.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getDifficultyColor(note.exercises.difficulty)}>
                        {note.exercises.difficulty}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Modifié {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true, locale: fr })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" asChild>
                      <a href={`/student/exercises?exercise=${note.exercise_id}`}>
                        <Edit className="h-4 w-4" />
                      </a>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer cette note</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer cette note ? Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteNote(note.id)} className="bg-red-500 hover:bg-red-600">
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/20 p-3 rounded-md mt-2 whitespace-pre-wrap">
                  {note.content}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/20 rounded-lg">
            <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">
              {searchTerm ? "Aucune note ne correspond à votre recherche" : "Vous n'avez pas encore de notes"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              {searchTerm 
                ? "Essayez un terme de recherche différent ou effacez votre recherche pour voir toutes vos notes"
                : "Ajoutez des notes à vos exercices pour les retrouver facilement ici"
              }
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
