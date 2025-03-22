import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Trash2 } from 'lucide-react';
import { useTimeElapsed } from '../hooks/useTimeElapsed';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
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
      <div className="flex items-center gap-2">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo.id)}
          className="h-5 w-5"
        />
        <div className="flex-1">
          <p className={`text-sm ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
            {todo.text}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Creada hace {timeElapsed}
          </p>
        </div>
        <div className={`w-2 h-2 rounded-full ${getPriorityColor(todo.priority)}`} />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(todo.id)}
          className="h-8 w-8"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}; 