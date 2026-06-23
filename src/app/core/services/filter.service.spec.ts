import { TestBed } from '@angular/core/testing';
import { FilterService } from './filter.service';
import { Task } from '../models/task.model';

function makeTask(overrides: Partial<Task>): Task {
  return {
    id: overrides.id ?? Math.random().toString(),
    title: 'Title',
    description: 'Description',
    priority: 'medium',
    tags: [],
    status: 'todo',
    createdAt: new Date().toISOString(),
    ...overrides
  };
}

describe('FilterService', () => {
  let service: FilterService;
  let tasks: Task[];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterService);
    tasks = [
      makeTask({ id: '1', title: 'Buy groceries', priority: 'low', tags: ['home'] }),
      makeTask({ id: '2', title: 'Fix critical bug', priority: 'high', tags: ['work', 'urgent'] }),
      makeTask({ id: '3', title: 'Write report', priority: 'medium', tags: ['work'] })
    ];
  });

  it('returns all tasks when no filters are set', () => {
    expect(service.apply(tasks)).toEqual(tasks);
  });

  it('filters by free-text search across title and description', () => {
    service.setSearchText('bug');
    expect(service.apply(tasks).map((t) => t.id)).toEqual(['2']);
  });

  it('filters by selected priority', () => {
    service.setPriorities(['high']);
    expect(service.apply(tasks).map((t) => t.id)).toEqual(['2']);
  });

  it('filters by selected tag', () => {
    service.setTags(['work']);
    expect(service.apply(tasks).map((t) => t.id)).toEqual(['2', '3']);
  });

  it('combines text, priority, and tag filters', () => {
    service.setSearchText('report');
    service.setPriorities(['medium']);
    service.setTags(['work']);
    expect(service.apply(tasks).map((t) => t.id)).toEqual(['3']);
  });

  it('clears all filters', () => {
    service.setSearchText('bug');
    service.setPriorities(['high']);
    service.setTags(['urgent']);
    service.clear();
    expect(service.apply(tasks)).toEqual(tasks);
  });
});
