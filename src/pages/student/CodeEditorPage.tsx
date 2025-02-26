
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CodeEditorWrapper } from "@/components/CodeEditor/CodeEditorWrapper";

const CodeEditorPage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Code Editor</h1>
        <div className="h-[calc(100vh-12rem)]">
          <CodeEditorWrapper />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CodeEditorPage;
