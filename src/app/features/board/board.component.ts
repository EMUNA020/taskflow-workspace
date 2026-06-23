import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ColumnComponent } from './column/column.component';
import { FilterBarComponent } from './filter-bar/filter-bar.component';
import {
  TaskFormDialogComponent,
  TaskFormDialogData,
  TaskFormResult
} from './task-form/task-form-dialog.component';
import { TaskService } from '../../core/services/task.service';
import { STATUSES, Task } from '../../core/models/task.model';

@Component({
  selector: 'app-board',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    DragDropModule,
    ColumnComponent,
    FilterBarComponent
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  private readonly taskService = inject(TaskService);
  private readonly dialog = inject(MatDialog);

  readonly statuses = STATUSES;

  openCreateDialog(): void {
    this.openDialog({ task: null, defaultStatus: 'todo' });
  }

  editTask(task: Task): void {
    this.openDialog({ task, defaultStatus: task.status });
  }

  deleteTask(id: string): void {
    this.taskService.deleteTask(id);
  }

  private openDialog(data: TaskFormDialogData): void {
    const dialogRef = this.dialog.open<TaskFormDialogComponent, TaskFormDialogData, TaskFormResult>(
      TaskFormDialogComponent,
      { data, width: '480px' }
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      if (data.task) {
        this.taskService.updateTask(data.task.id, result);
      } else {
        this.taskService.addTask(result);
      }
    });
  }
}
