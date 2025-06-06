
import Navigation from "@/components/Navigation";
import { CodeAcademyHero } from "@/components/landing/CodeAcademyHero";
import { WhyCodeAcademy } from "@/components/landing/WhyCodeAcademy";
import { LanguagesSection } from "@/components/landing/LanguagesSection";
import { TechFeaturesSection } from "@/components/landing/TechFeaturesSection";
import { Testimonials } from "@/components/landing/Testimonials";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="pt-16">
        <CodeAcademyHero />
        <WhyCodeAcademy />
        <LanguagesSection />
        <TechFeaturesSection />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
