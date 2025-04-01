
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
import { Briefcase } from 'lucide-react';
import { ApplicationList } from '@/components/internships/ApplicationList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthState } from '@/hooks/useAuthState';
import { supabase } from '@/integrations/supabase/client';

export default function InternshipOpportunitiesPage() {
  const { user } = useAuthState();
  const { offers, loading, fetchInternshipOffers } = useInternshipOffers();
  const { applications, applyForInternship } = useInternshipApplications();
  
  const [selectedInternship, setSelectedInternship] = useState<InternshipOffer | null>(null);
  const [applySheetOpen, setApplySheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('opportunities');

  const handleApply = (internship: InternshipOffer) => {
    setSelectedInternship(internship);
    setApplySheetOpen(true);
  };

  const handleSubmitApplication = async (application: {
    cv_url?: string;
    cover_letter_url?: string;
    motivation_text?: string;
  }) => {
    if (!selectedInternship) return;
    
    const result = await applyForInternship(selectedInternship.id, application);
    if (result) {
      setApplySheetOpen(false);
      setActiveTab('applications');
    }
  };

  const handleFilter = (filters: {
    industry?: string;
    location?: string;
    isRemote?: boolean;
    searchTerm?: string;
  }) => {
    // Filter by searchTerm client-side
    const searchTerm = filters.searchTerm?.toLowerCase();
    
    // Normalize industry and location filters to handle "all" values
    const industry = filters.industry === 'all-industries' ? undefined : filters.industry;
    const location = filters.location === 'all-locations' ? undefined : filters.location;
    
    fetchInternshipOffers({
      industry,
      location,
      isRemote: filters.isRemote,
      searchTerm
    });
  };

  // Create a storage bucket if it doesn't exist yet
  React.useEffect(() => {
    const createStorageBucket = async () => {
      try {
        // Check if bucket exists
        const { data: buckets } = await supabase.storage.listBuckets();
        const bucketExists = buckets?.some(bucket => bucket.name === 'internship-applications');
        
        if (!bucketExists) {
          // Create bucket
          const { data, error } = await supabase.storage.createBucket('internship-applications', {
            public: true,
            fileSizeLimit: 5242880, // 5MB
          });
          
          if (error) {
            console.error('Error creating storage bucket:', error);
          } else {
            console.log('Storage bucket created successfully');
          }
        }
      } catch (error) {
        console.error('Error checking/creating storage bucket:', error);
      }
    };
    
    createStorageBucket();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Briefcase className="h-8 w-8" />
              Internship Opportunities
            </h1>
            <p className="text-muted-foreground">
              Find and apply for internships that match your interests and skills
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="opportunities">Available Opportunities</TabsTrigger>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="opportunities" className="space-y-6">
            <InternshipFilters onFilterChange={handleFilter} />
            
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {offers.map((internship) => (
                  <InternshipCard
                    key={internship.id}
                    internship={internship}
                    onApply={() => handleApply(internship)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No internships found</h3>
                <p className="text-muted-foreground">
                  No internship opportunities match your current filters. Try adjusting your search or check back later.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="applications" className="space-y-6">
            <ApplicationList applications={applications} />
          </TabsContent>
        </Tabs>
      </div>

      <Sheet open={applySheetOpen} onOpenChange={setApplySheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle>Apply for Internship</SheetTitle>
            <SheetDescription>
              Fill out the form below to apply for this internship opportunity
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
