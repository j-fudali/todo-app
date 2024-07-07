import { Injectable } from '@angular/core';
import { Observable, delay, of, tap, throwError } from 'rxjs';
import { Task } from '../interfaces/task';
import { NewTask } from '../interfaces/new-task';
import { UpdateTask } from '../interfaces/update-task';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private tasks: Task[] = [
    {
      id: 1,
      text: 'Task 1',
      isDone: false,
    },
    {
      id: 2,
      text: 'Task 2',
      isDone: false,
    },
    {
      id: 3,
      text: 'Task 3',
      isDone: false,
    },
    {
      id: 4,
      text: 'Task 4',
      isDone: false,
    },
    {
      id: 5,
      text: 'Task 5',
      isDone: true,
    },
    {
      id: 6,
      text: 'Task 6',
      isDone: true,
    },
    {
      id: 7,
      text: 'Task 7',
      isDone: true,
    },
  ];

  getTasks() {
    return of(this.tasks).pipe(delay(1000));
  }
  addTask(task: NewTask) {
    const lastTask = this.tasks[this.tasks.length - 1];
    const id = lastTask ? lastTask.id + 1 : 1;
    this.tasks = [...this.tasks, { id, ...task }];
    return of({ id, ...task }).pipe(delay(1000));
  }
  updateTask(id: number, { text, isDone }: UpdateTask) {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) {
      return throwError(() => new Error('Task with provided id not exists'));
    }
    if (text) {
      task.text = text;
    }
    if (isDone != undefined) {
      task.isDone = isDone;
    }
    return of('Task has been updated').pipe(delay(1000));
  }
  deleteTask(id: number) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    return of('Task has been deleted').pipe(delay(1000));
  }
}
