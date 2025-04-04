import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { Plus, ListTodo, BarChart3 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { TodoItem } from './TodoItem';
import { CompletedTasksSidebar } from './CompletedTasksSidebar';
import { TaskStats } from './TaskStats';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
  completedAt?: number;
  assignedTo: string;
}

const STORAGE_KEY = 'todos';

export const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const savedTodos = localStorage.getItem(STORAGE_KEY);
      return savedTodos ? JSON.parse(savedTodos) : [];
    } catch (error) {
      console.error('Error loading todos:', error);
      return [];
    }
  });

  const [newTodo, setNewTodo] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [assignedTo, setAssignedTo] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  }, [todos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (newTodo.trim() && assignedTo.trim()) {
      const newTodoItem: Todo = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        priority,
        createdAt: Date.now(),
        assignedTo: assignedTo.trim(),
      };
      
      setTodos(currentTodos => [...currentTodos, newTodoItem]);
      setNewTodo('');
      setPriority('medium');
      setAssignedTo('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(currentTodos =>
      currentTodos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            completed: !todo.completed,
            completedAt: !todo.completed ? Date.now() : undefined
          };
        }
        return todo;
      })
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(currentTodos => currentTodos.filter((todo) => todo.id !== id));
  };

  const getCompletionTime = (createdAt: number, completedAt: number) => {
    const diff = completedAt - createdAt;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} día${days !== 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours} hora${hours !== 1 ? 's' : ''}`;
    } else if (minutes > 0) {
      return `${minutes} minuto${minutes !== 1 ? 's' : ''}`;
    } else {
      return 'menos de 1 minuto';
    }
  };

  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  return (
    <div className="min-h-screen w-full flex items-start justify-center bg-background">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
        <Card className="rounded-none sm:rounded-lg border-0 sm:border sm:my-8">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 py-3 sm:p-6 border-b">
            <CardTitle className="text-xl font-semibold">Tareas Pendientes</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowStats(!showStats)}
                className="relative"
                title="Ver estadísticas"
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="relative"
              >
                <ListTodo className="h-4 w-4" />
                {completedTodos.length > 0 && !isSidebarOpen && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {completedTodos.length}
                  </span>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-4 py-4 sm:p-6">
            {showStats ? (
              <TaskStats todos={todos} />
            ) : (
              <>
                <form onSubmit={addTodo} className="flex flex-col gap-3 mb-6">
                  <Input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Agregar nueva tarea..."
                    className="w-full h-10"
                  />
                  <div className="flex w-full gap-3">
                    <Input
                      type="text"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      placeholder="Asignado por..."
                      className="w-[45%] h-10"
                    />
                    <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}>
                      <SelectTrigger className="w-[45%] h-10">
                        <SelectValue placeholder="Media" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baja</SelectItem>
                        <SelectItem value="medium">Media</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      type="submit" 
                      size="icon" 
                      variant="outline"
                      className="h-10 w-10 rounded-md dark:bg-white dark:hover:bg-white/90 dark:text-black bg-black hover:bg-black/90 text-white border-0 flex-shrink-0"
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                </form>

                <div className="space-y-3">
                  {activeTodos.map((todo) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onToggle={toggleTodo}
                      onDelete={deleteTodo}
                    />
                  ))}
                </div>
              </>
            )}
          </CardContent>
          {!showStats && activeTodos.length === 0 && (
            <CardFooter className="flex justify-center py-4 text-sm">
              <p className="text-muted-foreground">No hay tareas pendientes</p>
            </CardFooter>
          )}
        </Card>
      </div>

      <CompletedTasksSidebar
        completedTodos={completedTodos}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        getCompletionTime={getCompletionTime}
      />
    </div>
  );
}; 