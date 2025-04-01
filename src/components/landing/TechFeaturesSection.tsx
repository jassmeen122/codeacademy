
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Code, TerminalSquare, Brain, Server, Globe } from "lucide-react";

export const TechFeaturesSection: React.FC = () => {
  const techFeatures = [
    {
      icon: <TerminalSquare className="h-10 w-10 text-primary" />,
      title: "Live Coding",
      description: "Write and execute code in real-time with our interactive editor"
    },
    {
      icon: <Brain className="h-10 w-10 text-primary" />,
      title: "AI Assistant",
      description: "Get personalized help from our AI coding assistant"
    },
    {
      icon: <Server className="h-10 w-10 text-primary" />,
      title: "Project-Based Learning",
      description: "Build real projects that enhance your portfolio"
    },
    {
      icon: <Globe className="h-10 w-10 text-primary" />,
      title: "Developer Community",
      description: "Connect with peers and mentors in our global community"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            <Code className="inline-block mr-2 text-primary" /> Cutting-Edge Learning Tools
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform provides developers with the most advanced tools to learn programming efficiently.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {techFeatures.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow hover:border-primary/50">
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
