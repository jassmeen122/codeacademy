
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InternshipOffer } from '@/types/internship';
import { Upload, File, Check, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from '@/hooks/useAuthState';
import { toast } from 'sonner';

const formSchema = z.object({
  motivation_text: z.string().min(10, { 
    message: 'Your motivation letter should be at least 10 characters long' 
  }),
  cv_file: z.any().optional(),
  cover_letter_file: z.any().optional(),
});

type ApplicationFormValues = z.infer<typeof formSchema>;

interface ApplicationFormProps {
  internship: InternshipOffer;
  onSubmit: (application: {
    cv_url?: string;
    cover_letter_url?: string;
    motivation_text?: string;
  }) => Promise<any>;
  onCancel: () => void;
}

export function ApplicationForm({ internship, onSubmit, onCancel }: ApplicationFormProps) {
  const { user } = useAuthState();
  const [cvUploading, setCvUploading] = useState(false);
  const [clUploading, setClUploading] = useState(false);
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [coverLetterUrl, setCoverLetterUrl] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      motivation_text: '',
      cv_file: undefined,
      cover_letter_file: undefined,
    },
  });

  const handleFileUpload = async (
    file: File,
    setUploading: React.Dispatch<React.SetStateAction<boolean>>,
    setUrl: React.Dispatch<React.SetStateAction<string | null>>,
    folderPath: string
  ) => {
    if (!file || !user) return null;

    try {
      setUploading(true);
      
      // Create a safe file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = `${folderPath}/${fileName}`;
      
      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('internship-applications')
        .upload(filePath, file);
      
      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw uploadError;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('internship-applications')
        .getPublicUrl(filePath);
      
      setUrl(publicUrl);
      return publicUrl;
    } catch (error: any) {
      console.error(`Error uploading to ${folderPath}:`, error);
      toast.error(`Failed to upload file: ${error.message || 'Unknown error'}`);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const url = await handleFileUpload(file, setCvUploading, setCvUrl, 'cv');
    if (url) {
      toast.success('CV uploaded successfully');
    }
  };

  const handleCoverLetterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const url = await handleFileUpload(file, setClUploading, setCoverLetterUrl, 'cover-letters');
    if (url) {
      toast.success('Cover letter uploaded successfully');
    }
  };

  const handleSubmit = async (values: ApplicationFormValues) => {
    try {
      setFormSubmitting(true);
      
      await onSubmit({
        cv_url: cvUrl,
        cover_letter_url: coverLetterUrl,
        motivation_text: values.motivation_text,
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Apply for: {internship.title}</CardTitle>
        <CardDescription>
          Submit your application to {internship.company} for the {internship.title} position
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="cv_file"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Upload CV</FormLabel>
                    <FormControl>
                      <div className="flex flex-col items-center space-y-2">
                        <label 
                          htmlFor="cv-upload" 
                          className={`cursor-pointer w-full border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center ${
                            cvUrl ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' : ''
                          }`}
                        >
                          {cvUploading ? (
                            <>
                              <Loader2 className="h-8 w-8 text-primary animate-spin" />
                              <div className="mt-2 text-sm font-medium">
                                Uploading...
                              </div>
                            </>
                          ) : cvUrl ? (
                            <>
                              <Check className="h-8 w-8 text-green-500" />
                              <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                                CV Uploaded
                              </div>
                            </>
                          ) : (
                            <>
                              <Upload className="h-8 w-8 text-muted-foreground" />
                              <div className="mt-2 text-sm">
                                <span className="font-medium">Click to upload</span> or drag and drop
                              </div>
                              <p className="text-xs text-muted-foreground">
                                PDF, DOCX or ODT (MAX. 5MB)
                              </p>
                            </>
                          )}
                        </label>
                        <Input
                          id="cv-upload"
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            onChange(e);
                            handleCvUpload(e);
                          }}
                          accept=".pdf,.doc,.docx,.odt"
                          disabled={cvUploading}
                          {...fieldProps}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload your resume or CV
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cover_letter_file"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Upload Cover Letter</FormLabel>
                    <FormControl>
                      <div className="flex flex-col items-center space-y-2">
                        <label 
                          htmlFor="cl-upload" 
                          className={`cursor-pointer w-full border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center ${
                            coverLetterUrl ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' : ''
                          }`}
                        >
                          {clUploading ? (
                            <>
                              <Loader2 className="h-8 w-8 text-primary animate-spin" />
                              <div className="mt-2 text-sm font-medium">
                                Uploading...
                              </div>
                            </>
                          ) : coverLetterUrl ? (
                            <>
                              <Check className="h-8 w-8 text-green-500" />
                              <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                                Cover Letter Uploaded
                              </div>
                            </>
                          ) : (
                            <>
                              <File className="h-8 w-8 text-muted-foreground" />
                              <div className="mt-2 text-sm">
                                <span className="font-medium">Click to upload</span> or drag and drop
                              </div>
                              <p className="text-xs text-muted-foreground">
                                PDF, DOCX or ODT (MAX. 5MB)
                              </p>
                            </>
                          )}
                        </label>
                        <Input
                          id="cl-upload"
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            onChange(e);
                            handleCoverLetterUpload(e);
                          }}
                          accept=".pdf,.doc,.docx,.odt"
                          disabled={clUploading}
                          {...fieldProps}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload your cover letter
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="motivation_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivation Letter *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us why you're interested in this internship and why you would be a good fit..." 
                      rows={8}
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Write a brief motivation letter explaining why you're interested in this position
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} disabled={formSubmitting}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={cvUploading || clUploading || formSubmitting}
              >
                {formSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
