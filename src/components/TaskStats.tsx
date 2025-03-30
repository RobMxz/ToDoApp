import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import { BarChart3, CheckCircle2, Clock, User, AlertCircle } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
  completedAt?: number;
  assignedTo: string;
}

interface TaskStatsProps {
  todos: Todo[];
}

const PRIORITY_COLORS = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-red-500',
};

export const TaskStats: React.FC<TaskStatsProps> = ({ todos }) => {
  // Memoizar cálculos costosos
  const {
    totalTasks,
    completedTasks,
    pendingTasks,
    completedWithTime,
    averageCompletionTime,
    tasksByPriority,
    tasksByAssignee,
  } = useMemo(() => {
    const totalTasks = todos.length;
    const completedTasks = todos.filter(todo => todo.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const completedWithTime = todos.filter(todo => todo.completed && todo.completedAt);
    
    const averageCompletionTime = completedWithTime.length > 0
      ? completedWithTime.reduce((acc, todo) => {
          if (todo.completedAt) {
            return acc + (todo.completedAt - todo.createdAt) / (1000 * 60);
          }
          return acc;
        }, 0) / completedWithTime.length
      : 0;

    const tasksByPriority = todos.reduce((acc, todo) => {
      acc[todo.priority] = (acc[todo.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const tasksByAssignee = Object.entries(
      todos.reduce((acc, todo) => {
        const assignee = todo.assignedTo || 'Sin asignar';
        acc[assignee] = (acc[assignee] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).sort((a, b) => b[1] - a[1]);

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      completedWithTime,
      averageCompletionTime,
      tasksByPriority,
      tasksByAssignee,
    };
  }, [todos]);

  // Memoizar datos del gráfico
  const completionsByDay = useMemo(() => {
    const last14Days = Array.from({ length: 14 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (13 - i));
      return date;
    });

    return last14Days.map(date => {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const completedToday = completedWithTime.filter(todo => {
        const completionDate = new Date(todo.completedAt || 0);
        return completionDate >= startOfDay && completionDate <= endOfDay;
      });

      return {
        date: date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
        tareas: completedToday.length,
      };
    });
  }, [completedWithTime]);

  // Formatear tiempo promedio
  const formatAverageTime = (minutes: number) => {
    if (minutes < 60) return `${Math.round(minutes)} minutos`;
    const hours = minutes / 60;
    return `${hours.toFixed(1)} horas`;
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Tareas</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tareas Completadas</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              {((completedTasks / totalTasks) * 100).toFixed(1)}% del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatAverageTime(averageCompletionTime)}</div>
            <p className="text-xs text-muted-foreground">
              para completar una tarea
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tareas Pendientes</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks}</div>
            <p className="text-xs text-muted-foreground">
              {((pendingTasks / totalTasks) * 100).toFixed(1)}% del total
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Tareas Completadas por Día</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={completionsByDay}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  className="stroke-muted" 
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                  width={30}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Fecha
                              </span>
                              <span className="font-bold text-muted-foreground">
                                {label}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Tareas
                              </span>
                              <span className="font-bold">
                                {payload[0].value}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="tareas"
                  fill="currentColor"
                  radius={[4, 4, 0, 0]}
                  className="fill-[#0EA5E9] dark:fill-[#22D3EE]"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Distribución por Prioridad</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(tasksByPriority).map(([priority, count]) => (
              <HoverCard key={priority}>
                <HoverCardTrigger asChild>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="capitalize">{priority}</span>
                      <span>{count} tareas</span>
                    </div>
                    <Progress
                      value={(count / totalTasks) * 100}
                      className={`h-2 ${PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS]}`}
                    />
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-48">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">{priority}</p>
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span>{count} tareas</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Porcentaje:</span>
                        <span>{((count / totalTasks) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Tareas por Asignado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tasksByAssignee.map(([assignee, count]) => (
              <HoverCard key={assignee}>
                <HoverCardTrigger asChild>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{assignee}</span>
                      </div>
                      <span>{count} tareas</span>
                    </div>
                    <Progress
                      value={(count / totalTasks) * 100}
                      className="h-2"
                    />
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-48">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">{assignee}</p>
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span>{count} tareas</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Porcentaje:</span>
                        <span>{((count / totalTasks) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Tiempo de Completado por Tarea</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {completedWithTime
              .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0))
              .slice(0, 5)
              .map(todo => {
                const completionTime = todo.completedAt
                  ? (todo.completedAt - todo.createdAt) / (1000 * 60)
                  : 0;
                return (
                  <HoverCard key={todo.id}>
                    <HoverCardTrigger asChild>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="truncate max-w-[200px]">{todo.text}</span>
                          <span>{Math.round(completionTime)} min</span>
                        </div>
                        <Progress
                          value={(completionTime / (averageCompletionTime * 2)) * 100}
                          className="h-2"
                        />
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-64">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">{todo.text}</p>
                        <div className="text-sm">
                          <div className="flex justify-between">
                            <span>Tiempo:</span>
                            <span>{formatAverageTime(completionTime)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Creado:</span>
                            <span>{new Date(todo.createdAt).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Completado:</span>
                            <span>{new Date(todo.completedAt || 0).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 