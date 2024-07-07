import { Task } from './task';

export type NewTask = Omit<Task, 'id'>;
