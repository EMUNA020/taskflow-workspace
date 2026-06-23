import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Task } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-card',
  imports: [MatCardModule, MatChipsModule, MatIconModule, MatButtonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {
  readonly task = input.required<Task>();
  readonly edit = output<void>();
  readonly delete = output<void>();

  onDeleteClick(event: Event): void {
    event.stopPropagation();
    this.delete.emit();
  }
}
