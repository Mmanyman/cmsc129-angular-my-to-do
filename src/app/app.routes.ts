import { Routes } from '@angular/router';
import { TasksComponent } from './components/tasks/tasks.component';
import { AddTaskComponent } from './components/add-task/add-task.component';

export const routes: Routes = [
  {
    path: '', component: TasksComponent
  },
  {
    path: 'edit', component: AddTaskComponent 
  }
];
