import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StatusUpdateService {

  updateStatusSubject: Subject<boolean> = new Subject<boolean>();
  navBarVisible: Subject<boolean> = new Subject<boolean>();

  constructor() {
  }

  //navbar
  hideNavBar(value){
    this.navBarVisible.next(value);
  }

  //status
  showStatus(){
    this.updateStatusSubject.next(false);
  }
  hideStatus(){
    this.updateStatusSubject.next(true);
  }
}
