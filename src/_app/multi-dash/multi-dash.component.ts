import {Component, OnDestroy, OnInit} from '@angular/core';
import {MultiDashService} from "../services/multi-dash.service";
import {Observable, Subscription} from "rxjs";
import {environment} from "../../environments/environment";
import {Card2} from "../Card2";
import {WebsocketService} from "../services/websocket.service";
import {TableService} from "../services/table.service";
import {SeatService} from "../services/seat.service";
import {HandService} from "../services/hand.service";
import {PlaceBetsService} from "../services/place-bets.service";
import {PlayerboxService} from "../services/playerbox.service";
import {StatusMessageService} from "../services/status-message.service";
import {WinLosePush} from "../WinLosePush";
//import {Router} from "@angular/router";
import {PlayerDashService} from "../services/player-dash.service";
import {HandCount} from "../HandCount";

@Component({
  selector: 'app-multi-dash',
  templateUrl: './multi-dash.component.html',
  styleUrls: ['./multi-dash.component.css']
})

export class MultiDashComponent implements OnInit, OnDestroy {

  multiDashVisible: string;

  private openTime;

  private multiTimer;
  private multiSubTimer: Subscription;

  public playerStatus;
  public dealerStatus;

  public dCardsArray;
  public pCardsArray;
  public split1Hand;
  public split2Hand;

  private readonly socketid;
  private readonly table;

  //new counter
  private resetCounter;
  private resetTimer;
  private resetSubTimer: Subscription;

  dwlp: any;
  pwlp: any;

  split1_pwlp: any;
  split2_pwlp: any;

  splitActive: boolean;

  splitResult1: string;
  splitResult2: string;

  splitHandCount1:number;
  splitHandCount2:number;

  dealerHand: [];


  constructor(private mdService: MultiDashService,
              private wss: WebsocketService,
              private tableService: TableService,
              private seatService: SeatService,
              private handService: HandService,
              private placeBetsService: PlaceBetsService,
              private playerBoxService: PlayerboxService,
              private playerDashService: PlayerDashService,
              private sms: StatusMessageService) {

    this.resetCounter = 5;

    this.socketid = this.wss.socketId;
    this.table = 'table' + this.tableService.tableNum;

    this.setOpenTime();
    this.multiDashVisible = 'hidden';

    this.split1Hand = [];
    this.split2Hand = [];
    this.pCardsArray = [];
    this.dCardsArray = [];

    this.mdService.splitVisible.subscribe(value => {
      this.splitActive = true;

      let j = JSON.stringify(value);
      let o = JSON.parse(j);
      let dealerResult = o.dealerResult;
      let dHandArray = o.dHandArray;
      this.dealerHand = dHandArray[0].hand;

      this.splitResult1 = o.splitResult1;
      this.splitResult2 = o.splitResult2;

      this.split1Hand = this.handService.splitCards1;
      this.split2Hand = this.handService.splitCards2;

      this.dealerStatus = dealerResult;
      this.dCardsArray = dHandArray;

      this.dealerStatus = (this.dealerStatus === 'playing') ?
        this.setHandStatus(this.dCardsArray) : this.dealerStatus;

      this.splitWLP2(this.splitResult1, this.split1Hand).then((result) => {
        this.split1_pwlp = result.getPlayerResult();
        this.placeBetsService.calculateBet(this.split1_pwlp, this.splitResult1);
        this.splitHandCount1 = new HandCount().setHandStatus(this.split1Hand);

        this.splitWLP2(this.splitResult2, this.split2Hand).then((result2) => {
          this.split2_pwlp = result2.getPlayerResult();
          this.dwlp = result.getDealerResult();
          this.placeBetsService.calculateBet(this.split2_pwlp, this.splitResult2);
          this.splitHandCount2 = new HandCount().setHandStatus(this.split2Hand);

          this.multiDashVisible = 'visible';
          this.multiTimer = Observable.timer(1000, 1000);
          this.multiSubTimer = this.multiTimer.subscribe(t => this.closeCount(t));
        });

      });

    });


    this.mdService.visible.subscribe(value => {
      this.splitActive = false;

      let j = JSON.stringify(value);
      let o = JSON.parse(j);
      let visible = o.visible;//true
      let dealerResult = o.dealerResult;
      let dHandArray = o.dHandArray;
      let playerResults = o.playerResults;

      let playerResult = undefined;
      let pHandArray = this.handService.lastPlayerHand;

      let that = this;
      playerResults.forEach(function (pr) {
        //console.log('seat: ' + pr.seat);
        //console.log('hr: ' + pr.hr);
        if (pr.seat === that.seatService.currentSeat) {
          playerResult = pr.hr;
          //alert(pr.seat + ' -playerResult: ' + playerResult);
        }
      });

      this.playerStatus = playerResult;
      this.dealerStatus = dealerResult;
      this.dCardsArray = dHandArray;
      this.pCardsArray = pHandArray;

      this.dealerStatus = (this.dealerStatus === 'playing') ?
        this.setHandStatus(this.dCardsArray) : this.dealerStatus;

      this.playerStatus = (this.playerStatus === 'playing') ?
        this.setHandStatus(this.pCardsArray) : this.playerStatus;


      this.setWLP().then(() => {

        this.placeBetsService.calculateBet(this.pwlp, this.playerStatus);

        if (visible) {
          this.multiDashVisible = 'visible';
          this.multiTimer = Observable.timer(1000, 1000);
          this.multiSubTimer = this.multiTimer.subscribe(t => this.closeCount(t));
        }

      });
    });
  }

