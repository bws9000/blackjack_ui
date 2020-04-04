import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
//import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import {Location} from '@angular/common';

import {Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
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
import {DashStatusServiceService} from "./services/dash-status-service.service";
import {Observable, Subscription} from "rxjs";
import {MultiDashService} from "./services/multi-dash.service";

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {

  private noActivityTimer;
  private noActivitySubTimer: Subscription;
  private noActivityCount;

  loadingWheelVisible: string;
  isHidden: boolean;
  count: number;

  private timer;
  private subTimer: Subscription;

  constructor(//private loadingBar: SlimLoadingBarService,
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
              private playerDashService: PlayerDashService,
              private dss: DashStatusServiceService,
              private mdService: MultiDashService) {

    this.router.events.subscribe((event: Event) => {
      //this.navigationInterceptor(event);
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

  tableDetailHeartBeat(data) {
    this.count++;
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

  playerAction(data) {

    this.wss.startChange.next(true);
    //this.sms.statusMessage(data.status);

    this.handService.getPlayerHands(data.playerHands);
    this.handService.getDealerHand(data.dealerHand);

    this.logStuff('playerAction: ' + JSON.stringify(data));

    let result = data.result;
    let currentSeat = data.currentSeat;
    let tableName = data.table;
    let socketid = data.socketid;
    let broadcast = data.broadcast;


    //if(result !== 'playing') {

    //}
    //this.dss.activate(result, tableName, currentSeat, socketid, broadcast);

  }

  checkDone(data) {
    this.logStuff(JSON.stringify(data));
    this.wss.startChange.next(true);
  }

  dealerHandEmit(data) {
    this.wss.startChange.next(true);
    this.handService.showAllDealerHand(data.dealerHand);

    let visible = true;
    let dealerResult = data.dealerResult;
    let playerResults = data.playerResults;
    let dealerHandArray = data.dealerHand[0].hand;

    if (this.seatService.sitting) {
      this.mdService.updateVisible(visible, dealerResult, playerResults,
        dealerHandArray);
    }
    this.logStuff('dealerHandEmit => ' + JSON.stringify(data));

    ////////////////////////////////////////
    //stand up but still in table
    if (!this.seatService.sitting) {
      this.playerboxService.resetAllSeats();
    }
    ////////////////////////////////////////
  }

  openBetDashEmit(data) {
    this.clearCards();
    this.logStuff('openBetDash(): ' + JSON.stringify(data));
    ///////////////////////////////////////////////////////
    this.placeBetsService.youCanSitNow = true;
    ///////////////////////////////////////////////////////

    let noPlayers = data.noPlayers;
    this.wss.startChange.next(true);
    if (!noPlayers) {
      this.placeBetsService.setVisible(true, data.seat);
    }
    //this.placeBetsService.currentBank = data.chips;
    //this.placeBetsService.setStatus(false, seat);
  }

  openPlayerDash(data) {

    this.logStuff('openPlayerDash: ' + JSON.stringify(data));
    this.wss.startChange.next(true);

    this.handService.getPlayerHands(data.playerHands);
    this.handService.getDealerHand(data.dealerHand);
    let result = data.result;
    let currentSeat = data.currentSeat;
    let tableName = data.tableName;
    let socketid = data.socketid;
    let broadcast = data.broadcast;


    this.playerDashService.updateVisible(true, currentSeat);
    //this.dss.activate(result, tableName, currentSeat, socketid, broadcast);
    this.handService.handResult = result;
    //this.sms.statusMessage("player " + currentSeat + " is playing");

  }

  clearCards() {
    this.handService.clearPlayerHands();
    this.handService.clearDealerHand();
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
    //this.seatService.currentSeat = undefined;

    //green graphic
    //this.playerboxService.reset(this.seatService.currentSeat);
    //this.playerboxService.reset(data.standing);
  }


  satDownTableEmit(data) {

    let broadcast = JSON.parse(data.broadcast);

    if (!broadcast) {
      this.wss.startChange.next(true);
      this.seatService.currentSeat = data.sitting;
      if (data.playerCount === 1) {
        this.statusUpdateService.showStatus();
      }
    }

    this.seatService.sitDown(
      data.sitting,
      data.broadcast,
      data.tableName);
  }

  actionSeat(data) {
    this.wss.startChange.next(true);
    //this.logStuff('actionSeat: ' + JSON.stringify(data));
    this.playerboxService.setAction(data.actionSeat, data.broadcast, true);//green playerbox
  }

  ////////////////////////////////////////////////////
  ////////////////////////////////////////////////////

  /*
 // it shouldn't take longer
 // than 30 seconds to pick a room
 */
  noActivityReload(t) {
    this.noActivityCount--;
    if (this.noActivityCount === 0) {
      this.noActivityCount = 30;
      window.location.reload();
      this.noActivitySubTimer.unsubscribe();
    }
  }

  socketReconnect(data) {
    this.router.navigate(['']).then(r => {
      this.wss.startChange.next(true);
      this.connect().then(r => {
        this.logStuff('CONNECTION TYPE: Reconnection Occured.');
      })
    });
    this.logStuff(JSON.stringify(data));
  }

  blankEmit(data) {
    this.logStuff(JSON.stringify(data));
    this.wss.startChange.next(true);
  }

  ngOnDestroy(): void {

    if (this.noActivitySubTimer !== undefined) {
      this.noActivitySubTimer.unsubscribe();
    }
    if (this.subTimer !== undefined) {
      this.subTimer.unsubscribe();
    }
  }

  async connect(): Promise<void> {

    let result = await this.wss.authConnect();
    if (result) {

      this.wss.startChange.next(true);
      this.wss.initEvents();

      /////////////////// User Events /////////////////////////
      /////////////////////////////////////////////////////////
      this.wss
        .onEvent('blankEmit')
        .subscribe(data => this.blankEmit(data));

      /*
      this.wss
        .onEvent('resetClientEmit')
        .subscribe(data => this.resetClient(data));
      */

      this.wss
        .onEvent('checkDoneEmit')
        .subscribe(data => this.checkDone(data));

      this.wss
        .onEvent('actionSeatEmit')
        .subscribe(data => this.actionSeat(data));

      this.wss
        .onEvent('playerActionEmit')
        .subscribe(data => this.playerAction(data));

      this.wss
        .onEvent('initEmit')
        .subscribe(data => this.init(data));

      this.wss
        .onEvent('joinTableEmit')
        .subscribe(data => this.joinTable(data));

      this.wss
        .onEvent('leftTableEmit')
        .subscribe(data => this.leftTable(data));

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
        .onEvent('openBetDashEmit')
        .subscribe(data => this.openBetDashEmit(data));

      this.wss
        .onEvent('openPlayerDashEmit')
        .subscribe(data => this.openPlayerDash(data));

      this.wss
        .onEvent('standUpTableEmit')
        .subscribe(data => this.standUpTableEmit(data));

      this.wss
        .onEvent('dealerHandEmit')
        .subscribe(data => this.dealerHandEmit(data));

      ////////////////// Environment Updates //////////////////////
      /////////////////////////////////////////////////////////////
      //
    }
  }

  ngOnInit() {

    //$('body').addClass('df');

    this.count = 0;

    this.connect().then(r => {
      this.logStuff('RECONNECTION TYPE: Initial Connection Occured.');
    });

  }

  /*
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
  */

  logStuff(stuff: any) {
    if (!environment.production) {
      console.log(stuff);
    }
  }

}
