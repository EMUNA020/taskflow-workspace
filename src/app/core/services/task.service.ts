import { Injectable, effect, inject, signal } from '@angular/core';
import { Task, Status } from '../models/task.model';
import { LocalStorageService } from './local-storage.service';

const STORAGE_KEY = 'taskflow.tasks';

function generateId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
}

function demoTasks(): Task[] {
  const now = new Date().toISOString();
  return [
    {
      id: generateId(),
      title: 'Welcome to TaskFlow Workspace',
      description: 'Drag this card between columns to see the board in action.',
      priority: 'medium',
      tags: ['demo'],
      status: 'todo',
      createdAt: now
    },
    {
      id: generateId(),
      title: 'Try the filters',
      description: 'Search by title or filter by priority and tags above.',
      priority: 'low',
      tags: ['demo', 'filters'],
      status: 'in-progress',
      createdAt: now
    },
    {
      id: generateId(),
      title: 'Refresh the page',
      description: 'Everything you do is saved to localStorage automatically.',
      priority: 'high',
      tags: ['demo'],
      status: 'done',
      createdAt: now
    }
  ];
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly storage = inject(LocalStorageService);

  readonly tasks = signal<Task[]>(this.storage.get<Task[]>(STORAGE_KEY, demoTasks()));

  constructor() {
    effect(() => this.storage.set(STORAGE_KEY, this.tasks()));
  }

  addTask(task: Omit<Task, 'id' | 'createdAt'>): void {
    const newTask: Task = {
      ...task,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    this.tasks.update((tasks) => [...tasks, newTask]);
  }

  updateTask(id: string, changes: Partial<Omit<Task, 'id' | 'createdAt'>>): void {
    this.tasks.update((tasks) =>
      tasks.map((task) => (task.id === id ? { ...task, ...changes } : task))
    );
  }

  deleteTask(id: string): void {
    this.tasks.update((tasks) => tasks.filter((task) => task.id !== id));
  }

  /** Moves `id` to `newStatus`, inserting it directly before `beforeTaskId` (or at the end if null). */
  moveTask(id: string, newStatus: Status, beforeTaskId: string | null): void {
    this.tasks.update((tasks) => {
      const movedTask = tasks.find((t) => t.id === id);
      if (!movedTask) {
        return tasks;
      }

      const remaining = tasks.filter((t) => t.id !== id);
      const insertAt = beforeTaskId ? remaining.findIndex((t) => t.id === beforeTaskId) : -1;
      const targetIndex = insertAt === -1 ? remaining.length : insertAt;

      remaining.splice(targetIndex, 0, { ...movedTask, status: newStatus });
      return remaining;
    });
  }
}
