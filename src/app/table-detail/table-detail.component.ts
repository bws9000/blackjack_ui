import {Component, OnDestroy, OnInit} from '@angular/core';
import {WebsocketService} from "../websocket.service";
import {environment} from "../../environments/environment";
import {Router} from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-table-detail',
  templateUrl: './table-detail.component.html',
  styleUrls: ['./table-detail.component.css']
})
export class TableDetailComponent implements OnInit, OnDestroy {
  sitOrLeave: boolean;
  sitOrLeaveText: string;
  watchers: number;
  players: number;

  constructor(private wss: WebsocketService,
              private router: Router, private _location: Location) {
    this.sitOrLeaveText = 'SIT DOWN';
    this.watchers = 0;
    this.players = 0;


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

  leaveTable(){
    this.wss.emit('leaveTableOne', {room: 'tableone'});
  }

  logEvent(data: any) {
    let result = JSON.stringify((data));
    this.logStuff(result);
  }

  //EVENTS
  tableDetailHeartBeat(data) {
    this.watchers = data.watcherCount;
    this.players = data.playerCount;
    this.logStuff('w: ' + this.watchers + ' p: ' + this.players);
  }

  satDownAtTableOneEmit(data) {
    this.wss.startChange.next(true);
    this.logStuff('sat down at table one ' + JSON.stringify(data));
  }

  standUpTableOneEmit(data) {
    this.wss.startChange.next(true);
    this.logStuff('left table one ' + JSON.stringify(data));
  }

  memberOfRoomEmit(data) {
    this.wss.startChange.next(true);
    if(!data.member){
      this.router.navigate(['/tables']);
      alert('you are no longer at this table');
    }
  }

  ngOnInit() {

    if (this.wss.start) {

      this.wss.emit('verifyRoomMember', {room: 'tableone'});

      this.wss
        .onEvent('memberOfRoomEmit')
        .subscribe(data => this.memberOfRoomEmit(data));

      this.wss
        .onEvent('satDownAtTableOneEmit')
        .subscribe(data => this.satDownAtTableOneEmit(data));

      this.wss
        .onEvent('standUpTableOneEmit')
        .subscribe(data => this.standUpTableOneEmit(data));

      this.wss
        .onEvent('tableDetailHeartBeat')
        .subscribe(data => this.tableDetailHeartBeat(data));


    } else {
      this.router.navigate(['/tables']);
    }
  }

  ngOnDestroy() {
    //leave room/table
    this.wss.emit('leaveTableOne', {room: 'tableone'});
  }

  logStuff(stuff: any) {
    if (!environment.production) {
      console.log(stuff);
    }
  }

}
