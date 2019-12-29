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
  sitState: Subject<Object> = new Subject<Object>();
  standState: Subject<Object> = new Subject<Object>();
  initState: Subject<Object> = new Subject<Object>();

  constructor(private wss:WebsocketService) {
  }

  initTableState(data){
    this.initState.next(data);
  }

  sitDown(seat, bc) {
    let data = {sitting: seat, broadcast: bc};
    this.sitState.next(data);
  }

  standUp(seat, bc) {
    let data = {sitting: seat, broadcast: bc};
    this.standState.next(data);
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
