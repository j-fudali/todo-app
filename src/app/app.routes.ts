import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'todo-list',
    loadChildren: () =>
      import('./todo-list/feature/todo-list-shell/todo-list-shell.routes'),
  },
  {
    path: '',
    redirectTo: '/todo-list',
    pathMatch: 'full',
  },
];
