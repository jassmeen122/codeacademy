
import React from "react";
import { Search, Filter, Star, Code } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

interface ExerciseFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (difficulty: string) => void;
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
  themes: string[];
  exerciseProgress: number;
}

export const ExerciseFilters: React.FC<ExerciseFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedLanguage,
  setSelectedLanguage,
  selectedDifficulty,
  setSelectedDifficulty,
  selectedTheme,
  setSelectedTheme,
  themes,
  exerciseProgress
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-grow">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Rechercher par titre, description ou mot-clé..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Langage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les langages</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="c">C</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-[150px]">
              <Star className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Difficulté" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les difficultés</SelectItem>
              <SelectItem value="Beginner">Débutant</SelectItem>
              <SelectItem value="Intermediate">Intermédiaire</SelectItem>
              <SelectItem value="Advanced">Avancé</SelectItem>
              <SelectItem value="Expert">Expert</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedTheme} onValueChange={setSelectedTheme}>
            <SelectTrigger className="w-[150px]">
              <Code className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Thème" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les thèmes</SelectItem>
              {themes.map(theme => (
                <SelectItem key={theme} value={theme}>{theme}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Progression globale</h2>
        <div className="flex items-center gap-3">
          <Progress value={exerciseProgress} className="h-2 flex-grow" />
          <span className="text-sm font-medium">{Math.round(exerciseProgress)}%</span>
        </div>
      </div>
    </div>
  );
};
