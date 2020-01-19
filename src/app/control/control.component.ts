import {Component, OnDestroy, OnInit} from '@angular/core';
import {StatusUpdateService} from "../services/status-update.service";
import {WebsocketService} from "../services/websocket.service";
import {environment} from "../../environments/environment";
import {TableService} from "../services/table.service";
import {PlaceBetsService} from "../services/place-bets.service";
import {SeatService} from "../services/seat.service";

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})

export class ControlComponent implements OnInit, OnDestroy {

  statusBoxVisible: string;
  status: string;
  startcount: number;

  constructor(private statusUpdateService: StatusUpdateService,
              private wss: WebsocketService,
              private tableService: TableService,
              private placeBetsService: PlaceBetsService,
              private seatService: SeatService) {

    this.setStartCount();

    this.statusUpdateService.updateStatusSubject.subscribe(value => {
      if (value) {
        this.statusBoxVisible = 'hidden';
      } else {
        this.statusBoxVisible = 'visible';
        ///////////////////////////////////
        if (this.seatService.currentSeats < 2) {
          this.startBox(this.startcount);
        }
        ///////////////////////////////////
      }
    });
    this.statusUpdateService.hideStatus();
    this.status = 'Waiting for players to join:';
  }

  setStartCount() {
    this.startcount = 10;
    if (!environment.production) {
      this.startcount = 5;
    }
  }

  startBox(count) {
    let that = this;
    let table = this.tableService.tableNum;
    that.status = 'Waiting for players to join:';
    let intv = setInterval(function () {
      if (count < 1) {
        clearInterval(intv);
        count = that.startcount;
        that.statusBoxVisible = 'hidden';
        that.tableService.tablePlaying = true; // <== * * * * * * * *
        const gameStarted = that.tableService.tablePlaying;
        const initSeat = that.seatService.currentSeat;
        that.wss.emit('tableBetting',
          {table: table, tablePlaying: gameStarted, seat: initSeat});
      }
      that.status = 'game starting in: ' + count + ' seconds';
      count--;
    }, 1000);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    //console.log('destroyed');
  }

  logStuff(stuff: any) {
    if (!environment.production) {
      console.log(stuff);
    }
  }

}
