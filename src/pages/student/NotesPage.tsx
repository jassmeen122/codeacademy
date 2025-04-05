
import React from 'react';
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { NotesTab } from "@/components/student/notes/NotesTab";

const NotesPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4">
        <NotesTab />
      </div>
    </DashboardLayout>
  );
};

export default NotesPage;
