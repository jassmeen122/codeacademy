
import React from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { InternshipOffer } from '@/types/internship';

const formSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  company: z.string().min(2, { message: 'Company name is required' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  required_skills: z.array(z.string()).min(1, { message: 'At least one skill is required' }),
  industry: z.string().min(2, { message: 'Industry is required' }),
  location: z.string().min(2, { message: 'Location is required' }),
  is_remote: z.boolean().default(false),
  duration: z.string().min(2, { message: 'Duration is required' }),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

type InternshipFormValues = z.infer<typeof formSchema>;

interface InternshipFormProps {
  internship?: InternshipOffer;
  onSubmit: (values: InternshipFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function InternshipForm({ internship, onSubmit, onCancel, isSubmitting = false }: InternshipFormProps) {
  const [skillInput, setSkillInput] = React.useState('');

  const defaultValues: Partial<InternshipFormValues> = internship
    ? {
        ...internship,
        start_date: internship.start_date || undefined,
        end_date: internship.end_date || undefined,
      }
    : {
        title: '',
        company: '',
        description: '',
        required_skills: [],
        industry: '',
        location: '',
        is_remote: false,
        duration: '',
        start_date: undefined,
        end_date: undefined,
      };

  const form = useForm<InternshipFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const addSkill = () => {
    if (skillInput.trim()) {
      const currentSkills = form.getValues('required_skills') || [];
      form.setValue('required_skills', [...currentSkills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    const currentSkills = form.getValues('required_skills') || [];
    form.setValue(
      'required_skills',
      currentSkills.filter((_, i) => i !== index)
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title *</FormLabel>
                <FormControl>
                  <Input placeholder="Frontend Developer Internship" {...field} />
                </FormControl>
                <FormDescription>
                  The title of the internship position
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company *</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Inc." {...field} />
                </FormControl>
                <FormDescription>
                  The company offering the internship
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description *</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Detailed description of the internship position..." 
                  rows={5}
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Provide a detailed description of the internship responsibilities
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="required_skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Required Skills *</FormLabel>
              <div className="flex space-x-2">
                <Input
                  placeholder="Add a required skill..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  disabled={isSubmitting}
                />
                <Button type="button" onClick={addSkill} variant="secondary" disabled={isSubmitting}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {field.value?.map((skill, index) => (
                  <Card key={index} className="bg-muted">
                    <CardContent className="p-2 flex items-center">
                      <span>{skill}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 ml-2"
                        onClick={() => removeSkill(index)}
                        disabled={isSubmitting}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <FormDescription>
                Add the skills required for this internship
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry *</FormLabel>
                <FormControl>
                  <Input placeholder="Web Development" {...field} />
                </FormControl>
                <FormDescription>
                  The industry category for this internship
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location *</FormLabel>
                <FormControl>
                  <Input placeholder="Paris, France" {...field} />
                </FormControl>
                <FormDescription>
                  Where the internship is based
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration *</FormLabel>
                <FormControl>
                  <Input placeholder="3 months" {...field} />
                </FormControl>
                <FormDescription>
                  How long the internship lasts
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormDescription>
                  When the internship starts
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormDescription>
                  When the internship ends
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="is_remote"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Remote Position
                </FormLabel>
                <FormDescription>
                  Check if this internship can be done remotely
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isSubmitting 
              ? (internship ? 'Updating...' : 'Creating...') 
              : (internship ? 'Update Internship' : 'Create Internship')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
