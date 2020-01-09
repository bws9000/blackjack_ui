import {Component, Input, OnInit} from '@angular/core';
import {WebsocketService} from "../websocket.service";
import {environment} from "../../environments/environment";
import {StatusUpdateService} from "../status-update.service";
import {SeatService} from "../seat.service";
import {PlayerboxService} from "../playerbox.service";

@Component({
  selector: 'app-playerbox',
  templateUrl: './playerbox.component.html',
  styleUrls: ['./playerbox.component.css']
})
export class PlayerboxComponent implements OnInit {

  @Input() player: string;
  @Input() seat: string;

  //playerInnerBox
  background: string;
  sitting: boolean;

  constructor(private wss: WebsocketService,
              private playerboxService: PlayerboxService) {

    this.playerboxService.playerSeats.subscribe(value => {

      this.sitting = false;

      if (value.length) {
        for (let i = 0; i < value.length; i++) {
          let seat = value[i][1];
          if (seat === this.player) {
            this.sitting = true;
          }
        }
      }

    });

  }

  playerInnerbox() {
    if (this.sitting) {
      return 'playerbox1.png';
    } else {
      return 'playerbox2.png';
    }
  }

  getHands(data) {
    this.wss.startChange.next(true);
    let d = JSON.stringify(data);
    this.logStuff(d);
  }

  ngOnInit() {
    this.wss
      .onEvent('getHandsEmit')
      .subscribe(data => this.getHands(data));
  }

  logStuff(stuff: any) {
    if (!environment.production) {
      console.log(stuff);
    }
  }

}
