
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export const SummaryLoading: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
      <div className="h-4 bg-gray-100 rounded w-1/4 mb-8" />
      <div className="h-96 bg-gray-100 rounded" />
    </div>
  );
};