  splitWLP2(playerStatus, pArray): Promise<WinLosePush> {
    return new Promise<WinLosePush>(resolve => {
      resolve(new WinLosePush(pArray, this.dealerHand, playerStatus, this.dealerStatus));
    });
  }

  splitWLP(status): Promise<string> {
    return new Promise<string>(resolve => {

      let p;
      let d;

      if (isNaN(status)) {
        p = status;
      } else { //is number
        p = +status;
      }
      if (isNaN(this.dealerStatus)) {
        d = this.dealerStatus;
      } else { //is number
        d = +this.dealerStatus;
      }

      if (!isNaN(p) && !isNaN(d)) { //both numbers
        if (p === d) {
          this.pwlp = 'push';
          this.dwlp = 'push';
        }
        if (p < d) {
          this.pwlp = 'lose';
          this.dwlp = 'win';
        }
        if (p > d) {
          this.pwlp = 'win';
          this.dwlp = 'lose';
        }
      } else if (isNaN(p) && isNaN(d)) { //both strings

        if (p === 'blackjack' && d === 'blackjack') {
          this.pwlp = 'push';
          this.dwlp = 'push';
        }
        if (p === 'busted' && d === 'busted') {
          this.pwlp = 'lose';
          this.dwlp = 'lose';
        }
        if (p === 'blackjack' && d === 'busted') {
          this.pwlp = 'win';
          this.dwlp = 'lose';
        }
        if (p === 'busted' && d === 'blackjack') {
          this.pwlp = 'lose';
          this.dwlp = 'win';
        }

      } else { //the mix

        if (!isNaN(p)) {
          if (p === 21) {
            this.pwlp = 'win';
          } else if (p === 21 && d === 'blackjack') {
            this.pwlp = 'lose';
            this.dwlp = 'win';
          }

          if (d === 'busted') {
            this.pwlp = 'win';
            this.dwlp = 'lose';
          }
          if (d === 'blackjack') {
            this.pwlp = 'lose';
            this.dwlp = 'win';
          }
        }
        if (!isNaN(d)) {
          if (d === 21) {
            this.dwlp = 'win';
          } else if (d === 21 && p === 'blackjack') {
            this.pwlp = 'win';
            this.dwlp = 'lose';
          }

          if (p === 'busted') {
            this.pwlp = 'lose';
            this.dwlp = 'win';
          }
          if (p === 'blackjack') {
            this.pwlp = 'win';
            this.dwlp = 'lose';
          }
        }
      }
      //resolve();
    });

  }

