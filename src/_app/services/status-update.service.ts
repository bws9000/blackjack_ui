import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StatusUpdateService {

  public currentSeatedPlayers: number;

  updateStatusSubject: Subject<boolean> = new Subject<boolean>();
  navBarVisible: Subject<boolean> = new Subject<boolean>();
  watchersPlayers: Subject<Object> = new Subject<Object>();

  constructor() {}


  watchPlay(value) {
    this.watchersPlayers.next(value);
  }

  //navbar
  hideNavBar(value) {
    this.navBarVisible.next(value);
  }

  //status
  showStatus() {
    this.updateStatusSubject.next(false);
  }

  hideStatus() {
    this.updateStatusSubject.next(true);
  }
}
