import {Component, Input, OnInit} from '@angular/core';
import {WebsocketService} from "../services/websocket.service";
import {environment} from "../../environments/environment";
import {StatusUpdateService} from "../services/status-update.service";
import {SeatService} from "../services/seat.service";
import {PlayerboxService} from "../services/playerbox.service";

@Component({
  selector: 'app-playerbox',
  templateUrl: './playerbox.component.html',
  styleUrls: ['./playerbox.component.css']
})
export class PlayerboxComponent implements OnInit {

  @Input() player: string;
  @Input() seat: string;
  @Input() hand: string;

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
      return '1';
    } else {
      return '2';
    }
  }



  ngOnInit() {

  }

  logStuff(stuff: any) {
    if (!environment.production) {
      console.log(stuff);
    }
  }

}
