
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { InternshipCard } from '@/components/internships/InternshipCard';
import { InternshipFilters } from '@/components/internships/InternshipFilters';
import { InternshipForm } from '@/components/internships/InternshipForm';
import { InternshipOffer } from '@/types/internship';
import { useInternshipOffers } from '@/hooks/useInternshipOffers';
import { useInternshipApplications } from '@/hooks/useInternshipApplications';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Briefcase, Plus, AlertTriangle } from 'lucide-react';
import { ApplicationList } from '@/components/internships/ApplicationList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthState } from '@/hooks/useAuthState';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function InternshipManagementPage() {
  const { user } = useAuthState();
  const { 
    offers, 
    loading, 
    fetchInternshipOffers, 
    createInternshipOffer, 
    updateInternshipOffer,
    deleteInternshipOffer 
  } = useInternshipOffers();
  const { 
    applications, 
    fetchApplications, 
    updateApplicationStatus 
  } = useInternshipApplications();
  
  const [editingInternship, setEditingInternship] = useState<InternshipOffer | null>(null);
  const [formSheetOpen, setFormSheetOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [internshipToDelete, setInternshipToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('manage');

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      window.location.href = '/student';
    }
  }, [user]);

  // Fetch applications when page loads
  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchApplications();
    }
  }, [user, fetchApplications]);

  const handleCreateInternship = () => {
    setEditingInternship(null);
    setFormSheetOpen(true);
  };

  const handleEditInternship = (internship: InternshipOffer) => {
    setEditingInternship(internship);
    setFormSheetOpen(true);
  };

  const handleDeleteInternship = (id: string) => {
    setInternshipToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (internshipToDelete) {
      await deleteInternshipOffer(internshipToDelete);
      setDeleteDialogOpen(false);
      setInternshipToDelete(null);
    }
  };

  const handleSubmitInternship = async (values: any) => {
    try {
      if (editingInternship) {
        await updateInternshipOffer(editingInternship.id, values);
        toast.success("Internship updated successfully");
      } else {
        const result = await createInternshipOffer(values);
        if (result) {
          toast.success("New internship created successfully");
        }
      }
      setFormSheetOpen(false);
    } catch (error) {
      console.error("Error handling internship submission:", error);
      toast.error("Failed to save internship. Please try again.");
    }
  };

  const handleApproveApplication = async (id: string) => {
    await updateApplicationStatus(id, 'approved');
  };

  const handleRejectApplication = async (id: string) => {
    await updateApplicationStatus(id, 'rejected');
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
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Briefcase className="h-8 w-8" />
              Internship Management
            </h1>
            <p className="text-muted-foreground">
              Create, manage, and track internship opportunities and applications
            </p>
          </div>
          <Button onClick={handleCreateInternship}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Internship
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="manage">Manage Internships</TabsTrigger>
            <TabsTrigger value="applications">Review Applications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manage" className="space-y-6">
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
                    onApply={() => {}}
                    onEdit={() => handleEditInternship(internship)}
                    onDelete={() => handleDeleteInternship(internship.id)}
                    isAdmin={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No internships found</h3>
                <p className="text-muted-foreground">
                  No internship opportunities available. Create your first internship by clicking the button above.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="applications" className="space-y-6">
            <ApplicationList 
              applications={applications} 
              onApprove={handleApproveApplication}
              onReject={handleRejectApplication}
              isAdmin={true}
            />
          </TabsContent>
        </Tabs>
      </div>

      <Sheet open={formSheetOpen} onOpenChange={setFormSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle>{editingInternship ? 'Edit Internship' : 'Create New Internship'}</SheetTitle>
            <SheetDescription>
              {editingInternship 
                ? 'Update the details of this internship opportunity' 
                : 'Fill out the form to create a new internship opportunity'}
            </SheetDescription>
          </SheetHeader>
          
          <InternshipForm
            internship={editingInternship || undefined}
            onSubmit={handleSubmitInternship}
            onCancel={() => setFormSheetOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this internship opportunity? 
              This action cannot be undone and will also delete all associated applications.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
