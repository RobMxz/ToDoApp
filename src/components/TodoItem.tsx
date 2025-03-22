import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Trash2, User } from 'lucide-react';
import { useTimeElapsed } from '../hooks/useTimeElapsed';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
  assignedTo: string;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  const timeElapsed = useTimeElapsed(todo.createdAt);

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'low':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'high':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="p-3">
      <div className="flex items-start sm:items-center gap-2">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo.id)}
          className="h-5 w-5 mt-1 sm:mt-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <p className={`text-sm break-words ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
              {todo.text}
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{todo.assignedTo}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Asignada {timeElapsed}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getPriorityColor(todo.priority)}`} />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(todo.id)}
            className="h-8 w-8 flex-shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}; 