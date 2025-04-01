
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Coffee, Braces, Code } from "lucide-react";

export const LanguagesSection: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
          <div className="relative">
            <div className="absolute -top-4 -left-4 animate-ping opacity-30">
              <Coffee className="h-8 w-8 text-primary" />
            </div>
            <div className="bg-white p-6 rounded-full shadow-lg">
              <Braces className="h-16 w-16 text-primary" />
            </div>
            <div className="absolute -bottom-4 -right-4 animate-pulse">
              <Code className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">Programming Languages</h2>
            <p className="text-gray-600 max-w-2xl">
              Our comprehensive courses cover all the major programming languages used in industry today.
              From web development to data science, we've got you covered.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
          {["Python", "JavaScript", "Java", "PHP", "C++", "SQL"].map((lang, i) => (
            <Card key={i} className="hover:scale-105 transition-transform cursor-pointer" onClick={() => navigate("/auth")}>
              <CardContent className="p-4">
                <div className="font-mono font-bold text-lg text-primary">{lang}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
