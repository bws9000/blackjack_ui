import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StatusMessageService {
  message: Subject<string> = new Subject<string>();

  constructor() {
  }

  statusMessage(message) {
    this.message.next(message);
  }
}
