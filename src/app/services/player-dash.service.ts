import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class PlayerDashService {

  visible: Subject<Object> = new Subject<Object>();
  hide: Subject<string> = new Subject<string>();
  actionResult: Subject<boolean> = new Subject<boolean>();
  splitActiveSubject: Subject<boolean> = new Subject<boolean>();
  splitActive: boolean;
  splitResult: Subject<string> = new Subject<string>();
  hideSplit: Subject<boolean> = new Subject<boolean>();
  seatInFocus: number;
  hideSplitB: Subject<boolean> = new Subject<boolean>();
  hideddB: Subject<boolean> = new Subject<boolean>();

  constructor() {
    this.seatInFocus = undefined;
    this.splitActive = false;
  }

  hideSplitButton(){
    return this.hideSplitB.next(true);
  }
  hideddButton(){
    return this.hideddB.next(true);
  }

  hideSplitStatus() {
    this.hideSplit.next(true);
  }

  setSplitResult(result) {
    this.splitResult.next(result);
  }

  setSplitActiveSubject() {
    this.splitActiveSubject.next();
  }

  setSplitActive(active: boolean) {
    this.splitActive = active;
  }

  getSplitActive() {
    return this.splitActive;
  }

  hitResult() {
    this.actionResult.next(true);
  }

  hideDash(seat) {
    this.hide.next(seat);
  }

  updateVisible(value, seat) {
    let data = {
      value: value,
      seat: seat
    };

    //this.logStuff(JSON.stringify(data));
    this.visible.next(data);
  }

  logStuff(stuff: any) {
    if (!environment.production) {
      console.log(stuff);
    }
  }
}
