import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {WebsocketService} from "../websocket.service";
import {environment} from "../../environments/environment";
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {StatusUpdateService} from "../status-update.service";
import {SeatService} from "../seat.service";
import {TableService} from "../table.service";

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
              private tableService: TableService,
              private router: Router, private _location: Location) {


    //this.watchers = 0;
    //this.players = 0;
    this.playerSeats = {};

    this.statusUpdateService.hideNavBar(false);
  }

  leaveTable() {
    this.router.navigate(['/tables']).then((r) => {
      this.logStuff('no longer in room: table' + this.tableService.tableNum);
    });

    //NG DESTROY GETS CALLED BELOW NOT NEEDED/
    //let table = this.tableService.tableNum;
    //this.wss.emit('leaveTable', {table: table});
    //this.statusUpdateService.hideNavBar(true);
  }

  //EVENTS
  tableDetailHeartBeat(data) {
    this.watchers = data.watcherCount;
    this.players = data.playerCount;
    this.logStuff('w: ' + this.watchers + ' p: ' + this.players);

    let playerSeats = JSON.parse(data.playerSeats);
    this.seatService.updateSeats(playerSeats);
  }

  satDownTableEmit(data) {
    if (!data.broadcast) {
      this.wss.startChange.next(true);
      this.statusUpdateService.showStatus();
    }
    this.seatService.sitDown(
      data.sitting,
      data.broadcast,
      data.tableName);
  }

  standUpTableEmit(data) {
    if (!data.broadcast) {
      this.wss.startChange.next(true);
    }
    this.seatService.standUp(
      data.standing,
      data.broadcast,
      data.tableName);
  }

  memberOfRoomEmit(data) {
    this.wss.startChange.next(true);
    if (!data.member) {
      this.router.navigate(['/tables']).then((r) => {
        this.logStuff('no longer in room: ' + JSON.stringify(data));
      });
    }
  }

  ngOnInit() {

    if (this.wss.start) {

      let tableNum = this.tableService.tableNum;
      this.wss.emit('verifyRoomMember', {room: tableNum});

      this.wss
        .onEvent('memberOfRoomEmit')
        .subscribe(data => this.memberOfRoomEmit(data));

      this.wss
        .onEvent('satDownTableEmit')
        .subscribe(data => this.satDownTableEmit(data));

      this.wss
        .onEvent('standUpTableEmit')
        .subscribe(data => this.standUpTableEmit(data));

      this.wss
        .onEvent('tableDetailHeartBeat')
        .subscribe(data => this.tableDetailHeartBeat(data));


    } else {
      this.router.navigate(['/tables']).then((r) => {
        //do something...
      })
    }
  }

  ngOnDestroy() {
    //leave room/table
    let table = this.tableService.tableNum;
    this.logStuff('NG ON DESTROY CALLED');
    this.wss.emit('leaveTable', {table: table});
    this.statusUpdateService.hideNavBar(true);
  }

  logStuff(stuff: any) {
    if (!environment.production) {
      console.log(stuff);
    }
  }

}
