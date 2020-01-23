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
  action: boolean;

  constructor(private wss: WebsocketService,
              private playerboxService: PlayerboxService) {

    this.playerboxService.playerAction.subscribe(value => {

      let j = JSON.stringify(value);
      let o = JSON.parse(j);
      let seat = o.seat;
      //let broadcast = o.broadcast;

      if (seat === this.player) {
        this.action = true;
        this.playerInnerbox();
      }

    });

    this.playerboxService.resetSubject.subscribe(value => {
      let j = JSON.stringify(value);
      let o = JSON.parse(j);
      let seat = o.seat;
      if(this.player === seat) {
        this.action = false;
        this.playerInnerbox();
      }
    });

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
    if (!this.action) {
      if (this.sitting) {
        return '1';
      } else {
        return '2';
      }
    } else {
      return '3';
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
