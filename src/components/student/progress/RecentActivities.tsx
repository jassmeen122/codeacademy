
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePoints } from '@/hooks/usePoints';
import { Check, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { getActivityLabel } from '@/utils/pointsSystem';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface RecentActivitiesProps {
  limit?: number;
}

export const RecentActivities: React.FC<RecentActivitiesProps> = ({ limit = 5 }) => {
  const { loading, activityHistory, fetchActivityHistory } = usePoints();
  
  useEffect(() => {
    fetchActivityHistory(limit);
  }, [limit]);
  
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-500" />
          Activités récentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array(limit).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : activityHistory.length > 0 ? (
          <div className="space-y-3">
            {activityHistory.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 py-2">
                <div className="bg-green-100 p-1.5 rounded-full mt-0.5">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-gray-900">
                      {getActivityLabel(activity.activity_type)}
                    </p>
                    <Badge variant="outline">
                      +{activity.activity_data?.points_awarded || 0} XP
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">
                    {formatTimeAgo(activity.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>Aucune activité récente.</p>
            <p className="text-sm mt-1">Complétez des quiz, des exercices et lisez des résumés pour gagner des points !</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
