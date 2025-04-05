
import React from 'react';
import { ActivityLog } from '@/types/progress';

interface ActivityCalendarProps {
  activities: ActivityLog[];
}

export const ActivityCalendar: React.FC<ActivityCalendarProps> = ({ activities }) => {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
      <p>Activity calendar visualization is currently under development.</p>
    </div>
  );
};
