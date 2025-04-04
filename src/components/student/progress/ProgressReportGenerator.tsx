
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FileText, Download, Calendar } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  generateProgressReport,
  downloadProgressReportPdf
} from '@/utils/progressReportGenerator';
import { ProgressReportOptions, UserSkill, UserMetric } from '@/types/progress';
import { UserProfile } from '@/hooks/useAuthState';
import { toast } from 'sonner';

interface ProgressReportGeneratorProps {
  userId: string;
  user: UserProfile;
  skills: UserSkill[];
  metrics?: UserMetric | null;
}

export const ProgressReportGenerator: React.FC<ProgressReportGeneratorProps> = ({
  userId,
  user,
  skills,
  metrics
}) => {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<ProgressReportOptions>({
    includeSkills: true,
    includeCourses: true,
    includeActivities: true,
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
      end: new Date()
    }
  });
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      const report = await generateProgressReport(userId, user, options, skills, metrics);
      downloadProgressReportPdf(report);
      toast.success('Report generated and downloaded successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Progress Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Generate a comprehensive report of your learning progress. You can download it as a PDF.
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="include-skills" 
                checked={options.includeSkills}
                onCheckedChange={(checked) => 
                  setOptions(prev => ({ ...prev, includeSkills: !!checked }))
                }
              />
              <Label htmlFor="include-skills">Include skills progress</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="include-courses" 
                checked={options.includeCourses}
                onCheckedChange={(checked) => 
                  setOptions(prev => ({ ...prev, includeCourses: !!checked }))
                }
              />
              <Label htmlFor="include-courses">Include course completions</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="include-activities" 
                checked={options.includeActivities}
                onCheckedChange={(checked) => 
                  setOptions(prev => ({ ...prev, includeActivities: !!checked }))
                }
              />
              <Label htmlFor="include-activities">Include activity logs</Label>
            </div>
            
            <div className="mt-4 flex items-center">
              <Label htmlFor="date-range" className="mr-3">Date range:</Label>
              <div className="flex items-center space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="w-[120px] flex justify-between items-center">
                      {options.dateRange?.start ? new Date(options.dateRange.start).toLocaleDateString() : "Start date"}
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={options.dateRange?.start}
                      onSelect={(date) => 
                        setOptions(prev => ({ 
                          ...prev, 
                          dateRange: { 
                            ...prev.dateRange!, 
                            start: date || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                          } 
                        }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                <span>to</span>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="w-[120px] flex justify-between items-center">
                      {options.dateRange?.end ? new Date(options.dateRange.end).toLocaleDateString() : "End date"}
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={options.dateRange?.end}
                      onSelect={(date) => 
                        setOptions(prev => ({ 
                          ...prev, 
                          dateRange: { 
                            ...prev.dateRange!, 
                            end: date || new Date()
                          } 
                        }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleGenerateReport} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-b-transparent rounded-full"></div>
                Generating...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download Progress Report
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
