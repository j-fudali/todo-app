import { Route } from '@angular/router';
import { TodoListComponent } from '../todo-list/todo-list.component';

export default [
  {
    path: '',
    component: TodoListComponent,
  },
] as Route[];
