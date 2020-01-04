import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {WebsocketService} from "./websocket.service";
import {TableService} from "./table.service";

@Injectable({
  providedIn: 'root'
})
export class SeatService {

  playerSeats: Subject<Array<any>> = new Subject<Array<any>>();
  sitState: Subject<Object> = new Subject<Object>();
  standState: Subject<Object> = new Subject<Object>();
  //initState: Subject<Array<any>> = new Subject<Array<any>>();
  is: Array<any>;

  constructor(private wss: WebsocketService,
              private tableService: TableService) {
    let is = [];
  }

  setInitState(data, tableNum) {
    this.is = data;
    this.tableService.tableNum = tableNum;
  }

  getInitState() {
    return this.is;
  }

  sitDown(seat, bc, tableName: string) {
    let data = {
      sitting: seat,
      broadcast: bc,
      tableName: tableName
    };
    this.sitState.next(data);
  }

  standUp(seat, bc, tableName: string) {
    let data = {
      sitting: seat,
      broadcast: bc,
      tableName: tableName
    };
    this.standState.next(data);
  }

  updateSeats(playerSeats) {
    let ps = JSON.parse(playerSeats);
    this.playerSeats.next(ps);
  }
}
