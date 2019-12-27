import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {WebsocketService} from "./websocket.service";

@Injectable({
  providedIn: 'root'
})
export class SeatService {

  sitButton: Subject<Object> = new Subject<Object>();
  standButton: Subject<Object> = new Subject<Object>();
  hide: Subject<string> = new Subject<string>();
  show: Subject<string> = new Subject<string>();
  playerSeats: Subject<Array<any>> = new Subject<Array<any>>();

  constructor(private wss:WebsocketService) {
  }

  sitDown(doEmit, seat) {
    let send = {seat: seat, doEmit: doEmit};
    this.sitButton.next(send);
  }

  standUp(doEmit, seat) {
    let send = {seat: seat, doEmit: doEmit};
    this.standButton.next(send);
  }

  hideSeats(id) {
    this.hide.next(id);
  }

  showSeats(id){
    this.show.next(id);
  }

  updateSeats(playerSeats){
    this.playerSeats.next(playerSeats);
  }
}
