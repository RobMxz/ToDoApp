import React from 'react';
import { Card, CardTitle } from './ui/card';
import { CheckCircle2, X, User, Calendar, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
  completedAt?: number;
  assignedTo: string;
}

interface CompletedTasksSidebarProps {
  completedTodos: Todo[];
  isOpen: boolean;
  onClose: () => void;
  getCompletionTime: (createdAt: number, completedAt: number) => string;
}

export const CompletedTasksSidebar: React.FC<CompletedTasksSidebarProps> = ({
  completedTodos,
  isOpen,
  onClose,
  getCompletionTime,
}) => {
  // Ordenar las tareas por fecha de completado (más recientes primero)
  const sortedCompletedTodos = [...completedTodos].sort((a, b) => {
    if (!a.completedAt || !b.completedAt) return 0;
    return b.completedAt - a.completedAt;
  });

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div
      className={`fixed right-0 top-0 h-full bg-background border-l shadow-lg transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } w-full sm:w-80 z-50`}
    >
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <CardTitle className="text-xl">Tareas Completadas</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4">
            <div className="space-y-4">
              {sortedCompletedTodos.map((todo) => (
                <Card key={todo.id} className="p-3">
                  <div className="flex items-start sm:items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 sm:mt-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <p className="text-sm line-through text-muted-foreground break-words">
                          {todo.text}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <User className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{todo.assignedTo}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Creada: {formatDate(todo.createdAt)}</span>
                        </div>
                        {todo.completedAt && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Tiempo en completar: {getCompletionTime(todo.createdAt, todo.completedAt)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              {completedTodos.length === 0 && (
                <p className="text-center text-muted-foreground">
                  No hay tareas completadas
                </p>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}; 