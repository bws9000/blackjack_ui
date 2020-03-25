import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PlayerDashService} from "../services/player-dash.service";
import {SeatService} from "../services/seat.service";
import {environment} from "../../environments/environment";
import {HandService} from "../services/hand.service";
import {Observable, Subscription} from "rxjs";
import {ActivatedRoute, Params} from "@angular/router";
import {TableService} from "../services/table.service";
import {WebsocketService} from "../services/websocket.service";
import {DashStatusServiceService} from "../services/dash-status-service.service";

@Component({
  selector: 'app-player-dash',
  templateUrl: './player-dash.component.html',
  styleUrls: ['./player-dash.component.css'],
})

export class PlayerDashComponent implements OnInit, OnDestroy {

  @Input() dash: string;

  private dashId;

  cards: [number];
  dcards: [number, number];
  playerDashVisible: string;
  seat: string;
  tableName: string;
  statusBoxVisible: string;
  playerStatus: string;
  actionTimerCount: number;

  private broadcast;

  private timer;
  private subTimer: Subscription;

  private timer2;
  private subTimer2: Subscription;
  timer2time: number;

  userSubscription: Subscription;

  constructor(private playerDashService: PlayerDashService,
              private seatService: SeatService,
              private handService: HandService,
              private route: ActivatedRoute,
              private tableService: TableService,
              private dss: DashStatusServiceService,
              private wss: WebsocketService) {


    this.setTimer2Timer();

    this.playerStatus = 'playing';
    this.statusBoxVisible = 'hidden';
    this.playerDashVisible = 'hidden';

    this.userSubscription = this.route.params.subscribe(
      (params: Params) => {

        this.actionTimerCount = 2;
        this.tableName = params.tableId;

        this.dss.startTimerCount.subscribe(value => {
          if (this.dashId === value) {
            //this.logStuff('OBSERVABLE');
            //this.logStuff('this.dash: ' + this.dash);
            //this.logStuff('value: ' + value);
            this.timer2 = Observable.timer(1000, 1000);
            this.subTimer2 = this.timer2.subscribe(t => this.statusCount(t));
          }
        });

        this.dss.statusMessage.subscribe(value => {

          let j = JSON.stringify(value);
          let o = JSON.parse(j);
          let result = o.result;
          let seat = o.seat;
          let tname = o.tableName;
          let nextPlayer = o.nextPlayer;
          let broadcast = o.broadcast;
          this.broadcast = broadcast;


          if (tname === this.tableName &&
            nextPlayer === this.dash) {

            this.playerStatus = result;

            if (result !== 'playing' && !broadcast) {
              //display message from action then hide dashboard
              this.timer = Observable.timer(1000, 1000);
              this.subTimer = this.timer.subscribe(t => this.statusOver(t));
            }

            //this.statusBox();
          }

        });

        this.handService.dealerHand.subscribe(value => {
          if (value !== null) {
            this.dcards = [98, value[0].hand[1]];
          }
        });

        this.handService.playerHands.subscribe(value => {
          let that = this;
          for (let i = 0; i < value.length; i++) {
            if (value[i].seat === this.dash) {
              that.cards = value[i].hand;
            }
          }
        });

        this.playerDashService.visible.subscribe(value => {

          let j = JSON.stringify(value);
          let o = JSON.parse(j);
          let v = o.value;
          let s = o.seat;

          let currentTable = 'table' + this.tableService.tableNum;
          if (currentTable === params.tableId) {
            if (v) {

              //this.logStuff('============================');
              //this.logStuff('this.seatService.currentSeat:' + this.seatService.currentSeat);
              //this.logStuff('this.dash: ' + this.dash);
              //this.logStuff('s: ' + s);
              //this.logStuff('============================');

              if (+this.dash == this.seatService.currentSeat &&
                s === this.seatService.currentSeat) {
                this.show();
              }
            } else {
              this.hide();
            }
          }

          //this.logStuff('j:' + j);

        });

      });

  }

