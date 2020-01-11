import {AfterViewChecked, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {WebsocketService} from "../services/websocket.service";
import {environment} from "../../environments/environment";
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {StatusUpdateService} from "../services/status-update.service";
import {SeatService} from "../services/seat.service";
import {TableService} from "../services/table.service";
import { PlatformLocation } from '@angular/common'
import {HandService} from "../services/hand.service";

@Component({
  selector: 'app-table-detail',
  templateUrl: './table-detail.component.html',
  styleUrls: ['./table-detail.component.css']
})

export class TableDetailComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Input() player: string;
  watchers: any;
  players: any;
  playerSeats: Object;

  socketid:any;
  broadcast:any;

  constructor(private wss: WebsocketService,
              private statusUpdateService: StatusUpdateService,
              private seatService: SeatService,
              private tableService: TableService,
              private handService: HandService,
              private router: Router,
              private location: PlatformLocation) {

    location.onPopState(() => {
      this.router.navigate(['/']).then((r) => {
        this.leaveTable();
      });
    });

    this.playerSeats = {};
    this.statusUpdateService.hideNavBar(false);

    this.statusUpdateService.watchersPlayers.subscribe(value => {
      let j = JSON.stringify(value);
      let o = JSON.parse(j);

      this.socketid = o.socketid;
      this.broadcast = o.broadcast;

      this.watchers = o.watcherCount;
      this.players = o.playerCount;

    });
  }

  leaveTable() {
    this.router.navigate(['/tables']).then((r) => {
      this.logStuff('no longer in room: table' + this.tableService.tableNum);
      let table = this.tableService.tableNum;
      this.wss.emit('leaveTable', {table: table});
    });
  }

  satDownTableEmit(data) {
    let broadcast = JSON.parse(data.broadcast);
    if (!broadcast) {
      this.wss.startChange.next(true);
      if(data.playerCount === 1) {
        this.statusUpdateService.showStatus();
      }
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

  getHands(data) {
    this.wss.startChange.next(true);
    this.handService.getPlayerHands(data.playerHands);
    //let d = JSON.stringify(data);
    //this.logStuff(d);
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
        .onEvent('getHandsEmit')
        .subscribe(data => this.getHands(data));


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

  ngAfterViewChecked(): void {
    //console.log('VIEWCHECKED');
  }

}
