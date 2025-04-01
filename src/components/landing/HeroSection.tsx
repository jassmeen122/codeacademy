
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Terminal, ArrowRight, Database, School, GraduationCap, MapPin } from "lucide-react";
import { CodeBlock } from "@/components/landing/CodeBlock";

interface HeroSectionProps {
  session: any;
  userRole: string | null;
  navigateToPortal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  session, 
  userRole, 
  navigateToPortal 
}) => {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [activeDemoTab, setActiveDemoTab] = useState<string>("python");
  
  const welcomeText = "console.log('Welcome to CodeAcademy');";

  useEffect(() => {
    if (isTyping) {
      if (typedText.length < welcomeText.length) {
        const timeout = setTimeout(() => {
          setTypedText(welcomeText.slice(0, typedText.length + 1));
        }, 100);
        return () => clearTimeout(timeout);
      } else {
        setIsTyping(false);
        setTimeout(() => {
          setTypedText("");
          setIsTyping(true);
        }, 3000);
      }
    }
  }, [typedText, isTyping]);

  const renderPortalButton = () => {
    if (!userRole) return null;
    
    let icon;
    let label;
    
    switch(userRole) {
      case 'admin':
        icon = <Database className="h-5 w-5 mr-2" />;
        label = "Admin Portal";
        break;
      case 'teacher':
        icon = <School className="h-5 w-5 mr-2" />;
        label = "Teacher Portal";
        break;
      case 'student':
        icon = <GraduationCap className="h-5 w-5 mr-2" />;
        label = "Student Portal";
        break;
      default:
        return null;
    }
    
    return (
      <Button
        size="lg"
        className="flex items-center text-lg px-8 bg-primary hover:bg-primary/90"
        onClick={navigateToPortal}
      >
        {icon}
        {label}
      </Button>
    );
  };

  const renderMyPlaceButton = () => {
    if (userRole) {
      let icon;
      let label = "My Place";
      let destination = '/';
      
      switch(userRole) {
        case 'admin':
          icon = <Database className="h-5 w-5 mr-2" />;
          destination = '/admin';
          break;
        case 'teacher':
          icon = <School className="h-5 w-5 mr-2" />;
          destination = '/teacher';
          break;
        case 'student':
          icon = <GraduationCap className="h-5 w-5 mr-2" />;
          destination = '/student';
          break;
        default:
          icon = <MapPin className="h-5 w-5 mr-2" />;
      }
      
      return (
        <Button
          size="lg"
          className="flex items-center text-lg px-8 bg-blue-500 hover:bg-blue-600 ml-4"
          onClick={() => navigate(destination)}
        >
          {icon}
          {label}
        </Button>
      );
    }
    return null;
  };

  const demoCodeSamples = {
    python: `# A simple Python function
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
    
# Print the first 10 Fibonacci numbers
for i in range(10):
    print(fibonacci(i))`,
    javascript: `// JavaScript array methods
const developers = ['Sara', 'Ahmed', 'Yasmine'];

// Map through the array
const greetings = developers.map(name => {
  return \`Hello, \${name}! Welcome to coding.\`;
});

// Log the results
console.log(greetings);`,
    java: `// Java class example
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, coding world!");
        
        for (int i = 1; i <= 5; i++) {
            System.out.println("Loop iteration: " + i);
        }
    }
}`
  };

  return (
    <section className="pt-28 pb-20 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fadeIn">
            <h1 className="text-5xl md:text-6xl font-bold mb-5 leading-tight">
              Learn to <span className="text-primary">Code</span> Like a Pro
            </h1>
            <div className="flex items-center mb-3">
              <Terminal className="text-primary h-6 w-6 mr-2" />
              <div className="h-8 font-mono text-primary">
                {typedText}<span className={`inline-block w-2 h-5 bg-primary ${isTyping ? 'animate-pulse' : 'opacity-0'}`}></span>
              </div>
            </div>
            <p className="text-xl text-gray-300 mb-8">
              Master in-demand programming languages with interactive courses designed by industry experts.
            </p>
            <div className="flex flex-wrap gap-4">
              {session ? (
                <>
                  {renderPortalButton()}
                  {renderMyPlaceButton()}
                </>
              ) : (
                <Button
                  size="lg"
                  className="text-lg px-8 bg-primary hover:bg-primary/90 group"
                  onClick={() => navigate("/auth")}
                >
                  Start Coding Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              )}
            </div>
          </div>
          
          <div className="mt-6 lg:mt-0 bg-black/50 rounded-lg shadow-xl overflow-hidden border border-gray-700">
            <div className="bg-gray-800 px-4 py-2 flex items-center border-b border-gray-700">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="ml-4 text-gray-400 text-sm font-mono">~/techmentor/demo.js</div>
            </div>
            <div className="p-4">
              <div className="flex border-b border-gray-700 mb-4">
                <button 
                  className={`px-4 py-2 text-sm font-mono ${activeDemoTab === 'python' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
                  onClick={() => setActiveDemoTab('python')}
                >
                  python
                </button>
                <button 
                  className={`px-4 py-2 text-sm font-mono ${activeDemoTab === 'javascript' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
                  onClick={() => setActiveDemoTab('javascript')}
                >
                  javascript
                </button>
                <button 
                  className={`px-4 py-2 text-sm font-mono ${activeDemoTab === 'java' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
                  onClick={() => setActiveDemoTab('java')}
                >
                  java
                </button>
              </div>
              <CodeBlock code={demoCodeSamples[activeDemoTab as keyof typeof demoCodeSamples]} language={activeDemoTab} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
