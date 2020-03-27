import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PlayerboxService {

  playerSeats: Subject<Array<any>> = new Subject<Array<any>>();
  playerAction: Subject<Object> = new Subject<Object>();
  resetSubject: Subject<Object> = new Subject<Object>();

  constructor() {

  }

  seats(playerSeats) {
    let ps = JSON.parse(playerSeats);
    this.playerSeats.next(ps);
  }

  setAction(seat, broadcast, action) {
    let data = {seat: seat, broadcast: broadcast, action};
    this.playerAction.next(data);
  }

  reset(seat) {
    let data = {seat: seat};
    this.resetSubject.next(data);
  }

}
