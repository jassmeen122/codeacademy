
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
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
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  industry: z.string().optional(),
  location: z.string().optional(),
  isRemote: z.boolean().optional(),
  searchTerm: z.string().optional(),
});

interface InternshipFiltersProps {
  onFilterChange: (filters: {
    industry?: string;
    location?: string;
    isRemote?: boolean;
    searchTerm?: string;
  }) => void;
}

export function InternshipFilters({ onFilterChange }: InternshipFiltersProps) {
  const [industries, setIndustries] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      industry: undefined,
      location: undefined,
      isRemote: undefined,
      searchTerm: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onFilterChange(values);
  };

  const resetFilters = () => {
    form.reset({
      industry: undefined,
      location: undefined,
      isRemote: undefined,
      searchTerm: '',
    });
    onFilterChange({});
  };

  // Fetch unique industries and locations from the database
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // Get unique industries
        const { data: industryData, error: industryError } = await supabase
          .from('internship_offers')
          .select('industry')
          .eq('status', 'open');
        
        if (industryError) throw industryError;
        
        if (industryData) {
          const uniqueIndustries = [...new Set(industryData.map(item => item.industry))];
          setIndustries(uniqueIndustries);
        }
        
        // Get unique locations
        const { data: locationData, error: locationError } = await supabase
          .from('internship_offers')
          .select('location')
          .eq('status', 'open');
        
        if (locationError) throw locationError;
        
        if (locationData) {
          const uniqueLocations = [...new Set(locationData.map(item => item.location))];
          setLocations(uniqueLocations);
        }
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };

    fetchFilterOptions();
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4 bg-card border rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="searchTerm"
            render={({ field }) => (
              <FormItem className="md:col-span-4">
                <FormControl>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search internships..."
                      className="pl-9"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="All industries" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">All industries</SelectItem>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="All locations" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">All locations</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="isRemote"
            render={({ field }) => (
              <FormItem className="flex flex-row items-end space-x-3 space-y-0 rounded-md">
                <FormLabel>Remote only</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex space-x-2 items-end">
            <Button type="submit">Apply Filters</Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={resetFilters}
              className="flex items-center"
            >
              <X className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
