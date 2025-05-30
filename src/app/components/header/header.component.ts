import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { TasksComponent } from '../tasks/tasks.component';
import { UiService } from '../../services/ui.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ButtonComponent, TasksComponent, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {
  title = "Task Tracker";
  showAddTask!: boolean;
  subscription!: Subscription;
  uiService = inject(UiService);

  constructor(private router : Router){}

  toggleAddTask(){
    this.uiService.toggleAddTask();
    this.subscription = this.uiService.onToggle().subscribe(value => this.showAddTask = value);
  }

  hasRoute(route : string){
    return this.router.url === route;
  }
}