  stand() {
    //this.logStuff('playerStatus: ' + this.playerStatus);
    //this.logStuff('handResult2: ' + this.handService.handResult);
    //this.logStuff('handPlayed: ' + this.handService.handPlayed);

    if (this.handService.handPlayed) {
      this.handService.handPlayed = false;

      this.wss.emit('nextPlayerDash', {
        action: 'stand',
        currentSeat: this.seatService.currentSeat,
        table: this.tableService.tableNum,
        socketId: this.wss.socketId
      });
      this.playerDashVisible = 'hidden';

      if (this.subTimer !== undefined) {
        this.subTimer.unsubscribe();
      }

      if (this.subTimer2 !== undefined) {
        this.subTimer2.unsubscribe();
      }

      this.setTimer2Timer();

    }
  }

  standClick() {

    this.handService.handPlayed = false;

    if (this.subTimer !== undefined) {
      this.subTimer.unsubscribe();
    }

    if (this.subTimer2 !== undefined) {
      this.subTimer2.unsubscribe();
    }

    this.setTimer2Timer();

    this.wss.emit('nextPlayerDash', {
      action: 'stand',
      currentSeat: this.seatService.currentSeat,
      table: this.tableService.tableNum,
      socketId: this.wss.socketId
    });
    this.playerDashVisible = 'hidden';

  }

  standTimeRanOut() {

    this.handService.handPlayed = false;

    this.wss.emit('nextPlayerDash', {
      action: 'stand',
      currentSeat: this.seatService.currentSeat,
      table: this.tableService.tableNum,
      socketId: this.wss.socketId
    });
    this.playerDashVisible = 'hidden';

    this.setTimer2Timer();

  }

  statusCount(t) {
    this.timer2time--;
    if (this.timer2time < 0) {
      console.log('statusCount');
      //this.playerStatus = 'playing';
      this.setTimer2Timer();
      if (this.subTimer !== undefined) {
        this.subTimer.unsubscribe();
      }
      this.subTimer2.unsubscribe();
      this.standTimeRanOut();
    }
  }


  statusOver(t) {
    this.actionTimerCount--;
    if (this.actionTimerCount == -1) {
      console.log('statusOver');
      //this.playerStatus = 'playing';
      this.setPlayerStatus();
      this.actionTimerCount = 2;
      if (this.subTimer2 !== undefined) {
        this.subTimer2.unsubscribe();
      }
      this.subTimer.unsubscribe();
      this.setTimer2Timer();
      this.stand();
    }
  }

  setPlayerStatus() {
    let result = '';

    if (this.playerStatus === 'blackjack') {
      result = 'Blackjack!';
    }

    if (this.playerStatus === '21') {
      result = '21';
    }

    if (this.playerStatus === 'busted') {
      result = 'Bust!';
    }


    return result;
  }

  statusBox() {
    let result = '';
    if (this.playerDashVisible === 'visible' &&
      this.playerStatus !== 'playing' && this.playerStatus !== 'next') {
      this.handService.handPlayed = true;
      result = 'visible';
    } else {
      result = 'hidden';
    }
    return result;
  }

  setTimer2Timer() {
    this.timer2time = 30;
    if (!environment.production) {
      this.timer2time = 10;
    }
  }

  hit() {
    this.wss.emit('playerAction', {
      action: 'hit',
      currentSeat: this.seatService.currentSeat,
      table: this.tableService.tableNum,
      socketId: this.wss.socketId
    });
  }

  other() {
    this.wss.emit('playerAction', {
      action: 'dd/split',
      currentSeat: this.seatService.currentSeat,
      table: this.tableService.tableNum,
      socketId: this.wss.socketId
    });
  }

  hide() {
    this.playerDashVisible = 'hidden';
  }

  show() {
    this.wss.emit('actionOrder', {
      seat: this.seatService.currentSeat,
      table: this.tableService.tableNum
    });
    this.playerDashVisible = 'visible';
    this.dss.startTimer(this.dash);
  }

  ngOnInit() {
    //this.logStuff('dash: ' + this.dash);
    this.dashId = this.dash;
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  logStuff(stuff: any) {
    if (!environment.production) {
      console.log(stuff);
    }
  }

}
