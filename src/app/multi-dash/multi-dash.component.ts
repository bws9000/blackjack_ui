import {Component, OnInit} from '@angular/core';
import {MultiDashService} from "../services/multi-dash.service";
import {Observable, Subscription} from "rxjs";
import {environment} from "../../environments/environment";
import {Card2} from "../Card2";
import {WebsocketService} from "../services/websocket.service";
import {TableService} from "../services/table.service";
import {SeatService} from "../services/seat.service";
import {HandService} from "../services/hand.service";

@Component({
  selector: 'app-multi-dash',
  templateUrl: './multi-dash.component.html',
  styleUrls: ['./multi-dash.component.css']
})

export class MultiDashComponent implements OnInit {

  multiDashVisible: string;

  private openTime;

  private multiTimer;
  private multiSubTimer: Subscription;

  public playerStatus;
  public dealerStatus;

  public dCardsArray;
  public pCardsArray;

  private readonly socketid;
  private readonly table;

  constructor(private mdService: MultiDashService,
              private wss: WebsocketService,
              private tableService: TableService,
              private seatService: SeatService,
              private handService: HandService) {

    this.socketid = this.wss.socketId;
    this.table = 'table' + this.tableService.tableNum;

    this.setOpenTime();
    //this.logStuff('>>>: ' + this.openTime);
    this.multiDashVisible = 'hidden';
    this.mdService.visible.subscribe(value => {

      let j = JSON.stringify(value);
      let o = JSON.parse(j);
      let visible = o.visible;//true
      let dealerResult = o.dealerResult;
      let dHandArray = o.dHandArray;
      let playerResults = o.playerResults;

      let playerResult = undefined;
      let pHandArray = this.handService.lastPlayerHand;

      let that = this;
      playerResults.forEach(function(pr){
        //console.log('seat: ' + pr.seat);
        //console.log('hr: ' + pr.hr);
        if(pr.seat === that.seatService.currentSeat ){
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

      if (visible) {
        //this.logStuff('sitting: ' + this.seatService.sitting);
        this.multiDashVisible = 'visible';
        //this.multiTimer = Observable.timer(1000, 1000);
        //this.multiSubTimer = this.multiTimer.subscribe(t => this.closeCount(t));
      }

    });
  }

  setOpenTime() {
    this.openTime = 5;
    if (!environment.production) {
      this.openTime = 2;
    }
  }

  setHandStatus(cardIndexArray) {

    let result = 0;
    let cardArray = [];
    let aceCount = 0;

    //if you're here it's always less than 21

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
      //this.restartHands();
      //start game over

      let tableNum = this.tableService.tableNum;
      let seatNum = this.seatService.currentSeat;

      /*
      this.wss.emit('checkDone',
        {
          table: tableNum,
          seat: seatNum,
          deactivated: false
        });
      */

    }
  }

  closeWindow() {
    this.setOpenTime();
    this.multiSubTimer.unsubscribe();
    this.multiDashVisible = 'hidden';
    //this.restartHands();
  }

  restartHands() {
    this.wss.emit('restartHands',
      {
        table: this.tableService.tableNum,
        seat: this.seatService.currentSeat
      });
  }

  ngOnDestroy(): void {
    if (this.multiSubTimer !== undefined) {
      this.multiSubTimer.unsubscribe();
    }
  }

  logStuff(stuff: any) {
    if (!environment.production) {
      console.log(stuff);
    }
  }

  ngOnInit() {

  }

}
