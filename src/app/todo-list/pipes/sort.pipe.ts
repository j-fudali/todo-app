import { Pipe, type PipeTransform } from '@angular/core';
import { Task } from '../interfaces/task';

@Pipe({
  name: 'appSort',
  standalone: true,
})
export class SortPipe implements PipeTransform {
  transform(tasks: Task[]): Task[] {
    return tasks.sort((a, b) => (a.isDone == b.isDone ? 0 : a.isDone ? 1 : -1));
  }
}
