
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthState } from '@/hooks/useAuthState';
import { getUserNotes, deleteExerciseNote, ExerciseNote } from '@/utils/noteStorage';
import { BookOpen, Search, Trash2, Edit, FileText, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PointsDisplay } from '../progress/PointsDisplay';
import { RecentActivities } from '../progress/RecentActivities';

export const NotesTab: React.FC = () => {
  const { user } = useAuthState();
  const [notes, setNotes] = useState<ExerciseNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);
  
  const fetchNotes = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const result = await getUserNotes(user.id);
      if (result.success && result.data) {
        setNotes(result.data);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Échec du chargement des notes');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteNote = async (noteId: string) => {
    if (!user) return;
    
    try {
      const result = await deleteExerciseNote(user.id, noteId);
      if (result.success) {
        toast.success('Note supprimée');
        setNotes(notes.filter((note) => note.id !== noteId));
      } else {
        throw new Error('Failed to delete note');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Échec de la suppression de la note');
    }
  };
  
  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-3/4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Mes Notes
                </CardTitle>
                <Button size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  Nouvelle Note
                </Button>
              </div>
              <div className="relative mt-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher dans vos notes..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="all" className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    Toutes
                  </TabsTrigger>
                  <TabsTrigger value="recent" className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    Récentes
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-0">
                  <div className="space-y-3">
                    {loading ? (
                      Array(3).fill(0).map((_, i) => (
                        <div key={i} className="border rounded-lg p-4 space-y-3">
                          <div className="flex justify-between">
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-6 w-24" />
                          </div>
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                      ))
                    ) : filteredNotes.length > 0 ? (
                      filteredNotes.map((note) => (
                        <div key={note.id} className="border rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex justify-between">
                            <div className="font-medium">
                              {note.exercises?.title || `Note du ${format(new Date(note.created_at), 'dd/MM/yyyy')}`}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {format(new Date(note.updated_at), 'dd/MM/yyyy HH:mm')}
                              </Badge>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteNote(note.id)} className="h-7 w-7">
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mt-2 line-clamp-3">{note.content}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <BookOpen className="h-12 w-12 mx-auto text-gray-400" />
                        <h3 className="mt-3 text-lg font-medium">Aucune note trouvée</h3>
                        <p className="mt-1">Ajoutez des notes en cliquant sur le bouton "Nouvelle Note"</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="recent" className="mt-0">
                  <div className="space-y-3">
                    {loading ? (
                      Array(3).fill(0).map((_, i) => (
                        <div key={i} className="border rounded-lg p-4 space-y-3">
                          <div className="flex justify-between">
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-6 w-24" />
                          </div>
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                      ))
                    ) : (
                      filteredNotes.slice(0, 5).map((note) => (
                        <div key={note.id} className="border rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex justify-between">
                            <div className="font-medium">
                              {note.exercises?.title || `Note du ${format(new Date(note.created_at), 'dd/MM/yyyy')}`}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {format(new Date(note.updated_at), 'dd/MM/yyyy HH:mm')}
                              </Badge>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteNote(note.id)} className="h-7 w-7">
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mt-2 line-clamp-3">{note.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full md:w-1/4 space-y-6">
          <PointsDisplay showDetails={false} />
          <RecentActivities limit={3} />
        </div>
      </div>
    </div>
  );
};
