
import React from 'react';
import { InternshipApplication } from '@/types/internship';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X, FileText, FileCheck, Download } from 'lucide-react';
import { formatDistance } from 'date-fns';

interface ApplicationListProps {
  applications: InternshipApplication[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  isAdmin?: boolean;
}

export function ApplicationList({ 
  applications, 
  onApprove, 
  onReject, 
  isAdmin = false 
}: ApplicationListProps) {
  if (applications.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No applications found.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Applications</CardTitle>
          <CardDescription>
            {applications.length} application{applications.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {isAdmin && <TableHead>Student</TableHead>}
                <TableHead>Internship</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied</TableHead>
                {isAdmin && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => {
                const appliedDate = new Date(app.created_at);
                const timeAgo = formatDistance(appliedDate, new Date(), { addSuffix: true });
                
                return (
                  <TableRow key={app.id}>
                    {isAdmin && (
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={app.student?.avatar_url || undefined} />
                            <AvatarFallback>
                              {app.student?.full_name?.[0] || 'S'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{app.student?.full_name || 'Unknown Student'}</div>
                            <div className="text-xs text-muted-foreground">{app.student?.email}</div>
                          </div>
                        </div>
                      </TableCell>
                    )}
                    <TableCell>
                      {app.internship ? app.internship.title : 'Unknown Internship'}
                      <div className="text-xs text-muted-foreground">
                        {app.internship ? app.internship.company : ''}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        {app.cv_url ? (
                          <a 
                            href={app.cv_url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center p-1 rounded-md hover:bg-accent"
                          >
                            <FileText className="h-4 w-4 text-blue-500" />
                          </a>
                        ) : (
                          <span className="text-muted-foreground text-xs">No CV</span>
                        )}
                        
                        {app.cover_letter_url ? (
                          <a 
                            href={app.cover_letter_url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center p-1 rounded-md hover:bg-accent"
                          >
                            <FileCheck className="h-4 w-4 text-green-500" />
                          </a>
                        ) : (
                          <span className="text-muted-foreground text-xs">No CL</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        app.status === 'pending' ? 'outline' :
                        app.status === 'approved' ? 'default' : 'destructive'
                      }>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground text-sm">
                        {timeAgo}
                      </span>
                    </TableCell>
                    {isAdmin && (
                      <TableCell className="text-right">
                        {app.status === 'pending' && (
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => onApprove?.(app.id)}
                              className="text-green-500 border-green-200 hover:bg-green-50 hover:text-green-600 dark:border-green-800 dark:hover:bg-green-950"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => onReject?.(app.id)}
                              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-800 dark:hover:bg-red-950"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
