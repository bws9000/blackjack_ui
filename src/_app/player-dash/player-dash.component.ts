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
import {PlaceBetsService} from "../services/place-bets.service";


@Component({
  selector: 'app-player-dash',
  templateUrl: './player-dash.component.html',
  styleUrls: ['./player-dash.component.css'],
})

export class PlayerDashComponent implements OnInit, OnDestroy {

  @Input() dash: string;

  private dashId;

  cards: number[] = new Array<number>();
  splitCards1: number[] = new Array<number>();
  splitCards2: number[] = new Array<number>();
  splitHand: number;

  dcards: [number, number];
  playerDashVisible: string;
  splitActive: boolean;
  splitButtonVisible: string;
  ddButtonVisible: string;
  seat: string;
  tableName: string;
  statusBoxVisible: string;
  playerStatus: string;
  actionTimerCount: number;

  result: string;
  private dashSubTimer: Subscription;

  private dashTimer2;
  private dashSubTimer2: Subscription;

  private splitTime;
  private splitTimer: Subscription;
  split2time: number;

  timer2time: number;

  userSubscription: Subscription;

  constructor(private playerDashService: PlayerDashService,
              private seatService: SeatService,
              private handService: HandService,
              private route: ActivatedRoute,
              private tableService: TableService,
              private dss: DashStatusServiceService,
              private wss: WebsocketService,
              private placeBetsService: PlaceBetsService) {

    this.setTimer2Timer();
    this.setSplit2Time();

    this.playerStatus = 'playing';
    this.statusBoxVisible = 'hidden';
    this.playerDashVisible = 'hidden';
    this.splitButtonVisible = 'hidden';
    this.ddButtonVisible = 'hidden';
    this.splitActive = false;
    this.splitHand = 0;

    this.userSubscription = this.route.params.subscribe(
      (params: Params) => {

        this.actionTimerCount = 2;
        this.tableName = params.tableId;

        this.dss.startTimerCount.subscribe(value => {
          if (this.dashId === value) {
            this.logStuff("dashTimer2 started");
            this.dashTimer2 = Observable.timer(1000, 1000);
            this.dashSubTimer2 = this.dashTimer2.subscribe(t => this.statusCount(t));
          }
        });

        this.handService.playerHandsDeal.subscribe(value => {
          let j = JSON.stringify(value);
          let o = JSON.parse(j);
          if (o.card.s === this.seatService.currentSeat) {
            this.cards.push(o.card.h);
          }
        });

        this.handService.playerHands.subscribe(value => {
          let that = this;
          for (let i = 0; i < value.length; i++) {
            if (value[i].seat === that.seatService.currentSeat) {
              that.cards = value[i].hand;
              that.result = value[i].result;
              that.seat = value[i].seat;
              if (that.result === 'split') {
                if (that.playerDashService.seatInFocus === that.seatService.currentSeat) {
                  that.setSplitButtonVisible('visible');
                }
              }
            }
          }
        });

        //hit result
        this.playerDashService.actionResult.subscribe(value => {
          if (this.playerDashService.seatInFocus === this.seatService.currentSeat) {
            if (this.result !== 'playing') {
              if (this.result !== 'split') {
                this.playerStatus = this.result;
                if (this.dash === this.seat) {
                  this.setStatusBoxVisible();
                }
              }
            }
          }
        });

        this.handService.dealerHand.subscribe(value => {
          if (value !== null) {
            this.dcards = [98, value[0].hand[1]];
          }
        });

        this.playerDashService.hide.subscribe(value => {
          let currentTable = 'table' + this.tableService.tableNum;
          if (currentTable === params.tableId) {
            this.hide();
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
              if (+this.dash == this.seatService.currentSeat &&
                s === this.seatService.currentSeat) {
                this.show();
              }
            } else {
              this.hide();
            }
          }
        });
      });


    this.playerDashService.splitActiveSubject.subscribe(value => {

      this.splitCards1 = [];
      this.splitCards2 = [];
      this.splitHand = 0;

      this.splitActive = true;
      this.setSplitButtonVisible('hidden');
      this.setSplitTimer();
      this.splitCards1.push(this.cards[0]);
      this.splitCards2.push(this.cards[1]);
      this.handService.splitCards1 = this.splitCards1;
      this.handService.splitCards2 = this.splitCards2;

    });


    this.playerDashService.splitResult.subscribe(result => {
      this.playerStatus = result;
      if (result !== "playing") {
        if (result !== "split") {
          if (this.dash === this.seat) {
            this.setSplitStatusBoxVisible();
            this.splitTime = Observable.timer(1000, 1000);
            this.splitTimer = this.splitTime.subscribe(t => this.statusSplitCount(t));
          }
        }
      }
    });

    this.playerDashService.hideSplitB.subscribe(value => {
      this.setSplitButtonVisible('hidden');
    });

    this.playerDashService.hideddB.subscribe( value => {
      this.ddButtonVisible = 'hidden';
    });

    this.playerDashService.hideSplit.subscribe(value => {
      this.statusBoxVisible = 'hidden';
      this.ddButtonVisible = 'hidden';
    });

    this.handService.splitHand1.subscribe(value => {
      this.splitCards1 = value;
      this.handService.splitCards1 = this.splitCards1;
    });

