import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {WebsocketService} from "./websocket.service";

@Injectable({
  providedIn: 'root'
})
export class SeatService {

  playerSeats: Subject<Array<any>> = new Subject<Array<any>>();
  sitState: Subject<Object> = new Subject<Object>();
  standState: Subject<Object> = new Subject<Object>();
  //initState: Subject<Array<any>> = new Subject<Array<any>>();
  is: Array<any>;

  constructor(private wss:WebsocketService) {
    let is = [];
  }

  setInitState(data){
    this.is = data;
  }

  getInitState(){
    return this.is;
  }

  sitDown(seat, bc) {
    let data = {sitting: seat, broadcast: bc};
    this.sitState.next(data);
  }

  standUp(seat, bc) {
    let data = {sitting: seat, broadcast: bc};
    this.standState.next(data);
  }

  updateSeats(playerSeats){
    this.playerSeats.next(playerSeats);
  }
}
