
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

interface TaskStatus {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'not-started';
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
}

interface TasksProgressionTableProps {
  tasks: TaskStatus[];
  onViewAllTasks: () => void;
}

export const TasksProgressionTable = ({ tasks, onViewAllTasks }: TasksProgressionTableProps) => {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'text-green-600';
      case 'in-progress': return 'text-blue-600';
      case 'not-started': return 'text-gray-600';
      default: return '';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          Tâches et progression
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tâche</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date limite</TableHead>
              <TableHead>Priorité</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.name}</TableCell>
                <TableCell className={getStatusColor(task.status)}>
                  {task.status === 'completed' && <CheckCircle2 className="h-4 w-4 inline mr-1" />}
                  {task.status === 'completed' ? 'Terminé' : 
                    task.status === 'in-progress' ? 'En cours' : 'À faire'}
                </TableCell>
                <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                    {task.priority === 'high' ? 'Élevée' : 
                      task.priority === 'medium' ? 'Moyenne' : 'Basse'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-4 w-full"
          onClick={onViewAllTasks}
        >
          Voir toutes les tâches
        </Button>
      </CardContent>
    </Card>
  );
};
