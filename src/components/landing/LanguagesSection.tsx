
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Code, Terminal, Braces, Database, Globe, Cpu } from "lucide-react";

export const LanguagesSection: React.FC = () => {
  const navigate = useNavigate();
  
  const languages = [
    { name: "Python", icon: <Terminal className="h-8 w-8 text-blue-500" /> },
    { name: "JavaScript", icon: <Braces className="h-8 w-8 text-yellow-500" /> },
    { name: "Java", icon: <Cpu className="h-8 w-8 text-red-500" /> },
    { name: "PHP", icon: <Globe className="h-8 w-8 text-purple-500" /> },
    { name: "C++", icon: <Code className="h-8 w-8 text-green-500" /> },
    { name: "SQL", icon: <Database className="h-8 w-8 text-orange-500" /> }
  ];
  
  return (
    <section className="py-16 bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
          <div className="relative">
            <div className="absolute -top-4 -left-4 animate-pulse opacity-70">
              <Terminal className="h-8 w-8 text-primary" />
            </div>
            <div className="bg-white p-6 rounded-full shadow-md border border-gray-200">
              <Code className="h-16 w-16 text-primary" />
            </div>
            <div className="absolute -bottom-4 -right-4 animate-pulse">
              <Braces className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Programming Languages</h2>
            <p className="text-gray-600 max-w-2xl">
              Our comprehensive courses cover all the major programming languages used in industry today.
              From web development to data science, we've got you covered.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
          {languages.map((lang, i) => (
            <Card key={i} 
              className="hover:scale-105 transition-transform cursor-pointer bg-white border-gray-200 hover:border-primary/30 hover:shadow-md" 
              onClick={() => navigate("/auth")}
            >
              <CardContent className="p-4 flex flex-col items-center justify-center gap-3">
                {lang.icon}
                <div className="font-mono font-bold text-lg">{lang.name}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
