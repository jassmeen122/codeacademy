
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Code, Terminal, Braces, Database, Globe, Cpu } from "lucide-react";

export const LanguagesSection: React.FC = () => {
  const navigate = useNavigate();
  
  const languages = [
    { 
      name: "Python", 
      icon: <Terminal className="h-8 w-8 text-blue-600" />,
      description: "IA & Data Science",
      students: "2.5k+ étudiants",
      level: "Débutant à Expert"
    },
    { 
      name: "JavaScript", 
      icon: <Braces className="h-8 w-8 text-green-600" />,
      description: "Développement Web",
      students: "3.2k+ étudiants",
      level: "Tous niveaux"
    },
    { 
      name: "Java", 
      icon: <Cpu className="h-8 w-8 text-red-600" />,
      description: "Applications Enterprise",
      students: "1.8k+ étudiants",
      level: "Intermédiaire"
    },
    { 
      name: "PHP", 
      icon: <Globe className="h-8 w-8 text-purple-600" />,
      description: "Backend Web",
      students: "1.5k+ étudiants",
      level: "Débutant"
    },
    { 
      name: "C++", 
      icon: <Code className="h-8 w-8 text-gray-700" />,
      description: "Systèmes & Performance",
      students: "900+ étudiants",
      level: "Avancé"
    },
    { 
      name: "SQL", 
      icon: <Database className="h-8 w-8 text-orange-600" />,
      description: "Bases de données",
      students: "2.1k+ étudiants",
      level: "Essentiel"
    }
  ];
  
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Langages de Programmation
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Choisissez parmi notre sélection de langages modernes et apprenez avec des cours structurés, 
            des exercices pratiques et des projets concrets.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {languages.map((lang, i) => (
            <Card key={i} 
              className="edu-card cursor-pointer group bg-white border-gray-200 hover:border-blue-300 transition-all duration-300"
              onClick={() => navigate("/auth")}
            >
              <CardContent className="p-8 text-center">
                <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                  {lang.icon}
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                  {lang.name}
                </h3>
                <p className="text-gray-600 mb-4 font-medium">
                  {lang.description}
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center justify-between">
                    <span>Étudiants:</span>
                    <span className="font-medium text-blue-600">{lang.students}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Niveau:</span>
                    <span className="font-medium text-green-600">{lang.level}</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <span className="text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors">
                    Commencer le cours →
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