  setWLP(): Promise<void> {
    return new Promise<void>(resolve => {
      let p;
      let d;

      if (isNaN(this.playerStatus)) {
        p = this.playerStatus;
      } else { //is number
        p = +this.playerStatus;
      }
      if (isNaN(this.dealerStatus)) {
        d = this.dealerStatus;
      } else { //is number
        d = +this.dealerStatus;
      }

      if (!isNaN(p) && !isNaN(d)) { //both numbers
        if (p === d) {
          this.pwlp = 'push';
          this.dwlp = 'push';
        }
        if (p < d) {
          this.pwlp = 'lose';
          this.dwlp = 'win';
        }
        if (p > d) {
          this.pwlp = 'win';
          this.dwlp = 'lose';
        }
      } else if (isNaN(p) && isNaN(d)) { //both strings

        if (p === 'blackjack' && d === 'blackjack') {
          this.pwlp = 'push';
          this.dwlp = 'push';
        }
        if (p === 'busted' && d === 'busted') {
          this.pwlp = 'lose';
          this.dwlp = 'lose';
        }
        if (p === 'blackjack' && d === 'busted') {
          this.pwlp = 'win';
          this.dwlp = 'lose';
        }
        if (p === 'busted' && d === 'blackjack') {
          this.pwlp = 'lose';
          this.dwlp = 'win';
        }

      } else { //the mix

        if (!isNaN(p)) {
          if (p === 21) {
            this.pwlp = 'win';
          } else if (p === 21 && d === 'blackjack') {
            this.pwlp = 'lose';
            this.dwlp = 'win';
          }

          if (d === 'busted') {
            this.pwlp = 'win';
            this.dwlp = 'lose';
          }
          if (d === 'blackjack') {
            this.pwlp = 'lose';
            this.dwlp = 'win';
          }
        }
        if (!isNaN(d)) {
          if (d === 21) {
            this.dwlp = 'win';
          } else if (d === 21 && p === 'blackjack') {
            this.pwlp = 'win';
            this.dwlp = 'lose';
          }
          if (p === 'busted') {
            this.pwlp = 'lose';
            this.dwlp = 'win';
          }
          if (p === 'blackjack') {
            this.pwlp = 'win';
            this.dwlp = 'lose';
          }
        }
      }
      resolve();
    });

  }

  setOpenTime() {
    this.openTime = 5;
    if (!environment.production) {
      this.openTime = 5;
    }
  }

  setHandStatus(cardIndexArray) {

    let result = 0;
    let cardArray = [];
    let aceCount = 0;

    for (let i = 0; i < cardIndexArray.length; i++) {
      cardArray[i] = new Card2(cardIndexArray[i], this.socketid, this.table);
    }
    for (let i = 0; i < cardArray.length; i++) {
      let c = cardArray[i];
      result += c.value;
      if (c.name === 'ace') {
        aceCount++;
      }
    }
    //aces
    if (aceCount >= 1) {
      for (let i = 0; i < aceCount; i++) {
        if (result <= 11) {
          result = result + (10 - 1);
        }
      }
    }
    return result;
  }

  closeCount(t) {
    this.openTime--;
    //this.logStuff('count: ' + this.openTime);
    if (this.openTime < 0) {
      this.setOpenTime();
      this.multiSubTimer.unsubscribe();
      this.multiDashVisible = 'hidden';
      this.resetClient();
      //start game over

      /*
      this.wss.emit('checkDone',
        {
          table: this.tableService.tableNum,
          seat: this.seatService.currentSeat,
          deactivated: false
        });
      */

    }
  }

  resetClient() {
    this.clearSeats();

    this.playerBoxService.resetAllSeats();
    ///////////////////////////////////////////////////////
    //specifically added in use case sat down started countdown
    //after next possible opportunity stand and sit down again
    this.placeBetsService.youCanSitNow = false;
    ///////////////////////////////////////////////////////
    this.resetTimer = Observable.timer(1000, 1000);
    this.resetSubTimer = this.resetTimer.subscribe(t => this.resetClientTimer(t));
    this.sms.statusMessage("game updating...");
  }

  private resetClientTimer(t: PopStateEvent) {
    this.resetCounter--;
    if (this.resetCounter === 0) {

      this.wss.emit('readyToBet',
        {
          table: this.tableService.tableNum,
          seat: this.seatService.currentSeat,
          reset: true
        });

      this.resetCounter = 5;
      this.resetSubTimer.unsubscribe();

    }
  }

  clearSeats() {
    this.handService.clearDealerHand();
    this.handService.clearPlayerHands();
  }

  ngOnDestroy() {
    if (this.resetSubTimer !== undefined) {
      this.resetSubTimer.unsubscribe();
    }
    if (this.multiSubTimer !== undefined) {
      this.multiSubTimer.unsubscribe();
    }
  }

  private static logStuff(stuff: any) {
    if (!environment.production) {
      console.log(stuff);
    }
  }

  logStuff(stuff: any) {
    if (!environment.production) {
      console.log(stuff);
    }
  }

  ngOnInit(): void {
  }

}

