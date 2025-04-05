
import React, { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, Save, BookOpen } from "lucide-react";
import { saveExerciseNote, getExerciseNote } from '@/utils/noteStorage';
import { useAuthState } from '@/hooks/useAuthState';
import { toast } from 'sonner';

interface NoteEditorProps {
  exerciseId: string;
  title?: string;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ exerciseId, title }) => {
  const [note, setNote] = useState('');
  const [isSaving, setSaving] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const { user } = useAuthState();
  
  useEffect(() => {
    const loadNote = async () => {
      if (!user || !exerciseId) return;
      
      try {
        setLoading(true);
        const { success, data } = await getExerciseNote(user.id, exerciseId);
        
        if (success && data) {
          setNote(data.content);
        }
      } catch (error) {
        console.error('Error loading note:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadNote();
  }, [exerciseId, user]);
  
  const handleSaveNote = async () => {
    if (!user) {
      toast.error('Vous devez être connecté pour enregistrer des notes');
      return;
    }
    
    try {
      setSaving(true);
      const { success, error } = await saveExerciseNote(user.id, exerciseId, note);
      
      if (success) {
        toast.success('Note sauvegardée avec succès');
      } else {
        toast.error('Erreur lors de la sauvegarde de la note');
        console.error('Save error:', error);
      }
    } catch (error) {
      console.error('Exception when saving note:', error);
      toast.error('Erreur lors de la sauvegarde de la note');
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <Card className="mb-4 border-t-2 border-t-amber-400">
      <CardHeader className="bg-amber-50 dark:bg-amber-900/20 pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          {title || "Vos notes pour cet exercice"}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Textarea
            placeholder="Écrivez vos notes, astuces, ou rappels pour cet exercice ici..."
            className="min-h-32"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-end bg-amber-50/50 dark:bg-amber-900/10">
        <Button
          onClick={handleSaveNote}
          disabled={isSaving || isLoading}
          className="flex gap-2 items-center"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Sauvegarder
        </Button>
      </CardFooter>
    </Card>
  );
};
