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
  sitOrLeave: boolean;
  sitOrLeaveText: string;
  isHidden: boolean;

  constructor(private wss: WebsocketService,
              private seatService:SeatService,
              private statusUpdateService: StatusUpdateService) {

    this.sitOrLeaveText = 'SIT DOWN';
    this.isHidden = false;
    this.sitOrLeave = true;

    this.statusUpdateService.showAllSeatsAfterStandUp.subscribe(v => {
      let s = JSON.stringify(v);
      let o = JSON.parse(s);
      let sittingAt = o.player;
      let doEmit = o.doEmit;

      console.log('------------------------------>'+this.player);
      if(doEmit){
        this.isHidden = false;
      }
    });

    /*
    this.statusUpdateService.sitButton.subscribe(v => {

      let s = JSON.stringify(v);
      let o = JSON.parse(s);
      let playerbox = o.playerbox; //0-4
      let doEmit = o.doEmit; //true/false

      if (this.player == playerbox) {

        console.log('doEmit: ' + doEmit);

        if (doEmit) {
          if (!this.sitOrLeave) {
            console.log('EMIT STANDUP');
            this.wss.emit('standUpTableOne', {player: this.player});
            this.sitOrLeaveText = 'SIT DOWN';
            this.sitOrLeave = true;
            this.statusUpdateService.showSeats({
              value: true, doEmit: true, sitOrLeave: true,
              player: this.player
            });
          } else {
            console.log('EMIT SIT DOWN');
            this.wss.emit('sitTableOne', {player: this.player});
            this.sitOrLeaveText = 'STAND UP';
            this.sitOrLeave = false;
          }
        } else {
          this.isHidden = this.isHidden != true;
        }
      } else {
        if (doEmit) {
          this.isHidden = true;
        }
      }
    });
    */

  }

  sitStandUpTable2(playerBox) {
    let pb = playerBox;
    let de = true;
    let send = {playerbox: pb, doEmit: de};
    //this.statusUpdateService.sitState(send);
  }

  ngOnInit() {
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
