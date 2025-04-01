
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface InternshipFiltersProps {
  onFilterChange: (filters: {
    industry?: string;
    location?: string;
    isRemote?: boolean;
    searchTerm?: string;
  }) => void;
}

export function InternshipFilters({ onFilterChange }: InternshipFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [industry, setIndustry] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [isRemote, setIsRemote] = useState<boolean>(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  // Fetch industries and locations
  useEffect(() => {
    async function fetchFilterOptions() {
      try {
        // Fetch unique industries
        const { data: industriesData, error: industriesError } = await supabase
          .from('internship_offers')
          .select('industry')
          .eq('status', 'open')
          .order('industry');
        
        if (industriesError) throw industriesError;
        
        // Extract unique values
        const uniqueIndustries = Array.from(
          new Set(industriesData.map(item => item.industry))
        );
        
        setIndustries(uniqueIndustries);
        
        // Fetch unique locations
        const { data: locationsData, error: locationsError } = await supabase
          .from('internship_offers')
          .select('location')
          .eq('status', 'open')
          .order('location');
        
        if (locationsError) throw locationsError;
        
        // Extract unique values
        const uniqueLocations = Array.from(
          new Set(locationsData.map(item => item.location))
        );
        
        setLocations(uniqueLocations);
      } catch (error) {
        console.error('Error fetching filter options:', error);
        toast.error('Failed to load filter options');
      }
    }
    
    fetchFilterOptions();
  }, []);

  const handleSearch = () => {
    const filters = {
      searchTerm: searchTerm || undefined,
      industry: industry || undefined,
      location: location || undefined,
      isRemote: isRemote || undefined,
    };
    
    // Update active filters
    const newActiveFilters: string[] = [];
    if (searchTerm) newActiveFilters.push(`Search: ${searchTerm}`);
    if (industry) newActiveFilters.push(`Industry: ${industry}`);
    if (location) newActiveFilters.push(`Location: ${location}`);
    if (isRemote) newActiveFilters.push('Remote Only');
    
    setActiveFilters(newActiveFilters);
    onFilterChange(filters);
  };

  const clearFilter = (filter: string) => {
    // Extract filter type
    if (filter.startsWith('Search:')) {
      setSearchTerm('');
    } else if (filter.startsWith('Industry:')) {
      setIndustry('');
    } else if (filter.startsWith('Location:')) {
      setLocation('');
    } else if (filter === 'Remote Only') {
      setIsRemote(false);
    }
    
    const newActiveFilters = activeFilters.filter(f => f !== filter);
    setActiveFilters(newActiveFilters);
    
    // Apply updated filters
    onFilterChange({
      searchTerm: filter.startsWith('Search:') ? undefined : searchTerm || undefined,
      industry: filter.startsWith('Industry:') ? undefined : industry || undefined,
      location: filter.startsWith('Location:') ? undefined : location || undefined,
      isRemote: filter === 'Remote Only' ? undefined : isRemote || undefined,
    });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setIndustry('');
    setLocation('');
    setIsRemote(false);
    setActiveFilters([]);
    onFilterChange({});
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Input
              placeholder="Search internships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-8"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>

          <div>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger>
                <div className="flex items-center">
                  <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Industry" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Industries</SelectItem>
                {industries.map((ind) => (
                  <SelectItem key={ind} value={ind}>
                    {ind}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Location" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Locations</SelectItem>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="remote"
              checked={isRemote}
              onCheckedChange={(checked) => setIsRemote(checked as boolean)}
            />
            <label
              htmlFor="remote"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remote Only
            </label>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <Badge key={filter} variant="secondary" className="px-2 py-1">
                {filter}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-2"
                  onClick={() => clearFilter(filter)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>

          <div className="flex space-x-2">
            {activeFilters.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                Clear All
              </Button>
            )}
            <Button size="sm" onClick={handleSearch}>
              Apply Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
