
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useLanguageSummary } from '@/hooks/useLanguageSummary';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useAuthState } from '@/hooks/useAuthState';
import { toast } from 'sonner';
import { SummaryContent } from '@/components/language-summary/SummaryContent';
import { SummaryLoading } from '@/components/language-summary/SummaryLoading';
import { SummaryNotAvailable } from '@/components/language-summary/SummaryNotAvailable';
import { SummaryHeader } from '@/components/language-summary/SummaryHeader';
import { SummaryFooter } from '@/components/language-summary/SummaryFooter';

const LanguageSummaryPage = () => {
  const { languageId } = useParams<{ languageId: string }>();
  const navigate = useNavigate();
  const { summary, userProgress, loading, error, markAsRead } = useLanguageSummary(languageId ?? null);
  const { user } = useAuthState();

  useEffect(() => {
    if (error) {
      toast.error("Erreur lors du chargement du résumé");
      console.error("Error loading summary:", error);
    }
  }, [error]);

  const handleMarkAsRead = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    const success = await markAsRead();
    if (success) {
      // We don't need to navigate away as the state will update
      toast.success("Résumé marqué comme lu !");
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        
        {loading ? (
          <SummaryLoading />
        ) : summary ? (
          <>
            <Card className="border-t-4 border-t-blue-500">
              <SummaryHeader 
                title={summary.title} 
                isRead={!!userProgress?.summary_read} 
                onMarkAsRead={handleMarkAsRead} 
              />
              <CardContent>
                <SummaryContent content={summary.content} />
              </CardContent>
            </Card>
            
            <SummaryFooter 
              isRead={!!userProgress?.summary_read} 
              onMarkAsRead={handleMarkAsRead} 
            />
          </>
        ) : (
          <SummaryNotAvailable />
        )}
      </div>
    </DashboardLayout>
  );
};

export default LanguageSummaryPage;
