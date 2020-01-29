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
import {WebsocketService} from "./services/websocket.service";
import {environment} from "../environments/environment";
import {StatusUpdateService} from "./services/status-update.service";
import {SeatService} from "./services/seat.service";
import {PlayerboxService} from "./services/playerbox.service";
import {TableService} from "./services/table.service";
import {PlaceBetsService} from "./services/place-bets.service";
import {StatusMessageService} from "./services/status-message.service";
import {HandService} from "./services/hand.service";
import {PlayerDashService} from "./services/player-dash.service";
import {SocketObservable} from "./SocketObservable";

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
              private playerboxService: PlayerboxService,
              private tableService: TableService,
              private placeBetsService: PlaceBetsService,
              private sms: StatusMessageService,
              private handService: HandService,
              private playerDashService: PlayerDashService) {

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
    this.logStuff('EMIT LEFT TABLE: ' + result);
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
  ////////////////// table emit //////////////////////////
  ////////////////////////////////////////////////////////

  getHands(data) {

    this.logStuff(JSON.stringify(data));
    this.wss.startChange.next(true);
    //this.placeBetsService.updateBanks(data.playerBanks);
    /* too soon, place bets first */

    this.handService.getPlayerHands(data.playerHands);
    this.handService.getDealerHand(data.dealerHand);


    let that = this;
    setTimeout(()=>{
      that.playerDashService.updateVisible(true,data.justBet);
    },900);

    //let d = JSON.stringify(data);
    //this.logStuff(d);
  }

  //1st PLAYER SITS DOWN
  playersBetting(data) {
    this.wss.startChange.next(true);
    if (!data.broadcast) {
      this.tableService.tablePlaying = true;
      this.placeBetsService.setVisible(true, data.initSeat ,data.table);
    }else{
      this.sms.statusMessage(data.status);//player x is betting
    }
    //let d = JSON.stringify(data);
    //this.logStuff(d);
  }

  nextPlayerBetEmit(data) {

    this.sms.statusMessage(data.status);
    this.playerboxService.setAction(data.nextPlayer, data.broadcast);//green graphic
    this.playerboxService.reset(data.justBet);
    this.wss.startChange.next(true);


    if (data.status === 'ready to deal cards') {
      this.wss.emit('tablePlaying', {
        table: this.tableService.tableNum,
        seat:data.justBet
      });
    }


    if (this.seatService.currentSeat === data.nextPlayer
      && this.seatService.currentSeat !== undefined) {
      this.placeBetsService.currentBank = data.chips;
      this.placeBetsService.setVisible(true, data.nextPlayer ,data.table);
      this.placeBetsService.setStatus(false, data.nextPlayer);
    }

  }

  standUpTableEmit(data) {
    if (!data.broadcast) {
      this.wss.startChange.next(true);
    }
    this.seatService.standUp(
      data.standing,
      data.broadcast,
      data.tableName);

    //remove hands
    if (this.seatService.currentSeats < 2) {
      this.tableService.tablePlaying = false;
    }
    this.handService.seatStand(data.standing);
    this.seatService.currentSeat = undefined;

    //green graphic
    this.playerboxService.reset(this.seatService.currentSeat);
    this.playerboxService.reset(data.standing);
  }


  /*
  playerAction(action) {
    let seat = this.seatService.currentSeat;
    let socketid = this.wss.socketId;
    let table = this.tableService.tableNum;
    this.wss.emit('playerAction', {
      action: action,
      id: socketid,
      table: table,
      seat: seat
    });
  }
  */



  /*
  actionStatusEmit(data) {
    this.wss.startChange.next(true);
    if (this.seatService.currentSeat === data.seat) {
      this.placeBetsService.currentBank = data.returnData;
      this.placeBetsService.setVisible(true, this.seatService.currentSeat,data.tableName);
      this.placeBetsService.setStatus(false, data.seat);
    }
    this.playerboxService.setAction(data.seat, data.broadcast);//graphic
  }
  */

  satDownTableEmit(data) {

    let broadcast = JSON.parse(data.broadcast);

    if (!broadcast) {
      this.wss.startChange.next(true);
      ///////////////////////////////////////////////////////////////////
      this.seatService.currentSeat = data.sitting; //where i am right now
      ///////////////////////////////////////////////////////////////////
      if (data.playerCount === 1) {
        this.statusUpdateService.showStatus();
      }
    }

    if (!broadcast) {
      if (this.tableService.tablePlaying) {

      }
    }

    this.seatService.sitDown(
      data.sitting,
      data.broadcast,
      data.tableName);
  }

  ////////////////////////////////////////////////////
  ////////////////////////////////////////////////////
  ////////////////////////////////////////////////////

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


      //////////////////////////////TABLE///////////////////////////
      this.wss
        .onEvent('satDownTableEmit')
        .subscribe(data => this.satDownTableEmit(data));

      this.wss
        .onEvent('nextPlayerBetEmit')
        .subscribe(data => this.nextPlayerBetEmit(data));

      /*
      this.wss
        .onEvent('actionStatusEmit')
        .subscribe(data => this.actionStatusEmit(data));
      */

      this.wss
        .onEvent('playersBettingEmit')
        .subscribe(data => this.playersBetting(data));

      this.wss
        .onEvent('getHandsEmit')
        .subscribe(data => this.getHands(data));

      this.wss
        .onEvent('standUpTableEmit')
        .subscribe(data => this.standUpTableEmit(data));

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
