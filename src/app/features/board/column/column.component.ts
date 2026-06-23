import { Component, computed, inject, input, output } from '@angular/core';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { TaskService } from '../../../core/services/task.service';
import { FilterService } from '../../../core/services/filter.service';
import { Status, Task } from '../../../core/models/task.model';
import { TaskCardComponent } from '../task-card/task-card.component';

@Component({
  selector: 'app-column',
  imports: [DragDropModule, TaskCardComponent],
  templateUrl: './column.component.html',
  styleUrl: './column.component.scss'
})
export class ColumnComponent {
  private readonly taskService = inject(TaskService);
  private readonly filterService = inject(FilterService);

  readonly status = input.required<Status>();
  readonly title = input.required<string>();

  readonly editTask = output<Task>();
  readonly deleteTask = output<string>();

  readonly tasks = computed(() =>
    this.filterService
      .apply(this.taskService.tasks())
      .filter((task) => task.status === this.status())
  );

  onDropped(event: CdkDragDrop<Task[]>): void {
    const droppedTask = event.item.data as Task;
    const anchorTask = this.taskAfterDrop(droppedTask.id, event.currentIndex);
    this.taskService.moveTask(droppedTask.id, this.status(), anchorTask?.id ?? null);
  }

  /** The task that should end up right after `droppedTaskId` once it lands at `currentIndex` in this column's visible list. */
  private taskAfterDrop(droppedTaskId: string, currentIndex: number): Task | undefined {
    const visibleTasks = this.tasks().filter((task) => task.id !== droppedTaskId);
    return visibleTasks[currentIndex];
  }
}
