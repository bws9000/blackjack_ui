import {Component, OnInit} from '@angular/core';
import {WebsocketService} from "../websocket.service";
import {environment} from "../../environments/environment";
import {Router} from '@angular/router';

@Component({
  selector: 'app-table-detail',
  templateUrl: './table-detail.component.html',
  styleUrls: ['./table-detail.component.css']
})
export class TableDetailComponent implements OnInit {
  sitOrLeave: boolean;
  sitOrLeaveText: string;
  watchers: number;
  players: number;

  constructor(private wss: WebsocketService, private router:Router) {
    this.sitOrLeaveText = 'SIT AT TABLE';
    this.watchers = 0;
    this.players = 0;
  }

  leaveTable() {
    this.wss.emit('leaveTableOne', {left: 'tableone'});
  }

  sitLeaveTable(table: any) {
    this.sitOrLeave = (this.sitOrLeave != true);
    this.sitOrLeaveText = (this.sitOrLeave) ? 'LEAVE GAME' : 'SIT AT TABLE';
    this.wss.emit('sitTableOne', {sit: 0});
  }

  logEvent(data: any) {
    let result = JSON.stringify((data));
    this.logStuff(result);
  }

  ngOnInit() {
    if (this.wss.start) {
      this.wss
        .onEvent('watchersUpdatedEmit')
        .subscribe(data => this.logEvent(data));

      this.wss
        .onEvent('playersUpdatedEmit')
        .subscribe(data => this.logEvent(data));
    } else {
      this.router.navigate(['/tables']);
    }
  }

  logStuff(stuff: any) {
    if (!environment.production) {
      console.log(stuff);
    }
  }

}
