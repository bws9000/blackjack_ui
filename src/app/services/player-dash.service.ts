import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class PlayerDashService {

  visible: Subject<Object> = new Subject<Object>();
  hide: Subject<string> = new Subject<string>();
  seatInFocus: number;

  constructor() {
    this.seatInFocus = undefined;
  }

  hideDash(seat){
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
