export type Priority = 'low' | 'medium' | 'high';

export type Status = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  tags: string[];
  status: Status;
  createdAt: string;
}

export const STATUSES: { id: Status; label: string }[] = [
  { id: 'todo', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'done', label: 'Done' }
];

export const PRIORITIES: Priority[] = ['low', 'medium', 'high'];
