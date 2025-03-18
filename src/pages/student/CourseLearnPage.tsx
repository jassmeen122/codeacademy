
import React from "react";
import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const CourseLearnPage = () => {
  const { courseId } = useParams();

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Course Learning</h1>
        <p className="text-gray-600 mb-8">Course ID: {courseId}</p>
        
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-8">
          <p className="text-yellow-700">
            This page is under construction. Content will be available soon.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CourseLearnPage;
