import { Injectable, signal } from '@angular/core';
import { Priority, Task } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class FilterService {
  readonly searchText = signal('');
  readonly selectedPriorities = signal<Priority[]>([]);
  readonly selectedTags = signal<string[]>([]);

  setSearchText(value: string): void {
    this.searchText.set(value);
  }

  setPriorities(priorities: Priority[]): void {
    this.selectedPriorities.set(priorities);
  }

  setTags(tags: string[]): void {
    this.selectedTags.set(tags);
  }

  clear(): void {
    this.searchText.set('');
    this.selectedPriorities.set([]);
    this.selectedTags.set([]);
  }

  apply(tasks: Task[]): Task[] {
    const text = this.searchText().trim().toLowerCase();
    const priorities = this.selectedPriorities();
    const tags = this.selectedTags();

    return tasks.filter((task) => {
      const matchesText =
        !text ||
        task.title.toLowerCase().includes(text) ||
        task.description.toLowerCase().includes(text);

      const matchesPriority = priorities.length === 0 || priorities.includes(task.priority);

      const matchesTags = tags.length === 0 || tags.some((tag) => task.tags.includes(tag));

      return matchesText && matchesPriority && matchesTags;
    });
  }
}
