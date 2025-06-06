
import Navigation from "@/components/Navigation";
import { TechHeroSection } from "@/components/landing/TechHeroSection";
import { DevLanguagesSection } from "@/components/landing/DevLanguagesSection";
import { TechFeaturesSection } from "@/components/landing/TechFeaturesSection";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="pt-16">
        <TechHeroSection />
        <DevLanguagesSection />
        <TechFeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
