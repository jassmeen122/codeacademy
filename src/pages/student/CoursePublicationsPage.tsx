
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CoursePublicationCard } from '@/components/courses/CoursePublicationCard';
import { useCoursePublications } from '@/hooks/useCoursePublications';
import { BookOpen, Search, GraduationCap } from 'lucide-react';

const CoursePublicationsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [pathFilter, setPathFilter] = useState<string>('all');
  const navigate = useNavigate();
  
  const { courses, loading } = useCoursePublications();

  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.teacher_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDifficulty = difficultyFilter === 'all' || course.difficulty === difficultyFilter;
    const matchesPath = pathFilter === 'all' || course.path === pathFilter;

    return matchesSearch && matchesDifficulty && matchesPath;
  });

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-indigo-900 to-blue-800 text-white rounded-xl p-8 mb-8 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center mb-2">
                <BookOpen className="mr-3 h-7 w-7" />
                📚 Mes Cours
              </h1>
              <p className="text-indigo-100 max-w-2xl">
                Découvrez tous les cours publiés par vos professeurs et apprenez à votre rythme
              </p>
            </div>
            <Button 
              className="mt-4 md:mt-0 bg-white text-indigo-900 hover:bg-indigo-100"
              onClick={() => navigate('/student')}
            >
              <GraduationCap className="mr-2 h-4 w-4" />
              Tableau de Bord
            </Button>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher par titre, description ou professeur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les niveaux</SelectItem>
              <SelectItem value="Beginner">Débutant</SelectItem>
              <SelectItem value="Intermediate">Intermédiaire</SelectItem>
              <SelectItem value="Advanced">Avancé</SelectItem>
            </SelectContent>
          </Select>

          <Select value={pathFilter} onValueChange={setPathFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Parcours" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les parcours</SelectItem>
              <SelectItem value="Web Development">Développement Web</SelectItem>
              <SelectItem value="Data Science">Data Science</SelectItem>
              <SelectItem value="Artificial Intelligence">Intelligence Artificielle</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Liste des cours */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200" />
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {courses.length === 0 ? 'Aucun cours publié' : 'Aucun cours trouvé'}
              </h3>
              <p className="text-muted-foreground">
                {courses.length === 0 
                  ? 'Aucun cours n\'a encore été publié par les professeurs.'
                  : 'Aucun cours ne correspond à vos critères de recherche.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CoursePublicationCard
                key={course.id}
                course={course}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CoursePublicationsPage;
