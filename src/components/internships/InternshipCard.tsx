
import React from 'react';
import { InternshipOffer } from '@/types/internship';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Briefcase, Calendar, Check, X, Trash, Pencil } from 'lucide-react';
import { formatDistance } from 'date-fns';

interface InternshipCardProps {
  internship: InternshipOffer;
  onApply: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isAdmin?: boolean;
}

export function InternshipCard({ 
  internship, 
  onApply, 
  onEdit, 
  onDelete, 
  isAdmin = false 
}: InternshipCardProps) {
  const postedDate = new Date(internship.created_at);
  const timeAgo = formatDistance(postedDate, new Date(), { addSuffix: true });

  return (
    <Card className="w-full transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{internship.title}</CardTitle>
            <CardDescription className="text-base font-medium">{internship.company}</CardDescription>
          </div>
          <Badge variant={
            internship.status === 'open' ? 'default' :
            internship.status === 'filled' ? 'secondary' : 'outline'
          }>
            {internship.status.charAt(0).toUpperCase() + internship.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 mb-3">
            {internship.required_skills.map((skill, index) => (
              <Badge key={index} variant="outline" className="bg-blue-50 dark:bg-blue-950">
                {skill}
              </Badge>
            ))}
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
            {internship.description}
          </p>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{internship.location}</span>
              {internship.is_remote && <Badge variant="outline" className="ml-1 text-xs">Remote</Badge>}
            </div>
            
            <div className="flex items-center gap-1">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span>{internship.industry}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{internship.duration}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                {internship.start_date 
                  ? new Date(internship.start_date).toLocaleDateString() 
                  : 'Flexible start date'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4 border-t">
        <div className="text-sm text-muted-foreground">
          Posted {timeAgo}
        </div>
        <div className="flex gap-2">
          {isAdmin ? (
            <>
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Pencil className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={onDelete}>
                <Trash className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </>
          ) : (
            <Button onClick={onApply} disabled={internship.status !== 'open'}>
              Apply Now
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
