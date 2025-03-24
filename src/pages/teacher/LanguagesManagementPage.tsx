
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useProgrammingLanguages } from "@/hooks/useProgrammingCourses";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, FileText, Upload } from "lucide-react";
import { toast } from "sonner";

const TeacherLanguagesManagementPage = () => {
  const navigate = useNavigate();
  const { languages, loading, error } = useProgrammingLanguages();

  useEffect(() => {
    if (error) {
      toast.error("Erreur lors du chargement des langages de programmation");
    }
  }, [error]);

  const handleLanguageClick = (languageId: string) => {
    navigate(`/teacher/languages/${languageId}`);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Code className="h-6 w-6 mr-3 text-primary" />
            <h1 className="text-3xl font-bold text-gray-800">Gestion des langages</h1>
          </div>
        </div>

        <p className="text-muted-foreground mb-8">
          En tant que professeur, vous pouvez personnaliser les ressources pour chaque langage de programmation. 
          Sélectionnez un langage pour ajouter vos propres vidéos et documents PDF.
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="border shadow-sm overflow-hidden animate-pulse">
                <div className="h-40 bg-gray-200" />
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-100 rounded w-full mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-5/6" />
                </CardContent>
                <CardFooter>
                  <div className="h-10 bg-gray-200 rounded w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {languages.map((language) => (
              <Card key={language.id} className="overflow-hidden transition-all hover:shadow-md">
                <div className="h-40 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
                  {language.image_url ? (
                    <img
                      src={language.image_url}
                      alt={language.name}
                      className="h-24 w-24 object-contain"
                    />
                  ) : (
                    <Code className="h-16 w-16 text-white" />
                  )}
                </div>
                <CardHeader className="pb-2">
                  <h3 className="text-xl font-bold">{language.name}</h3>
                </CardHeader>
                <CardContent className="pb-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {language.description || `Gérer les ressources pour le langage ${language.name}.`}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => handleLanguageClick(language.id)}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Gérer les ressources
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherLanguagesManagementPage;
