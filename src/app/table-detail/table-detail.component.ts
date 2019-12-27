import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {WebsocketService} from "../websocket.service";
import {environment} from "../../environments/environment";
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {StatusUpdateService} from "../status-update.service";
import {SeatService} from "../seat.service";

@Component({
  selector: 'app-table-detail',
  templateUrl: './table-detail.component.html',
  styleUrls: ['./table-detail.component.css']
})
export class TableDetailComponent implements OnInit, OnDestroy {
  @Input() player: string;
  watchers: number;
  players: number;
  playerSeats: Object;

  constructor(private wss: WebsocketService,
              private statusUpdateService: StatusUpdateService,
              private seatService: SeatService,
              private router: Router, private _location: Location) {


    this.watchers = 0;
    this.players = 0;
    this.playerSeats = {};

    this.statusUpdateService.hideNavBar(false);
  }

  leaveTable() {
    this.wss.emit('leaveTableOne', {room: 'tableone'});
    this.statusUpdateService.hideNavBar(true);
  }

  //EVENTS
  tableDetailHeartBeat(data) {

    this.watchers = data.watcherCount;
    this.players = data.playerCount;
    this.logStuff('w: ' + this.watchers + ' p: ' + this.players );

    let playerSeats = JSON.parse(data.playerSeats);
    this.seatService.updateSeats(playerSeats);
  }

  satDownAtTableOneEmit(data) {
    if (this.wss.socketBroadcastMatch(data.socketid)) {
      this.wss.startChange.next(true);
      this.statusUpdateService.showStatus();
    } else {
      this.seatService.sitDown(false, data.sitting);
    }
  }

  standUpTableOneEmit(data) {
    if (this.wss.socketBroadcastMatch(data.socketid)) {
      this.wss.startChange.next(true);
    } else {
      this.seatService.standUp(false, data.standing);
    }
  }

  memberOfRoomEmit(data) {
    this.wss.startChange.next(true);
    if (!data.member) {
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
    this.logStuff('NG ON DESTROY CALLED');
    this.wss.emit('leaveTableOne', {room: 'tableone'});
    this.statusUpdateService.hideNavBar(true);
  }

  logStuff(stuff: any) {
    if (!environment.production) {
      console.log(stuff);
    }
  }

}
