
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const CoursePreview = () => {
  const navigate = useNavigate();
  
  const languages = [
    { name: "Python", description: "Langage polyvalent, idéal pour les débutants" },
    { name: "JavaScript", description: "Essentiel pour le développement web moderne" },
    { name: "Java", description: "Populaire pour les applications d'entreprise et Android" },
    { name: "SQL", description: "Indispensable pour travailler avec des bases de données" }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl font-bold mb-6">Langages de programmation disponibles</h2>
            <p className="text-gray-600 mb-8">
              Notre plateforme propose des cours complets sur les langages de programmation les plus demandés sur le marché du travail. Chaque cours est conçu pour vous aider à maîtriser le langage et à l'appliquer dans des projets concrets.
            </p>
            
            <ul className="space-y-4 mb-8">
              {languages.map((lang, index) => (
                <li key={index} className="flex items-start">
                  <div className="bg-primary/10 text-primary rounded-full p-1 mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">{lang.name}</span> - {lang.description}
                  </div>
                </li>
              ))}
            </ul>
            
            <Button onClick={() => navigate("/auth")} className="bg-primary hover:bg-primary/90">
              Explorer tous les cours
            </Button>
          </div>
          
          <div className="w-full lg:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80" 
              alt="Programming" 
              className="rounded-lg shadow-lg w-full object-cover h-[400px]" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};
