import { Component, OnInit, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task } from '../../Task';
import { UiService } from '../../services/ui.service';
import { Subscription } from 'rxjs';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css'
})
export class AddTaskComponent implements OnInit{
  @Input() editTask: Task | null = null;
  @Output() onAddTask: EventEmitter<Task> = new EventEmitter();
  @Output() updateTask = new EventEmitter<Task>();
  
  text: string = "";
  date!: Date;
  currentDate: Date = new Date();
  priority: string = "";
  completed: boolean = false;

  showAddTask: boolean = false;
  subscription!: Subscription;
  uiService = inject(UiService);

  onSubmit() {
    if(!this.text || this.text.trim() === "" || this.date == null || this.priority === ""){ 
      alert("Please complete the form!");
      return;
    }


    const newTask: Task = {
      text: this.text,
      dateAdded: this.editTask ? this.editTask.dateAdded : this.currentDate,
      dateDue: this.date,
      priority: this.priority,
      completed: this.completed,
      id: this.editTask ? this.editTask.id : undefined
    }

    if (this.editTask) {
      this.updateTask.emit(newTask);
    } else {
      this.onAddTask.emit(newTask);
    }

    this.text = "";
    this.date = this.currentDate;
    this.priority = "";
    this.completed = false;
    this.showAddTask = false;

    this.uiService.toggleAddTask();
  }

  constructor(){
    this.currentDate = new Date();
  }

  ngOnInit() : void {
    this.subscription = this.uiService
    .onToggle().subscribe
    (value => this.showAddTask = value);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges', changes);
    if (changes['editTask']) {
      if (this.editTask) {
        this.text = this.editTask.text;
        this.date = this.editTask.dateDue;
        this.priority = this.editTask.priority;
        this.completed = this.editTask.completed;
        this.showAddTask = true;
      } else {
        this.text = '';
        this.date = this.currentDate;
        this.priority = '';
        this.completed = false;
      };
    }
  }

  updateCurrentDate() : void {
    setInterval(() => {
      this.currentDate = new Date();
    }, 1000)
  }
}
