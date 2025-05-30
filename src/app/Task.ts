import { Time } from "@angular/common";

export interface Task {
  id?: number;
  text: string;
  dateAdded: Date;
  dateDue: Date;
  priority: string;
  completed: boolean;
}