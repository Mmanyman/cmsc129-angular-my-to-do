import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Task } from "../../Task";
import { faTimes, faEdit, faCalendarCheck, faCalendarPlus, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgClass, NgStyle, NgIf, CommonModule } from '@angular/common';
import { AddTaskComponent } from "../add-task/add-task.component";


@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [FaIconComponent, NgStyle, NgClass, NgIf, AddTaskComponent, CommonModule],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css'
})
export class TaskItemComponent implements OnInit{
  @Input() task!: Task;
  @Input() isEditing: boolean = false;
  @Input() editTask: Task | null = null;
  @Output() onUpdateTask = new EventEmitter<Task>();
  @Output() onDeleteTask: EventEmitter<Task> = new EventEmitter();
  @Output() onToggleReminder: EventEmitter<Task> = new EventEmitter();
  @Output() onEditTask = new EventEmitter<Task>();

  faTimes = faTimes;
  faEdit = faEdit;
  faCalendarCheck = faCalendarCheck;
  faCalendar = faCalendarPlus;
  faExclamation = faExclamationCircle;
  isHigh : boolean = false;
  isMedium : boolean = false;
  isLow : boolean = false;

  ngOnInit(): void {
    if (this.task.priority == "High"){
      this.isHigh;
    } else if (this.task.priority == "Medium"){
      this.isMedium = true;
    } else {
      this.isLow = true;
    }
  }

  onEdit(task : Task) {
    this.onEditTask.emit(task);
  }

  onDelete(task : any) {
    this.onDeleteTask.emit(task);
  }

  onToggle(task : any) {
    this.onToggleReminder.emit(task);
  }

  onUpdate(task : Task) {
    this.onUpdateTask.emit(task);
  }
}
