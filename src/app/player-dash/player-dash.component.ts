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
  splitButtonVisible: string;
  seat: string;
  tableName: string;
  statusBoxVisible: string;
  playerStatus: string;
  actionTimerCount: number;

  result: string;

  private broadcast;

  private dashTimer;
  private dashSubTimer: Subscription;

  private dashTimer2;
  private dashSubTimer2: Subscription;

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
    this.splitButtonVisible = 'hidden';

    this.userSubscription = this.route.params.subscribe(
      (params: Params) => {

        this.actionTimerCount = 2;
        this.tableName = params.tableId;

        this.dss.startTimerCount.subscribe(value => {
          if (this.dashId === value) {
            this.dashTimer2 = Observable.timer(1000, 1000);
            this.dashSubTimer2 = this.dashTimer2.subscribe(t => this.statusCount(t));
          }
        });

        this.handService.playerHands.subscribe(value => {
          let that = this;
          for (let i = 0; i < value.length; i++) {
            if (value[i].seat === that.seatService.currentSeat) {
              that.cards = value[i].hand;
              that.result = value[i].result;
              if (that.result === 'split') {
                if(that.playerDashService.seatInFocus === that.seatService.currentSeat) {
                  that.setSplitButtonVisible('visible');
                }
              }
            }
          }
        });

        this.dss.statusMessage.subscribe(value => {
          //this.dss.activate(result, tableName, seat, broadcast);
          let v = value;

          let j = JSON.stringify(value);
          let o = JSON.parse(j);
          //let result = o.result;
          let seat = o.currentSeat;
          let tname = o.tableName;
          let broadcast = o.broadcast;
          let socketid = o.socketid;
          this.broadcast = broadcast;

          if (tname === this.tableName &&
            seat === this.dash) {
            // this.logStuff('====================');
            // this.logStuff('tname: ' + tname);
            // this.logStuff('this.tableName: ' + this.tableName);
            // this.logStuff('seat: ' + seat);
            // this.logStuff('this.dash: ' + this.dash);
            // this.logStuff('this.wss.socketId: ' + this.wss.socketId);
            // this.logStuff('socketid: ' + socketid);
            // this.logStuff('====================');
            this.playerStatus = this.result;
            this.handService.handPlayed = this.result !== 'playing';
            if (this.handService.handPlayed && this.result !== 'split' &&
            this.playerDashVisible !== 'hidden') {
              this.timer2time = 3;
              this.statusBoxVisible = 'visible';
              this.playerDashVisible = 'hidden';
              this.handService.handPlayed = false;
            }

          }

        });

        this.handService.dealerHand.subscribe(value => {
          if (value !== null) {
            this.dcards = [98, value[0].hand[1]];
          }
        });

        this.playerDashService.hide.subscribe(value => {
          let seat = value;
          let currentTable = 'table' + this.tableService.tableNum;
          if (currentTable === params.tableId) {
            //if (this.dash === seat) {
            this.hide();
            //}
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

  }

  setSplitButtonVisible(status = 'hidden') {
    this.splitButtonVisible = status;
  }

  split() {
    alert('split');
  }

  hide() {
    this.playerDashVisible = 'hidden';
    this.statusBoxVisible = 'hidden';
    this.splitButtonVisible = 'hidden';
    this.handService.handPlayed = false;
    this.setSplitButtonVisible('hidden');
  }

  stand() {

    //if (this.handService.handPlayed) {
    //this.handService.handPlayed = false;
    this.handService.lastPlayerHand = this.cards;

    this.wss.emit('nextPlayerDash', {
      action: 'stand',
      currentSeat: this.seatService.currentSeat,
      table: this.tableService.tableNum,
      socketId: this.wss.socketId
    });
    this.playerDashVisible = 'hidden';

    if (this.dashSubTimer !== undefined) {
      this.dashSubTimer.unsubscribe();
    }

    if (this.dashSubTimer2 !== undefined) {
      this.dashSubTimer2.unsubscribe();
    }

    this.setTimer2Timer();

    //}
  }

  standClick() {

    this.playerDashService.hideDash(this.seatService.currentSeats);
    this.handService.lastPlayerHand = this.cards;

    if (this.dashSubTimer !== undefined) {
      this.dashSubTimer.unsubscribe();
    }

    if (this.dashSubTimer2 !== undefined) {
      this.dashSubTimer2.unsubscribe();
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

    this.handService.lastPlayerHand = this.cards;
    this.playerDashService.hideDash(this.seatService.currentSeats);
    this.setTimer2Timer();

    this.wss.emit('nextPlayerDash', {
      action: 'stand',
      currentSeat: this.seatService.currentSeat,
      table: this.tableService.tableNum,
      socketId: this.wss.socketId
    });

    this.setTimer2Timer();

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

  hit() {
    this.wss.emit('playerAction', {
      action: 'hit',
      currentSeat: this.seatService.currentSeat,
      table: this.tableService.tableNum,
      socketId: this.wss.socketId
    });
  }

  show() {
    //this.setSplitButtonVisible('visible');
    this.playerDashVisible = 'visible';
    this.dss.startTimer(this.dash);
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
