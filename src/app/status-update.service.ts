import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StatusUpdateService {

  updateStatusSubject: Subject<boolean> = new Subject<boolean>();
  navBarVisible: Subject<boolean> = new Subject<boolean>();

  showAllSeatsAfterStandUp: Subject<Object> = new Subject<Object>();

  constructor() {
  }

  showSeats(data) {
    //
    let v = data.value;
    let de = data.doEmit;
    let sol = data.sitOrLeave;
    let seat = data.player;//seat
    let send = {value: v, doEmit: de, sitOrLeave: sol, player: seat};
    this.showAllSeatsAfterStandUp.next(send);
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
