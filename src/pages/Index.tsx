
import Navigation from "@/components/Navigation";
import { HeroSection } from "@/components/landing/HeroSection";
import { LanguagesSection } from "@/components/landing/LanguagesSection";
import { TechFeaturesSection } from "@/components/landing/TechFeaturesSection";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="pt-16">
        <HeroSection />
        <LanguagesSection />
        <TechFeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
