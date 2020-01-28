import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {StatusUpdateService} from "../services/status-update.service";
import {WebsocketService} from "../services/websocket.service";
import {environment} from "../../environments/environment";
import {TableService} from "../services/table.service";
import {PlaceBetsService} from "../services/place-bets.service";
import {SeatService} from "../services/seat.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";

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
  intv: number;
  active:boolean;
  tableName: string;

  userSubscription: Subscription;

  constructor(private statusUpdateService: StatusUpdateService,
              private wss: WebsocketService,
              private tableService: TableService,
              private placeBetsService: PlaceBetsService,
              private seatService: SeatService,
              private route:ActivatedRoute) {

    this.setStartCount();
    clearInterval(this.intv);

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
                this.active = true;
                this.statusBoxVisible = 'visible';
                ///////////////////////////////////
                if (this.seatService.currentSeats < 2) {
                  this.startBox();
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

  startBox() {

    let that = this;
    let table = this.tableService.tableNum;
    that.status = 'Waiting for players to join:';

    clearInterval(this.intv);

    this.intv = setInterval(function () {
      if (that.startcount < 1) {

        clearInterval(this);
        clearInterval(that.intv);
        that.setStartCount();

        that.logStuff('************************');
        that.logStuff('active: ' + that.active);
        that.logStuff('currentTable: ' + that.tableService.tableNum);
        that.logStuff('currentSeat: ' + that.seatService.currentSeat);
        that.logStuff('controlNum: ' + that.controlNum);
        that.logStuff('count: ' + that.startcount);
        that.logStuff('************************');

        that.statusBoxVisible = 'hidden';
        that.tableService.tablePlaying = true;
        const gameStarted = that.tableService.tablePlaying;
        const initSeat = that.seatService.currentSeat;

        that.wss.emit('tableBetting',
          {
            table: table,
            tablePlaying: gameStarted,
            seat: initSeat,
            socketId: that.wss.socketId
          });
      }
      that.status = 'game starting in: ' + that.startcount + ' seconds';
      that.startcount--;
    }, 1000);
  }

  ngOnInit() {
    clearInterval(this.intv);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    clearInterval(this.intv);
    this.active = false;
  }

  logStuff(stuff: any) {
    if (!environment.production) {
      console.log(stuff);
    }
  }

}
