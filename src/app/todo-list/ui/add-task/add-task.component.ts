import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <mat-form-field subscriptSizing="dynamic" [appearance]="'outline'">
      <mat-label>Add task</mat-label>
      <input
        type="text"
        matInput
        [formControl]="task"
        (keyup.enter)="addTask()"
      />
      <button matSuffix mat-icon-button type="button" (click)="addTask()">
        <mat-icon>send</mat-icon>
      </button>
    </mat-form-field>
  `,
  styleUrl: './add-task.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTaskComponent {
  task = new FormControl<string>('');
  onTaskAdd = output<string>();
  addTask() {
    const task = this.task.value;
    if (task && task != '') {
      this.onTaskAdd.emit(task);
      this.task.reset();
    }
  }
}
