import {Component, OnInit} from '@angular/core';
import {MultiDashService} from "../services/multi-dash.service";
import {Observable, Subscription} from "rxjs";
import {environment} from "../../environments/environment";
import {Card2} from "../Card2";
import {WebsocketService} from "../services/websocket.service";
import {TableService} from "../services/table.service";
import {SeatService} from "../services/seat.service";

@Component({
  selector: 'app-multi-dash',
  templateUrl: './multi-dash.component.html',
  styleUrls: ['./multi-dash.component.css']
})

export class MultiDashComponent implements OnInit {

  multiDashVisible: string;

  private openTime;
  private timer;
  private subTimer: Subscription;

  public playerStatus;
  public dealerStatus;

  public dCardsArray;
  public pCardsArray;

  private readonly socketid;
  private readonly table;

  constructor(private mdService: MultiDashService,
              private wss: WebsocketService,
              private tableService: TableService,
              private seatService: SeatService) {

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
      let playerResult = o.playerResult;
      let dHandArray = o.dHandArray;
      let pHandArray = o.pHandArray;

      //this.logStuff('dResult: ' + dealerResult);
      //this.logStuff('pResult: ' + playerResult);
      //this.logStuff('dHandArray: ' + dHandArray);
      //this.logStuff('pHandArray: ' + pHandArray);

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
        this.timer = Observable.timer(1000, 1000);
        this.subTimer = this.timer.subscribe(t => this.closeCount(t));
      }

    });
  }

  setOpenTime() {
    this.openTime = 10;
    if (!environment.production) {
      this.openTime = 10;
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
      this.subTimer.unsubscribe();
      this.multiDashVisible = 'hidden';
      this.restartHands();
      //start game over
    }
  }

  closeWindow() {
    this.setOpenTime();
    this.subTimer.unsubscribe();
    this.multiDashVisible = 'hidden';
    this.restartHands();
  }

  restartHands() {
    this.wss.emit('restartHands',
      {
        seat: true
      });
  }

  ngOnDestroy(): void {
    if (this.subTimer !== undefined) {
      this.subTimer.unsubscribe();
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
