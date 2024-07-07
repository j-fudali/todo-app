import {
  DestroyRef,
  Injectable,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ApiService } from './api.service';
import { Task } from '../interfaces/task';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Subject,
  catchError,
  debounceTime,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface TasksState {
  tasks: Task[];
  isLoading: boolean;
  taskAdding: boolean;
}

@Injectable()
export class TasksService {
  private apiService = inject(ApiService);
  private snackbar = inject(MatSnackBar);
  private state = signal<TasksState>({
    tasks: [],
    isLoading: false,
    taskAdding: false,
  });
  tasks = computed(() => this.state().tasks);
  isLoading = computed(() => this.state().isLoading);
  taskAdding = computed(() => this.state().taskAdding);

  private add$ = new Subject<string>();
  private toggle$ = new Subject<{ id: number; isDone: boolean }>();
  private update$ = new Subject<{ id: number; text: string }>();
  private delete$ = new Subject<number>();
  constructor() {
    this.setIsLoading(true);
    this.apiService
      .getTasks()
      .pipe(takeUntilDestroyed())
      .subscribe((tasks) => {
        this.setTasks(tasks);
        this.setIsLoading(false);
      });
    this.add$
      .pipe(
        tap(() => this.setTaskAdding(true)),
        switchMap((text) => this.apiService.addTask({ text, isDone: false })),
        takeUntilDestroyed()
      )
      .subscribe((task) => {
        this.state.update((state) => ({
          ...state,
          tasks: [task, ...state.tasks],
        }));
        this.setTaskAdding(false);
      });
    this.toggle$
      .pipe(
        tap(({ id, isDone }) =>
          this.state.update((state) => ({
            ...state,
            tasks: state.tasks.map((task) =>
              task.id === id ? { ...task, isDone } : task
            ),
          }))
        ),
        debounceTime(150),
        switchMap(({ id, isDone }) =>
          this.apiService.updateTask(id, { isDone })
        ),
        takeUntilDestroyed()
      )
      .subscribe();
    this.update$
      .pipe(
        tap(({ id, text }) =>
          this.state.update((state) => ({
            ...state,
            tasks: state.tasks.map((task) =>
              task.id === id ? { ...task, text } : task
            ),
          }))
        ),
        switchMap(({ id, text }) =>
          this.apiService.updateTask(id, { text }).pipe(
            catchError((err: Error) => {
              this.snackbar.open(err.message, 'X', { duration: 3000 });
              return of(undefined);
            })
          )
        ),
        takeUntilDestroyed()
      )
      .subscribe();
    this.delete$
      .pipe(
        tap((id) =>
          this.state.update((state) => ({
            ...state,
            tasks: state.tasks.filter((task) => task.id !== id),
          }))
        ),
        switchMap((id) => this.apiService.deleteTask(id)),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  private setTasks(tasks: Task[]): void {
    this.state.update((state) => ({ ...state, tasks }));
  }
  private setIsLoading(isLoading: boolean) {
    this.state.update((state) => ({ ...state, isLoading }));
  }
  private setTaskAdding(taskAdding: boolean) {
    this.state.update((state) => ({ ...state, taskAdding }));
  }

  addTask(task: string) {
    this.add$.next(task);
  }
  toggleTask(id: number, isDone: boolean) {
    this.toggle$.next({ id, isDone });
  }
  updateTask(id: number, text: string) {
    this.update$.next({ id, text });
  }
  deleteTask(id: number) {
    this.delete$.next(id);
  }
}
