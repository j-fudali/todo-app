import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { TasksService } from '../../data-access/tasks.service';
import { TasksListComponent } from '../../ui/tasks-list/tasks-list.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { AddTaskComponent } from '../../ui/add-task/add-task.component';
import { NewTask } from '../../interfaces/new-task';
import { debounce, debounceTime, take } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UpdateTaskComponent } from '../../ui/update-task/update-task.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  providers: [TasksService],
  imports: [
    CommonModule,
    TasksListComponent,
    AddTaskComponent,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatCardModule,
    MatSnackBarModule,
    MatDialogModule,
  ],

  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Todo App</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          @if(taskAdding()){
          <mat-progress-bar [mode]="'indeterminate'"></mat-progress-bar>
          } @if(isLoading()){
          <mat-spinner [diameter]="50" [mode]="'indeterminate'"></mat-spinner>
          } @else{
          <app-tasks-list
            (updateTask)="updateTask($event)"
            (deleteTask)="deleteTask($event)"
            (toggleTask)="toggleTask($event)"
            [tasks]="tasks()"
          />
          }
          <app-add-task (onTaskAdd)="addTask($event)" class="add-tasks" />
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styleUrl: './todo-list.component.scss',
})
export class TodoListComponent {
  private tasksService = inject(TasksService);
  private dialog = inject(MatDialog);
  tasks = this.tasksService.tasks;
  isLoading = this.tasksService.isLoading;
  taskAdding = this.tasksService.taskAdding;

  toggleTask(toggledTask: { id: number; isDone: boolean }) {
    this.tasksService.toggleTask(toggledTask.id, toggledTask.isDone);
  }
  updateTask(id: number) {
    const dialogRef = this.dialog.open(UpdateTaskComponent);
    dialogRef.afterClosed().subscribe((text) => {
      if (text && text != '') {
        //Change id value to non-existing id to test error handling
        this.tasksService.updateTask(id, text);
      }
    });
  }
  addTask(task: string) {
    this.tasksService.addTask(task);
  }
  deleteTask(id: number) {
    this.tasksService.deleteTask(id);
  }
}
