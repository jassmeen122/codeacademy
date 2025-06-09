
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, X, FileText, Video } from 'lucide-react';
import { useCoursePublications } from '@/hooks/useCoursePublications';
import type { CourseLevel, CoursePath, CourseCategory } from '@/types/course';

const PublishCoursePage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [chapters, setChapters] = useState<string[]>([]);
  const [newChapter, setNewChapter] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [difficulty, setDifficulty] = useState<CourseLevel>('Beginner');
  const [path, setPath] = useState<CoursePath>('Web Development');
  const [category, setCategory] = useState<CourseCategory>('Programming Fundamentals');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { createCourse } = useCoursePublications();

  const addChapter = () => {
    if (newChapter.trim() && !chapters.includes(newChapter.trim())) {
      setChapters([...chapters, newChapter.trim()]);
      setNewChapter('');
    }
  };

  const removeChapter = (index: number) => {
    setChapters(chapters.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || !content.trim()) {
      return;
    }

    setLoading(true);

    const courseData = {
      title: title.trim(),
      description: description.trim(),
      content: content.trim(),
      chapters,
      file_url: fileUrl.trim() || undefined,
      video_url: videoUrl.trim() || undefined,
      difficulty,
      path,
      category
    };

    const result = await createCourse(courseData);
    
    if (result) {
      navigate('/teacher/courses');
    }
    
    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">📚 Publier un Nouveau Cours</h1>
          <Button variant="outline" onClick={() => navigate('/teacher/courses')}>
            Retour aux Cours
          </Button>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <BookOpen className="mr-2 h-6 w-6" />
              Publication du Cours
            </CardTitle>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Titre du cours *</Label>
                  <Input 
                    id="title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Chapitre 1 – Introduction à l'algorithmique" 
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description du cours *</Label>
                  <Textarea 
                    id="description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Résumé clair du contenu du cours" 
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="content">Contenu du cours *</Label>
                  <Textarea 
                    id="content" 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Contenu détaillé du cours (texte, instructions, exercices...)" 
                    className="min-h-[200px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="difficulty">Niveau</Label>
                    <Select value={difficulty} onValueChange={(value) => setDifficulty(value as CourseLevel)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Débutant</SelectItem>
                        <SelectItem value="Intermediate">Intermédiaire</SelectItem>
                        <SelectItem value="Advanced">Avancé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="path">Parcours</Label>
                    <Select value={path} onValueChange={(value) => setPath(value as CoursePath)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Web Development">Développement Web</SelectItem>
                        <SelectItem value="Data Science">Data Science</SelectItem>
                        <SelectItem value="Artificial Intelligence">Intelligence Artificielle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="category">Catégorie</Label>
                    <Select value={category} onValueChange={(value) => setCategory(value as CourseCategory)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Programming Fundamentals">Bases de Programmation</SelectItem>
                        <SelectItem value="Frontend Development">Développement Frontend</SelectItem>
                        <SelectItem value="Backend Development">Développement Backend</SelectItem>
                        <SelectItem value="Data Analysis">Analyse de Données</SelectItem>
                        <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                        <SelectItem value="AI Applications">Applications IA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Chapitres / Sous-parties</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={newChapter}
                        onChange={(e) => setNewChapter(e.target.value)}
                        placeholder="Nom du chapitre"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addChapter())}
                      />
                      <Button type="button" onClick={addChapter} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {chapters.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {chapters.map((chapter, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {chapter}
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => removeChapter(index)}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fileUrl">Lien vers fichier PDF (optionnel)</Label>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="fileUrl" 
                        value={fileUrl} 
                        onChange={(e) => setFileUrl(e.target.value)}
                        placeholder="https://example.com/cours.pdf" 
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="videoUrl">Lien vers vidéo (optionnel)</Label>
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="videoUrl" 
                        value={videoUrl} 
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://youtube.com/watch?v=..." 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between border-t bg-muted/20 px-6 py-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/teacher/courses')}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button 
                type="submit"
                disabled={loading || !title.trim() || !description.trim() || !content.trim()}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Publication...' : '📚 Publier le Cours'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PublishCoursePage;
