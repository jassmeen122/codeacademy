
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Book, CheckCircle, Youtube } from "lucide-react";
import { useLanguageSummary } from '@/hooks/useLanguageSummary';
import { SummaryContent } from '@/components/courses/SummaryContent';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthState } from '@/hooks/useAuthState';
import { useProgrammingLanguages } from '@/hooks/useProgrammingCourses';
import { getYoutubeEmbedUrl, openYoutubeVideo } from '@/utils/youtubeVideoMap';

type LanguageParams = {
  languageId: string;
};

const LanguageSummaryPage = () => {
  const { languageId } = useParams<LanguageParams>();
  const navigate = useNavigate();
  const { user } = useAuthState();
  const { summary, progress, loading, error, markAsRead } = useLanguageSummary(languageId);
  const { languages, loading: loadingLanguages } = useProgrammingLanguages();
  
  // Find the corresponding language to get its name
  const currentLanguage = languages.find(lang => lang.id === languageId);
  
  const handleMarkAsRead = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    markAsRead();
  };
  
  // Get the YouTube URL based on the language
  const youtubeUrl = getYoutubeEmbedUrl(languageId);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="text-center py-10">
          <h3 className="text-xl text-red-500 mb-2">Une erreur est survenue</h3>
          <p className="text-gray-600">
            Impossible de charger le résumé. Veuillez réessayer plus tard.
          </p>
        </div>
      );
    }

    if (!summary) {
      return (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <Book className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-800 mb-2">
            Résumé non disponible
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Le résumé pour ce langage est en cours de préparation. Veuillez revenir plus tard.
          </p>
        </div>
      );
    }

    return (
      <>
        {/* YouTube Video */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Youtube className="mr-2 h-5 w-5 text-red-600" />
            Vidéo d'apprentissage
          </h2>
          <div className="aspect-video">
            <iframe
              className="w-full h-full rounded-lg"
              src={youtubeUrl}
              title={`Tutoriel ${currentLanguage?.name || 'de programmation'}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Summary Content */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Book className="mr-2 h-5 w-5 text-primary" />
            Résumé détaillé
          </h2>
          <SummaryContent 
            title={summary.title} 
            content={summary.content} 
            isRead={progress?.summary_read}
          />
        </div>

        {/* Mark as read button */}
        {user && !progress?.summary_read && (
          <Button 
            onClick={handleMarkAsRead}
            className="mb-8"
            size="lg"
          >
            <CheckCircle className="mr-2 h-5 w-5" />
            Marquer comme lu
          </Button>
        )}

        {/* Link to quiz */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Tester vos connaissances</h2>
          <Button 
            variant="outline"
            onClick={() => navigate(`/student/language-quiz/${languageId}`)}
          >
            Accéder au quiz
          </Button>
        </div>
      </>
    );
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">
            {loadingLanguages ? 'Chargement...' : `${currentLanguage?.name || 'Langage de programmation'}`}
          </h1>
          <Button 
            variant="outline" 
            onClick={() => navigate(`/student/language-courses/${languageId}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au cours
          </Button>
        </div>

        {renderContent()}
      </div>
    </DashboardLayout>
  );
};

export default LanguageSummaryPage;
