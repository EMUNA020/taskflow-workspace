import { Component, computed, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TaskService } from '../../../core/services/task.service';
import { FilterService } from '../../../core/services/filter.service';
import { PRIORITIES } from '../../../core/models/task.model';

@Component({
  selector: 'app-filter-bar',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.scss'
})
export class FilterBarComponent {
  private readonly taskService = inject(TaskService);
  readonly filterService = inject(FilterService);

  readonly priorities = PRIORITIES;

  readonly availableTags = computed(() =>
    [...new Set(this.taskService.tasks().flatMap((task) => task.tags))].sort()
  );

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.filterService.setSearchText(value);
  }
}
