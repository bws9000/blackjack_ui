import {AfterViewInit, Component, OnInit} from '@angular/core';
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import {Location} from '@angular/common';

import {
  NavigationCancel,
  Event,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from '@angular/router';
import {WebsocketService} from "./websocket.service";
import {environment} from "../environments/environment";
import {StatusUpdateService} from "./status-update.service";
import {SeatService} from "./seat.service";
import {PlayerboxService} from "./playerbox.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  loadingWheelVisible: string;
  isHidden: boolean;
  count: number;

  constructor(private loadingBar: SlimLoadingBarService,
              private wss: WebsocketService,
              private statusUpdateService: StatusUpdateService,
              private router: Router,
              private location: Location,
              private seatService: SeatService,
              private playerboxService: PlayerboxService) {

    this.router.events.subscribe((event: Event) => {
      this.navigationInterceptor(event);
    });

    this.wss.startChange.subscribe(value => {
      if (value) {
        this.loadingWheelVisible = 'hidden';
      } else {
        this.loadingWheelVisible = 'visible';
      }
    });

    this.statusUpdateService.navBarVisible.subscribe(value => {
      this.isHidden = !value;
    });
    this.statusUpdateService.hideNavBar(true);

  }

  ngAfterViewInit(): void {
    //this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = 'black';
  }

  ///////////////////////////////////////////////////////
  joinTable(data) {

    let tableNum = data.tableNum;
    let tableName = 'table' + tableNum;
    this.router.navigate(['/tables/' + tableName]).then(async r => {
      this.wss.startChange.next(true);
      let playerSeats = JSON.parse(data.playerSeats);
      let s = [];
      for (let i = 0; i < playerSeats.length; i++) {
        s.push(playerSeats[i][1]);
      }
      await this.seatService.setInitState(s, tableNum);
    });
  }

  leftTable(data) {
    this.router.navigate(['/tables']).then(r => {
      this.wss.startChange.next(true);
    });
    let result = JSON.stringify((data));
    this.logStuff(result);
  }

  socketReconnect(data) {
    this.router.navigate(['']).then(r => {
      this.wss.startChange.next(true);
      this.connect().then(r => {
        this.logStuff('CONNECTION TYPE: Reconnection Occured.');
      })
    });
    this.logStuff('Reconnection occured: Booted from room'); //temp
    let result = JSON.stringify((data));
    this.logStuff(result);
  }

  tableDetailHeartBeat(data) {
    this.count++;
    //this.logStuff('c: ' + this.count);
    //this.logStuff('w: ' + data.watcherCount + ' p: ' + data.playerCount);
    //this.logStuff('BROADCAST: ' + data.broadcast);
    //this.logStuff('ROOM: ' + data.room);
    //this.logStuff('client socket: ' + this.wss.socketId);
    this.statusUpdateService.watchPlay(data);
    this.seatService.updateSeats(data.playerSeats);
    this.playerboxService.seats(data.playerSeats);
  }

  init(data) {
    this.wss.socketId = data.socketid;
  }

  ////////////////////////////////////////////////////////

  async connect(): Promise<void> {

    this.wss.startChange.next(false);

    let result = await this.wss.authConnect();
    if (result) {

      this.wss.startChange.next(true);
      this.wss.initEvents();


      /////////////////// User Events /////////////////////////
      /////////////////////////////////////////////////////////

      //initEmit
      this.wss
        .onEvent('initEmit')
        .subscribe(data => this.init(data));

      //joinTableEmit
      this.wss
        .onEvent('joinTableEmit')
        .subscribe(data => this.joinTable(data));

      //leftTableOneEmit
      this.wss
        .onEvent('leftTableEmit')
        .subscribe(data => this.leftTable(data));

      //socketReconnect
      this.wss
        .onEvent('socketReconnect')
        .subscribe(data => this.socketReconnect(data));

      this.wss
        .onEvent('tableDetailHeartBeat')
        .subscribe(data => this.tableDetailHeartBeat(data));

      ////////////////// Environment Updates //////////////////////
      /////////////////////////////////////////////////////////////
      //
    }
  }

  ngOnInit() {

    this.count = 0;

    this.connect().then(r => {
      this.logStuff('RECONNECTION TYPE: Initial Connection Occured.');
    })
  }

  private navigationInterceptor(event: Event): void {
    if (event instanceof NavigationStart) {
      this.loadingBar.start();
    }
    if (event instanceof NavigationEnd) {
      this.loadingBar.complete();
    }
    if (event instanceof NavigationCancel) {
      this.loadingBar.stop();
    }
    if (event instanceof NavigationError) {
      this.loadingBar.stop();
    }
  }

  logStuff(stuff: any) {
    if (!environment.production) {
      console.log(stuff);
    }
  }

}
