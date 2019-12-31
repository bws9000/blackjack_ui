import {Component, Input, OnInit} from '@angular/core';
import {WebsocketService} from "../websocket.service";
import {environment} from "../../environments/environment";
import {StatusUpdateService} from "../status-update.service";
import {SeatService} from "../seat.service";

@Component({
  selector: 'app-playerbox',
  templateUrl: './playerbox.component.html',
  styleUrls: ['./playerbox.component.css']
})
export class PlayerboxComponent implements OnInit {

  @Input() player: string;
  @Input() seat: string;

  constructor(private wss: WebsocketService,
              private seatService:SeatService,
              private statusUpdateService: StatusUpdateService) {

  }

  getHands(data){
    this.wss.startChange.next(true);
    let d = JSON.stringify(data);
    this.logStuff(d);
  }

  ngOnInit() {

    this.wss
      .onEvent('getHandsEmit')
      .subscribe(data => this.getHands(data));

    /*
    switch (this.player) {
      case "0":
        this.logStuff('Player ' + this.player + ' Ready');
        break;
      case "1":
        this.logStuff('Player ' + this.player + ' Ready');
        break;
      case "2":
        this.logStuff('Player ' + this.player + ' Ready');
        break;
      case "3":
        this.logStuff('Player ' + this.player + ' Ready');
        break;
      case "4":
        this.logStuff('Player ' + this.player + ' Ready');
        break;
      default:
        break;
    }
    */

  }

  logStuff(stuff: any) {
    if (!environment.production) {
      console.log(stuff);
    }
  }

}
