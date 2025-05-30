import { Component, inject, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from "../../Task";
import { NgFor } from '@angular/common';
import { TaskItemComponent } from '../task-item/task-item.component';
import { AddTaskComponent } from "../add-task/add-task.component";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [NgFor, TaskItemComponent, AddTaskComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit{
  tasks: Task[] = [];
  sortBy: 'dateDue' | 'dateAdded' | 'priority' = 'dateDue';
  editingTaskId: number | null = null;
  editingTask: Task | null = null;
  taskService = inject(TaskService);
  private lastDeletedTask: Task | null = null;

  constructor(private toastr: ToastrService) {}

  task = {
    title: '',
    description: ''
  };

  get sortedTasks(): Task[] {
    const tasksCopy = [...this.tasks];
    tasksCopy.sort((a, b) => {
      if (a.completed === b.completed) return 0;
      return a.completed ? 1 : -1;
    });

    switch (this.sortBy) {
      case 'dateAdded':
        return tasksCopy.sort((a, b) => {
          if (a.completed !== b.completed) return a.completed ? 1 : -1;
          return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
        });
      case 'priority':
        const priorityOrder: Record<string, number> = { 'High': 1, 'Medium': 2, 'Low': 3 };
        return tasksCopy.sort((a, b) => {
          if (a.completed !== b.completed) return a.completed ? 1 : -1;
          return (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4);
        });
      case 'dateDue':
      default:
        return tasksCopy.sort((a, b) => {
          if (a.completed !== b.completed) return a.completed ? 1 : -1;
          return new Date(a.dateDue).getTime() - new Date(b.dateDue).getTime();
        });
    }
  }

  setSort(sortType: 'dateDue' | 'dateAdded' | 'priority') {
    this.sortBy = sortType;
  }

  ngOnInit(): void {
    this.taskService.getTasks()
    .subscribe(
      (tasks) => (this.tasks = tasks));
  }

  deleteTask(task: Task) {
    if (confirm("Are you sure you want to delete this task?")) {
      this.lastDeletedTask = task;
      this.taskService.deleteTasks(task)
        .subscribe(() => {
          this.tasks = this.tasks.filter(t => t.id !== task.id);

          const toast = this.toastr.show(
            'Task deleted. Click here to undo.',
            '     ',
            {
              disableTimeOut: false,
              timeOut: 5000,
              closeButton: true,
              tapToDismiss: false,
            }
          );

          if (toast && toast.onTap) {
            toast.onTap.subscribe(() => this.undoDelete());
          }
        });
    }
  }

  undoDelete() {
    if (this.lastDeletedTask) {
      this.taskService.addTask(this.lastDeletedTask).subscribe((restoredTask) => {
        this.tasks.push(restoredTask);
        this.lastDeletedTask = null;
        this.toastr.success('Task restored');
      });
    }
  }

  onEditTask(task: Task) {
    if (this.editingTaskId === task.id) {
      this.editingTaskId = null;
      this.editingTask = null;
    } else {
      this.editingTaskId = task.id ?? null;
      this.editingTask = { ...task };
    }
  }

  toggleReminder(task : Task){
    task.completed = !task.completed;
    this.taskService.updateTaskReminder(task).subscribe();
  }

  updateTask(updatedTask: Task) {
    this.taskService.updateTask(updatedTask).subscribe((savedTask) => {
      const index = this.tasks.findIndex(t => t.id === updatedTask.id);
      if (index !== -1) {
        this.tasks[index] = savedTask;
      }
      this.editingTaskId = null;
      this.editingTask = null;
    });
  }

  addTask(task : Task) {
    this.taskService.addTask(task)
    .subscribe(
      (task) => (this.tasks.push(task)));
  }
}
