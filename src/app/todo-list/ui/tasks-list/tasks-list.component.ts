import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { Task } from '../../interfaces/task';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { animate, style, transition, trigger } from '@angular/animations';
import { SortPipe } from '../../pipes/sort.pipe';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    SortPipe,
  ],
  animations: [
    trigger('skipInitialAnim', [transition(':enter', [])]),
    trigger('taskLife', [
      transition(':enter', [
        style({
          transform: 'translateY(100%)',
          opacity: 0,
        }),
        animate(
          150,
          style({
            transform: 'translateX(0)',
            opacity: 1,
          })
        ),
      ]),
      transition(':leave', [
        style({
          transform: 'translateX(0%)',
          opacity: 1,
        }),
        animate(
          250,
          style({
            transform: 'translateX(100%)',
            opacity: 0,
          })
        ),
      ]),
    ]),
  ],
  template: `
    <mat-list @skipInitialAnim>
      @for (task of tasks() | appSort ; track task.id) {
      <mat-list-item
        @taskLife
        [style.backgroundColor]="task.isDone ? '#ebebeb' : ''"
      >
        <span
          (click)="toggleTask.emit({ id: task.id, isDone: !task.isDone })"
          [style.textDecoration]="task.isDone ? 'line-through' : ''"
          >{{ task.text }}</span
        >
        <button
          matListItemMeta
          [mat-menu-trigger-for]="menu"
          [matMenuTriggerData]="{ id: task.id }"
          mat-icon-button
        >
          <mat-icon>menu</mat-icon>
        </button>
        <mat-divider></mat-divider>
      </mat-list-item>
      }@empty {
      <mat-list-item>No tasks right now</mat-list-item>
      }
    </mat-list>
    <mat-menu #menu="matMenu">
      <ng-template matMenuContent let-id="id">
        <button mat-menu-item (click)="updateTask.emit(id)">
          <span>Update</span><mat-icon>update</mat-icon>
        </button>
        <button mat-menu-item (click)="deleteTask.emit(id)">
          <span>Delete</span><mat-icon>delete</mat-icon>
        </button>
      </ng-template>
    </mat-menu>
  `,
  styleUrl: './tasks-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksListComponent {
  tasks = input.required<Task[]>();
  toggleTask = output<{ id: number; isDone: boolean }>();
  updateTask = output<number>();
  deleteTask = output<number>();
}
