
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { InternshipCard } from '@/components/internships/InternshipCard';
import { InternshipFilters } from '@/components/internships/InternshipFilters';
import { ApplicationForm } from '@/components/internships/ApplicationForm';
import { InternshipOffer } from '@/types/internship';
import { useInternshipOffers } from '@/hooks/useInternshipOffers';
import { useInternshipApplications } from '@/hooks/useInternshipApplications';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Briefcase, Sparkles, TrendingUp } from 'lucide-react';
import { ApplicationList } from '@/components/internships/ApplicationList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthState } from '@/hooks/useAuthState';
import { toast } from 'sonner';

export default function InternshipOpportunitiesPage() {
  const { user } = useAuthState();
  const { offers, loading, fetchInternshipOffers } = useInternshipOffers();
  const { applications, applyForInternship, loading: applicationsLoading } = useInternshipApplications();
  
  const [selectedInternship, setSelectedInternship] = useState<InternshipOffer | null>(null);
  const [applySheetOpen, setApplySheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('opportunities');
  const [submitting, setSubmitting] = useState(false);

  const handleApply = (internship: InternshipOffer) => {
    setSelectedInternship(internship);
    setApplySheetOpen(true);
  };

  const handleSubmitApplication = async (application: {
    cv_url?: string;
    cover_letter_url?: string;
    motivation_text?: string;
  }) => {
    if (!selectedInternship || !user) {
      toast.error('You must be logged in to apply for internships');
      return;
    }
    
    try {
      setSubmitting(true);
      const result = await applyForInternship(selectedInternship.id, application);
      
      if (result) {
        setApplySheetOpen(false);
        setActiveTab('applications');
        toast.success('Application submitted successfully');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFilter = (filters: {
    industry?: string;
    location?: string;
    isRemote?: boolean;
    searchTerm?: string;
  }) => {
    // Normalize industry and location filters to handle "all" values
    const industry = filters.industry === 'all-industries' ? undefined : filters.industry;
    const location = filters.location === 'all-locations' ? undefined : filters.location;
    
    fetchInternshipOffers({
      industry,
      location,
      isRemote: filters.isRemote,
      searchTerm: filters.searchTerm
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="animate-slide-in-right">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 hover-scale">
              <Briefcase className="h-8 w-8 text-blue-600 animate-bounce" />
              Opportunités de Stage
              <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Trouvez et postulez pour des stages qui correspondent à vos intérêts et compétences
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-scale-in">
          <TabsList className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
            <TabsTrigger value="opportunities" className="data-[state=active]:bg-white data-[state=active]:shadow-md transition-all">
              Opportunités Disponibles
            </TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-white data-[state=active]:shadow-md transition-all">
              Mes Candidatures
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="opportunities" className="space-y-6">
            <div className="animate-slide-in-right">
              <InternshipFilters onFilterChange={handleFilter} />
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="rounded-lg border bg-card p-6 animate-pulse">
                    <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-4 bg-muted rounded w-5/6"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : offers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                {offers.map((internship, index) => (
                  <div key={internship.id} className="hover-scale" style={{ animationDelay: `${index * 0.1}s` }}>
                    <InternshipCard
                      internship={internship}
                      onApply={() => handleApply(internship)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 animate-scale-in">
                <Briefcase className="mx-auto h-16 w-16 text-gray-400 mb-4 animate-bounce" />
                <h3 className="text-lg font-medium">Aucun stage trouvé</h3>
                <p className="text-muted-foreground">
                  Aucune opportunité de stage ne correspond à vos filtres actuels. Ajustez votre recherche ou revenez plus tard.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="applications" className="space-y-6">
            {applicationsLoading ? (
              <div className="animate-pulse space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="rounded-lg border bg-card p-6">
                    <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                      <div className="h-4 bg-muted rounded w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="animate-fade-in">
                <ApplicationList applications={applications} />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Sheet open={applySheetOpen} onOpenChange={(open) => {
        // Only allow closing if not currently submitting
        if (!submitting || !open) {
          setApplySheetOpen(open);
        }
      }}>
        <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto animate-slide-in-right">
          <SheetHeader className="pb-4">
            <SheetTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
              Postuler pour le Stage
            </SheetTitle>
            <SheetDescription>
              Remplissez le formulaire ci-dessous pour postuler à cette opportunité de stage
            </SheetDescription>
          </SheetHeader>
          
          {selectedInternship && (
            <ApplicationForm
              internship={selectedInternship}
              onSubmit={handleSubmitApplication}
              onCancel={() => setApplySheetOpen(false)}
            />
          )}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
}
