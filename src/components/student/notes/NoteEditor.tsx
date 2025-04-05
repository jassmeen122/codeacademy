
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useAuthState } from '@/hooks/useAuthState';
import { saveExerciseNote, getExerciseNote } from '@/utils/noteStorage';
import { toast } from 'sonner';
import { usePoints } from '@/hooks/usePoints';

interface NoteEditorProps {
  exerciseId: string;
  exerciseTitle?: string;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ exerciseId, exerciseTitle }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [noteExists, setNoteExists] = useState(false);
  const { user } = useAuthState();
  const { addPoints } = usePoints();
  
  useEffect(() => {
    if (user && exerciseId) {
      fetchExistingNote();
    }
  }, [user, exerciseId]);
  
  const fetchExistingNote = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const result = await getExerciseNote(user.id, exerciseId);
      if (result.success && result.data) {
        setContent(result.data.content);
        setNoteExists(true);
      }
    } catch (error) {
      console.error('Error fetching note:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveNote = async () => {
    if (!user || !content.trim()) return;
    
    setLoading(true);
    try {
      const result = await saveExerciseNote(user.id, exerciseId, content);
      if (result.success) {
        toast.success(noteExists ? 'Note mise à jour' : 'Note sauvegardée');
        
        // Award points only for new notes
        if (!noteExists) {
          await addPoints('notes_created', exerciseId);
          setNoteExists(true);
        }
      } else {
        throw new Error('Failed to save note');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Échec de la sauvegarde de la note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">
          {exerciseTitle ? `Notes pour: ${exerciseTitle}` : 'Mes Notes'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Saisissez vos notes ici..."
          className="min-h-[200px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
        />
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t pt-3">
        <p className="text-xs text-gray-500">
          {noteExists ? 'Dernière modification: ' + new Date().toLocaleString() : 'Nouvelle note'}
        </p>
        <Button onClick={handleSaveNote} disabled={loading || !content.trim()}>
          {loading ? 'Enregistrement...' : (noteExists ? 'Mettre à jour' : 'Enregistrer')}
        </Button>
      </CardFooter>
    </Card>
  );
};
