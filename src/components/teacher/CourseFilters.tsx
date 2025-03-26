
import { useState, useEffect } from "react";
import { Search, ArrowUp, ArrowDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CourseLevel, CoursePath, CourseCategory } from "@/types/course";

export type SortField = "title" | "created_at" | "difficulty" | "path" | "category";
export type SortDirection = "asc" | "desc";
export type FilterKey = "difficulty" | "path" | "category";
export type Filters = Record<FilterKey, string | null>;

interface CourseFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  sortField: SortField;
  setSortField: (value: SortField) => void;
  sortDirection: SortDirection;
  setSortDirection: (value: SortDirection) => void;
  filters: Filters;
  setFilters: (filters: Filters) => void;
  onSearch: () => void;
  clearFilters: () => void;
}

export const CourseFilters = ({
  searchTerm,
  setSearchTerm,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  filters,
  setFilters,
  onSearch,
  clearFilters
}: CourseFiltersProps) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Debounce the actual search to avoid too many re-renders
    const timer = setTimeout(() => {
      onSearch();
    }, 300);
    return () => clearTimeout(timer);
  };

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Update this function to validate the values before setting them
  const handleFilterChange = (key: FilterKey, value: string | null) => {
    // Validate that the value is acceptable for the given key
    if (value === "all") {
      // Handle "all" selection (clear filter)
      setFilters(prev => ({ ...prev, [key]: null }));
      return;
    }
    
    // If we have a value, make sure it's a valid option for this filter type
    if (value) {
      if (key === "difficulty") {
        // Check if value is a valid CourseLevel
        const validDifficulties: CourseLevel[] = ["Beginner", "Intermediate", "Advanced"];
        if (!validDifficulties.includes(value as CourseLevel)) {
          console.error(`Invalid difficulty value: ${value}`);
          return;
        }
      } else if (key === "path") {
        // Check if value is a valid CoursePath
        const validPaths: CoursePath[] = ["Web Development", "Data Science", "Artificial Intelligence"];
        if (!validPaths.includes(value as CoursePath)) {
          console.error(`Invalid path value: ${value}`);
          return;
        }
      } else if (key === "category") {
        // Check if value is a valid CourseCategory
        const validCategories: CourseCategory[] = [
          "Programming Fundamentals", 
          "Frontend Development", 
          "Backend Development", 
          "Data Analysis", 
          "Machine Learning", 
          "AI Applications"
        ];
        if (!validCategories.includes(value as CourseCategory)) {
          console.error(`Invalid category value: ${value}`);
          return;
        }
      }
    }
    
    // If we passed all validation, update the filter
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="mb-8 bg-white p-4 rounded-lg shadow-sm border">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="col-span-1 md:col-span-3 lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search courses..."
              className="pl-9"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        
        <div>
          <Select
            value={filters.difficulty || "all"}
            onValueChange={(value) => handleFilterChange("difficulty", value === "all" ? null : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Select
            value={filters.path || "all"}
            onValueChange={(value) => handleFilterChange("path", value === "all" ? null : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Path" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Paths</SelectItem>
              <SelectItem value="Web Development">Web Development</SelectItem>
              <SelectItem value="Data Science">Data Science</SelectItem>
              <SelectItem value="Artificial Intelligence">Artificial Intelligence</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Select
            value={sortField}
            onValueChange={(value) => setSortField(value as SortField)}
          >
            <SelectTrigger className="flex justify-between">
              <SelectValue placeholder="Sort by" />
              <button onClick={(e) => { e.stopPropagation(); toggleSortDirection(); }} className="hover:bg-muted p-1 rounded-full">
                {sortDirection === 'asc' ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
              </button>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="created_at">Date Created</SelectItem>
              <SelectItem value="difficulty">Difficulty</SelectItem>
              <SelectItem value="path">Path</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Active filters */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {Object.entries(filters).map(([key, value]) => 
          value && (
            <Badge key={key} variant="secondary" className="flex items-center gap-1">
              {key}: {value}
              <button 
                onClick={() => handleFilterChange(key as FilterKey, null)}
                className="ml-1 hover:bg-muted rounded-full p-0.5"
              >
                ×
              </button>
            </Badge>
          )
        )}
        {(searchTerm || Object.values(filters).some(Boolean)) && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="h-7 text-xs"
          >
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
};
