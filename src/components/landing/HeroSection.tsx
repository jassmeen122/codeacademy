
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Code2, Sparkles, Zap, BookOpen, Users, Award } from "lucide-react";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 mb-8">
            <BookOpen className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-600">Plateforme d'apprentissage en ligne</span>
          </div>

          {/* Titre principal */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-black">
            CodeAcademy
            <br />
            <span className="text-blue-500">Intelligence</span>
          </h1>

          {/* Sous-titre */}
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Apprenez la programmation avec notre plateforme moderne et intuitive. 
            Des cours structurés, des exercices pratiques et un suivi personnalisé.
          </p>

          {/* Description */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-12 max-w-2xl mx-auto">
            <p className="text-lg text-black">
              Maîtrisez <span className="text-blue-500 font-semibold">Python</span>, 
              <span className="text-blue-500 font-semibold"> JavaScript</span>, 
              <span className="text-blue-500 font-semibold"> Java</span> et bien plus 
              avec des cours interactifs et des projets concrets.
            </p>
          </div>

          {/* Boutons CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              size="lg"
              className="text-lg px-8 py-3"
              onClick={() => navigate("/auth")}
            >
              <Zap className="h-5 w-5 mr-2" />
              Commencer maintenant
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-3"
              onClick={() => navigate("/auth")}
            >
              <Code2 className="h-5 w-5 mr-2" />
              Explorer les cours
            </Button>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { number: "10+", label: "Langages de Programmation", icon: Code2 },
              { number: "50+", label: "Projets Pratiques", icon: Award },
              { number: "24/7", label: "Support Disponible", icon: Users }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="mb-4 inline-block p-3 bg-blue-50 rounded-full">
                    <stat.icon className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="text-3xl font-bold text-black mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
