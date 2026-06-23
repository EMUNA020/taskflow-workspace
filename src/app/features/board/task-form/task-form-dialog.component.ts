import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { PRIORITIES, STATUSES, Priority, Status, Task } from '../../../core/models/task.model';

export interface TaskFormDialogData {
  task: Task | null;
  defaultStatus: Status;
}

export interface TaskFormResult {
  title: string;
  description: string;
  priority: Priority;
  tags: string[];
  status: Status;
}

@Component({
  selector: 'app-task-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './task-form-dialog.component.html',
  styleUrl: './task-form-dialog.component.scss'
})
export class TaskFormDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<TaskFormDialogComponent, TaskFormResult>);
  private readonly data = inject<TaskFormDialogData>(MAT_DIALOG_DATA);
  private readonly formBuilder = inject(FormBuilder);

  readonly priorities = PRIORITIES;
  readonly statuses = STATUSES;
  readonly isEditing = !!this.data.task;

  readonly form = this.formBuilder.nonNullable.group({
    title: [this.data.task?.title ?? '', Validators.required],
    description: [this.data.task?.description ?? ''],
    priority: [this.data.task?.priority ?? ('medium' as Priority), Validators.required],
    tags: [this.data.task?.tags.join(', ') ?? ''],
    status: [this.data.task?.status ?? this.data.defaultStatus]
  });

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const result: TaskFormResult = {
      title: value.title.trim(),
      description: value.description.trim(),
      priority: value.priority,
      tags: value.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
      status: value.status
    };

    this.dialogRef.close(result);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
