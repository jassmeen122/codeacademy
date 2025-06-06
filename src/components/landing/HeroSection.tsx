
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Code2, BookOpen, Users, Award, Zap, Play } from "lucide-react";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-20 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge professionnel */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 mb-8 animate-fade-in">
            <BookOpen className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Plateforme d'apprentissage professionnel</span>
          </div>

          {/* Titre principal */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 animate-fade-in">
            Académie de
            <br />
            <span className="text-blue-600">Développement</span>
          </h1>

          {/* Sous-titre */}
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in">
            Apprenez la programmation avec notre plateforme moderne et structurée. 
            Des cours professionnels, des exercices pratiques et un suivi personnalisé pour devenir développeur.
          </p>

          {/* Description des compétences */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-12 max-w-4xl mx-auto shadow-professional animate-slide-up">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Maîtrisez les technologies modernes</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2 text-blue-600 font-medium">
                <Code2 className="h-4 w-4" />
                Python
              </div>
              <div className="flex items-center gap-2 text-blue-600 font-medium">
                <Code2 className="h-4 w-4" />
                JavaScript
              </div>
              <div className="flex items-center gap-2 text-blue-600 font-medium">
                <Code2 className="h-4 w-4" />
                Java
              </div>
              <div className="flex items-center gap-2 text-blue-600 font-medium">
                <Code2 className="h-4 w-4" />
                Bases de données
              </div>
            </div>
          </div>

          {/* Boutons CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-slide-up">
            <Button
              size="lg"
              className="text-lg px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
              onClick={() => navigate("/auth")}
            >
              <Play className="h-5 w-5 mr-2" />
              Commencer l'apprentissage
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl"
              onClick={() => navigate("/auth")}
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Explorer les cours
            </Button>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-slide-up">
            {[
              { 
                number: "12+", 
                label: "Langages enseignés", 
                icon: Code2,
                description: "Technologies modernes"
              },
              { 
                number: "50+", 
                label: "Projets pratiques", 
                icon: Award,
                description: "Expérience concrète"
              },
              { 
                number: "24/7", 
                label: "Support disponible", 
                icon: Users,
                description: "Accompagnement continu"
              }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-professional hover:shadow-professional-lg transition-all duration-300 edu-card">
                  <div className="mb-4 inline-block p-4 bg-blue-50 rounded-xl">
                    <stat.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="font-semibold text-gray-700 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-sm text-gray-500">
                    {stat.description}
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