    this.handService.splitHand2.subscribe(value => {
      this.splitCards2 = value;
      this.handService.splitCards2 = this.splitCards2;
    });

  }

  setSplit2Time() {
    this.split2time = 3;
    if (!environment.production) {
      this.split2time = 3;
    }
  }

  setSplitStatusBoxVisible() {
    this.statusBoxVisible = 'visible';
  }

  setStatusBoxVisible() {
    this.timer2time = 3;
    this.statusBoxVisible = 'visible';
    //this.playerDashVisible = 'hidden';
    this.handService.handPlayed = false;
  }

  setSplitButtonVisible(status = 'hidden') {
    this.splitButtonVisible = status;
  }

  hideDashService() {
    this.playerDashService.hideDash(this.seatService.currentSeats);
    this.splitActive = false;
  }

  split() {
    this.playerDashService.setSplitActiveSubject();
    let data = {
      action: 'initSplit',
      currentSeat: this.seatService.currentSeat,
      table: this.tableService.tableNum,
      socketId: this.wss.socketId
    }
    this.wss.emit('initSplit', data);
  }

  hide() {
    this.playerDashVisible = 'hidden';
    this.statusBoxVisible = 'hidden';
    this.splitButtonVisible = 'hidden';
    this.handService.handPlayed = false;
    this.setSplitButtonVisible('hidden');
    this.ddButtonVisible = 'hidden';
  }

  splitStandClick() {
    if (this.splitHand === 0) {
      this.splitHand = 1;
    } else {
      this.standClick();
    }
  }

  standClick() {
    this.hideDashService();
    this.handService.lastPlayerHand = this.cards;
    if (this.dashSubTimer !== undefined) {
      this.dashSubTimer.unsubscribe();
    }
    if (this.dashSubTimer2 !== undefined) {
      this.dashSubTimer2.unsubscribe();
    }
    this.setTimer2Timer();
    this.nextPlayerDashEmit();
    this.playerDashVisible = 'hidden';
  }

  standTimeRanOut() {
    this.handService.lastPlayerHand = this.cards;
    this.playerDashService.hideDash(this.seatService.currentSeats);
    this.nextPlayerDashEmit();
    this.setTimer2Timer();
  }

  nextPlayerDashEmit() {
    this.wss.emit('nextPlayerDash', {
      action: 'stand',
      fromm: 'playerDash',
      currentSeat: this.seatService.currentSeat,
      table: this.tableService.tableNum,
      socketId: this.wss.socketId
    });
  }

  cssSplitOne() {
    return (this.splitHand === 0) ? {} : {'background-color': '#002A10'};
  }

  cssSplitTwo() {
    return (this.splitHand === 0) ? {'background-color': '#002A10'} : {};
  }

  statusSplitCount(t) {
    this.split2time--;
    if (this.split2time < 0) {
      this.setSplit2Time();
      this.splitTimer.unsubscribe();
      this.playerDashService.hideSplitStatus();
      if (this.splitHand !== 0) {
        this.standTimeRanOut();
      } else {
        this.splitHand = 1;
      }
    }
  }

  statusCount(t) {
    this.timer2time--;
    if (this.timer2time < 0) {
      this.playerDashService.hideDash(this.seatService.currentSeats);
      this.setTimer2Timer();
      if (this.dashSubTimer !== undefined) {
        this.dashSubTimer.unsubscribe();
      }
      this.dashSubTimer2.unsubscribe();
      this.standTimeRanOut();
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

  setTimer2Timer() {
    this.timer2time = 30;
    if (!environment.production) {
      this.timer2time = 30;
    }
  }

  setSplitTimer() {
    this.timer2time = 60;
    if (!environment.production) {
      this.timer2time = 60;
    }
  }

  hit() {
    this.wss.emit('playerAction', {
      action: 'hit',
      fromm: 'playerDash',
      currentSeat: this.seatService.currentSeat,
      table: this.tableService.tableNum,
      socketId: this.wss.socketId
    });
    this.playerDashService.hideSplitButton();
    this.playerDashService.hideddButton();
  }

  dd() {
    let currentBet = this.placeBetsService.currentBet;
    this.placeBetsService.currentBet = currentBet * 2;
    this.playerDashService.hideddButton();
    this.hit();
  }

  splitHit() {
    this.wss.emit('playerAction', {
      action: 'split',
      hand: this.splitHand,
      currentSeat: this.seatService.currentSeat,
      table: this.tableService.tableNum,
      socketId: this.wss.socketId
    });
  }

  show() {
    //main dash
    this.splitActive = false;
    this.playerDashVisible = 'visible';
    this.ddButtonVisible = 'visible';
    this.dss.startTimer(this.dash);
    //statusBox
    this.playerStatus = this.result;
    if (+this.seat == this.seatService.currentSeat) {
      if (this.result !== 'playing') {
        if (this.result !== 'split') {
          this.setStatusBoxVisible();
        }
      }
    }
  }

  ngOnInit() {
    //this.logStuff('dash: ' + this.dash);
    this.dashId = this.dash;
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.playerDashVisible = 'hidden';
    if (this.dashSubTimer !== undefined) {
      this.dashSubTimer.unsubscribe();
    }
    if (this.dashSubTimer2 !== undefined) {
      this.dashSubTimer2.unsubscribe();
    }

  }

  logStuff(stuff: any) {
    if (!environment.production) {
      console.log(stuff);
    }
  }

}
