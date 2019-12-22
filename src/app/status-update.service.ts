import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StatusUpdateService {

  updateStatusSubject: Subject<boolean> = new Subject<boolean>();

  constructor() {
  }

  showStatus(){
    this.updateStatusSubject.next(false);
  }
  hideStatus(){
    this.updateStatusSubject.next(true);
  }
}
