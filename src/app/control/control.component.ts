import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {StatusUpdateService} from "../services/status-update.service";
import {WebsocketService} from "../services/websocket.service";
import {environment} from "../../environments/environment";
import {TableService} from "../services/table.service";
import {PlaceBetsService} from "../services/place-bets.service";
import {SeatService} from "../services/seat.service";
import {Observable, Subscription} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import "rxjs-compat/add/observable/timer";

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})

export class ControlComponent implements OnInit, OnDestroy {

  @Input() player: string;
  @Input() controlNum: string;
  statusBoxVisible: string;
  status: string;
  startcount: number;
  active:boolean;
  tableName: string;
  test:string;

  //new counter
  private timer;
  private subTimer: Subscription;

  userSubscription: Subscription;

  constructor(private statusUpdateService: StatusUpdateService,
              private wss: WebsocketService,
              private tableService: TableService,
              private placeBetsService: PlaceBetsService,
              private seatService: SeatService,
              private route:ActivatedRoute) {

    this.statusBoxVisible = 'hidden';

    this.setStartCount();

    this.userSubscription = this.route.params.subscribe(
      (params: Params) => {

        this.tableName = params.tableId;

        this.statusUpdateService.updateStatusSubject.subscribe(value => {
          let currentTable = 'table'+this.tableService.tableNum;
          if(currentTable === params.tableId) {

            if (value) {
              this.statusBoxVisible = 'hidden';
            } else {
              if (+this.controlNum == this.seatService.currentSeat) {
                this.statusBoxVisible = 'visible';
                ///////////////////////////////////
                if (this.seatService.currentSeats < 2) {

                  //timer
                  this.status = 'Waiting for players to join:';
                  this.timer = Observable.timer(1000,1000);
                  this.subTimer = this.timer.subscribe(t =>this.timerTest(t));

                }
                ///////////////////////////////////
              }
            }
          }
        });
        this.statusUpdateService.hideStatus();
        this.status = 'Waiting for players to join:';
      });
  }

  setStartCount() {
    this.startcount = 10;
    if (!environment.production) {
      this.startcount = 5;
    }
  }

  timerTest(t){
    //t

    this.startcount--;
    this.status = 'game starting in: ' + this.startcount + ' seconds';

    if(this.startcount == -1){

      this.setStartCount();
      this.statusBoxVisible = 'hidden';
      this.tableService.tablePlaying = true;
      let table = this.tableService.tableNum;
      const gameStarted = this.tableService.tablePlaying;
      const initSeat = this.seatService.currentSeat;

      this.wss.emit('tableBetting',
        {
          table: table,
          tablePlaying: gameStarted,
          seat: initSeat,
          socketId: this.wss.socketId
        });
      this.subTimer.unsubscribe();
    }
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    if(this.subTimer !== undefined) {
      this.subTimer.unsubscribe();
    }
  }

  logStuff(stuff: any) {
    if (!environment.production) {
      console.log(stuff);
    }
  }

}
