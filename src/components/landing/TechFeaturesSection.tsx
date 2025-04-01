
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Code, 
  Terminal, 
  Brain, 
  Server, 
  Globe, 
  GitBranch, 
  Database, 
  Shield
} from "lucide-react";

export const TechFeaturesSection: React.FC = () => {
  const techFeatures = [
    {
      icon: <Terminal className="h-10 w-10 text-green-500" />,
      title: "Live Coding",
      description: "Write and execute code in real-time with our interactive editor"
    },
    {
      icon: <Brain className="h-10 w-10 text-blue-500" />,
      title: "AI Assistant",
      description: "Get personalized help from our AI coding assistant"
    },
    {
      icon: <GitBranch className="h-10 w-10 text-purple-500" />,
      title: "Project-Based Learning",
      description: "Build real projects that enhance your portfolio"
    },
    {
      icon: <Globe className="h-10 w-10 text-yellow-500" />,
      title: "Developer Community",
      description: "Connect with peers and mentors in our global community"
    },
    {
      icon: <Database className="h-10 w-10 text-red-500" />,
      title: "Database Skills",
      description: "Master database design and optimization techniques"
    },
    {
      icon: <Shield className="h-10 w-10 text-cyan-500" />,
      title: "Security Practices",
      description: "Learn best practices for secure application development"
    }
  ];

  return (
    <section className="py-16 bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-gray-700 rounded-lg mb-4">
            <Code className="text-primary mr-2" /> 
            <span className="font-mono text-primary">CodeAcademy</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Cutting-Edge Developer Tools
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our platform provides developers with the most advanced tools to learn programming efficiently.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {techFeatures.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow hover:border-primary/50 bg-gray-900 border-gray-700">
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
