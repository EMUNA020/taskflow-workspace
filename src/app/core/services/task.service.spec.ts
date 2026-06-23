import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { LocalStorageService } from './local-storage.service';
import { Task } from '../models/task.model';

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: '1',
    title: 'Task',
    description: '',
    priority: 'medium',
    tags: [],
    status: 'todo',
    createdAt: new Date().toISOString(),
    ...overrides
  };
}

function makeTaskInput(overrides: Partial<Omit<Task, 'id' | 'createdAt'>> = {}): Omit<Task, 'id' | 'createdAt'> {
  const { id: _id, createdAt: _createdAt, ...input } = makeTask(overrides);
  return input;
}

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskService);
  });

  it('seeds demo tasks when localStorage is empty', () => {
    expect(service.tasks().length).toBeGreaterThan(0);
  });

  it('loads existing tasks from localStorage instead of seeding demo data', () => {
    const stored: Task[] = [makeTask({ title: 'Existing', priority: 'low' })];
    TestBed.inject(LocalStorageService).set('taskflow.tasks', stored);
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const freshService = TestBed.inject(TaskService);
    expect(freshService.tasks()).toEqual(stored);
  });

  it('adds a task', () => {
    const initialCount = service.tasks().length;
    service.addTask(makeTaskInput({ title: 'New task', description: 'desc', priority: 'high', tags: ['a'] }));
    expect(service.tasks().length).toBe(initialCount + 1);
    expect(service.tasks().at(-1)?.title).toBe('New task');
  });

  it('updates a task', () => {
    const id = service.tasks()[0].id;
    service.updateTask(id, { title: 'Updated title' });
    expect(service.tasks().find((t) => t.id === id)?.title).toBe('Updated title');
  });

  it('deletes a task', () => {
    const id = service.tasks()[0].id;
    const initialCount = service.tasks().length;
    service.deleteTask(id);
    expect(service.tasks().length).toBe(initialCount - 1);
    expect(service.tasks().find((t) => t.id === id)).toBeUndefined();
  });

  it('moves a task to a different status, inserting it before the given anchor task', () => {
    const movingId = service.tasks()[0].id;
    const anchorId = service.tasks().find((t) => t.status === 'done')!.id;

    service.moveTask(movingId, 'done', anchorId);

    const doneTasks = service.tasks().filter((t) => t.status === 'done');
    expect(doneTasks[0].id).toBe(movingId);
    expect(doneTasks[1].id).toBe(anchorId);
  });

  it('moves a task to the end of a status when no anchor is given', () => {
    const movingId = service.tasks()[0].id;

    service.moveTask(movingId, 'done', null);

    const doneTasks = service.tasks().filter((t) => t.status === 'done');
    expect(doneTasks.at(-1)?.id).toBe(movingId);
  });

  it('persists changes to localStorage', () => {
    service.addTask(makeTaskInput({ title: 'Persisted task' }));
    TestBed.flushEffects();
    const stored = TestBed.inject(LocalStorageService).get<Task[]>('taskflow.tasks', []);
    expect(stored.some((t) => t.title === 'Persisted task')).toBe(true);
  });
});
