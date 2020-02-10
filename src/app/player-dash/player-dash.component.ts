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

  @Input() player: string;
  @Input() dash: string;
  cards: [number];
  dcards: [number, number];
  playerDashVisible: string;
  seat: string;
  tableName: string;
  statusBoxVisible: string;
  playerStatus: string;
  actionTimerCount:number;

  private timer;
  private subTimer: Subscription;

  userSubscription: Subscription;

  constructor(private playerDashService: PlayerDashService,
              private seatService: SeatService,
              private handService: HandService,
              private route: ActivatedRoute,
              private tableService: TableService,
              private dss: DashStatusServiceService,
              private wss: WebsocketService) {


    this.playerStatus = 'playing';
    this.statusBoxVisible = 'hidden';
    this.playerDashVisible = 'hidden';


    this.userSubscription = this.route.params.subscribe(
      (params: Params) => {

        this.actionTimerCount  = 2;
        this.tableName = params.tableId;

        this.dss.statusMessage.subscribe(value => {

          let j = JSON.stringify(value);
          let o = JSON.parse(j);
          let result = o.result;
          let seat = o.seat;
          let tname = o.tableName;

          if (tname === this.tableName &&
            seat === this.dash) {
            this.playerStatus = result;
            if(result === 'blackjack' ||
            result === 'busted'){
              this.timer = Observable.timer(1000,1000);
              this.subTimer = this.timer.subscribe(t =>this.statusOver(t));
            }
            this.statusBox();
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

  statusOver(t){
    this.actionTimerCount--;
    if(this.actionTimerCount == -1){
      this.playerStatus = 'playing';
      this.setPlayerStatus();
      this.stand();
      this.actionTimerCount = 2;
      this.subTimer.unsubscribe();
    }
  }

  setPlayerStatus() {
    let result = '';
    if (this.playerStatus === 'busted') {
      result = 'Bust!';
    }
    if (this.playerStatus === 'blackjack') {
      result = 'Blackjack!';
    }
    return result;
  }

  statusBox() {
    let result = '';
    if (this.playerDashVisible === 'visible' &&
      this.playerStatus !== 'playing') {
      result = 'visible';
    } else {
      result = 'hidden';
    }
    return result;
  }

  getSeat() {
    return this.dash;
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

  stand() {
    this.wss.emit('nextPlayerDash', {
      action: 'stand',
      currentSeat: this.seatService.currentSeat,
      table: this.tableService.tableNum,
      socketId: this.wss.socketId
    });
    this.playerDashVisible = 'hidden';
  }

  hide() {
    this.playerDashVisible = 'hidden';
  }

  show() {
    this.playerDashVisible = 'visible';
  }

  ngOnInit() {
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
