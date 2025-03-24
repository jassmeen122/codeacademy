
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useProgrammingLanguages } from '@/hooks/useProgrammingCourses';
import { LanguageCard } from '@/components/courses/LanguageCard';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LanguagesPage = () => {
  const { languages, loading } = useProgrammingLanguages();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLanguages, setFilteredLanguages] = useState(languages);
  const navigate = useNavigate();

  useEffect(() => {
    if (languages && languages.length > 0) {
      const filtered = languages.filter(lang => 
        lang.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLanguages(filtered);
    }
  }, [languages, searchTerm]);

  const handleLanguageClick = (languageId: string) => {
    navigate(`/student/languages/${languageId}/detail`);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Langages de Programmation</h1>
            <p className="text-gray-600">Explorez et apprenez différents langages de programmation</p>
          </div>
          <Button onClick={() => navigate('/student/language-selection')}>
            Cours Simplifiés
          </Button>
        </div>
        
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Rechercher un langage..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-40 bg-gray-200 rounded-t-md" />
                <div className="p-4 border border-gray-200 border-t-0 rounded-b-md">
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-3" />
                  <div className="h-4 bg-gray-100 rounded mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-10 bg-gray-200 rounded mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredLanguages && filteredLanguages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLanguages.map((language) => (
              <div 
                key={language.id} 
                onClick={() => handleLanguageClick(language.id)}
                className="cursor-pointer"
              >
                <LanguageCard language={language} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-medium text-gray-800 mb-2">Aucun langage trouvé</h3>
            <p className="text-gray-500">
              {searchTerm ? `Aucun langage ne correspond à "${searchTerm}".` : "Aucun langage n'est disponible pour le moment."}
            </p>
            {searchTerm && (
              <Button
                variant="outline"
                onClick={() => setSearchTerm("")}
                className="mt-4"
              >
                Effacer la recherche
              </Button>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LanguagesPage;
