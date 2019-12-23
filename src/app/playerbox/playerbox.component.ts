import {Component, Input, OnInit} from '@angular/core';
import {WebsocketService} from "../websocket.service";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-playerbox',
  templateUrl: './playerbox.component.html',
  styleUrls: ['./playerbox.component.css']
})
export class PlayerboxComponent implements OnInit {

  @Input() player: string;
  sitOrLeave: boolean;
  sitOrLeaveText: string;

  constructor(private wss: WebsocketService) {
    this.sitOrLeaveText = 'SIT DOWN';
  }

  sitStandUpTable(table: any) {
    this.sitOrLeave = (this.sitOrLeave != true);
    this.sitOrLeaveText = (this.sitOrLeave) ? 'STAND UP' : 'SIT DOWN';
    if (!this.sitOrLeave) {
      this.wss.emit('standUpTableOne', {sit: 0});
    } else {
      this.wss.emit('sitTableOne', {left: 0});
    }
  }

  ngOnInit() {
    switch (this.player) {
      case "0":
        this.logStuff('Player '+this.player + ' Ready');
        break;
      case "1":
        this.logStuff('Player '+this.player + ' Ready');
        break;
      case "2":
        this.logStuff('Player '+this.player + ' Ready');
        break;
      case "3":
        this.logStuff('Player '+this.player + ' Ready');
        break;
      case "4":
        this.logStuff('Player '+this.player + ' Ready');
        break;
      default:
        break;
    }
  }

  logStuff(stuff: any) {
    if (!environment.production) {
      console.log(stuff);
    }
  }

}
