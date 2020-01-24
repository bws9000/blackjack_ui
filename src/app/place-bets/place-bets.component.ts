import {Component, Input, OnInit} from '@angular/core';
import {PlaceBetsService} from "../services/place-bets.service";
import {environment} from "../../environments/environment";
import {SeatService} from "../services/seat.service";
import {FormControl, FormGroup} from '@angular/forms';
import {WebsocketService} from "../services/websocket.service";
import {TableService} from "../services/table.service";
import {PlayerboxService} from "../services/playerbox.service";


@Component({
  selector: 'app-place-bets',
  templateUrl: './place-bets.component.html',
  styleUrls: ['./place-bets.component.css']
})

export class PlaceBetsComponent implements OnInit {

  @Input() player: string;
  @Input() bets: string;

  betInProgress: boolean;
  placeBetForm: FormGroup;
  placeBetsVisible: string;
  chips: number;
  currentBet: number;
  selectedValue: number;
  timerCount: number;
  countStatus: number;
  intv: number;

  constructor(private placeBetsService: PlaceBetsService,
              private seatService: SeatService,
              private tableService: TableService,
              private wss: WebsocketService,
              private playerboxService: PlayerboxService) {

    this.timerCount = 11;
    this.chips = this.placeBetsService.currentBank;

    this.selectedValue = 5;
    this.placeBetForm = new FormGroup({
      chips: new FormControl()
    });

    this.placeBetsService.visible.subscribe(value => {

      let j = JSON.stringify(value);
      let o = JSON.parse(j);
      let v = o.value;
      let s = o.seat;

      if (v) {

        if(s == this.seatService.currentSeat) {
          this.logStuff('* placebet timer started *');
          this.placeBetsVisible = 'visible';
          this.timer(this.timerCount);
        }
      } else {
        this.placeBetsVisible = 'hidden';
        clearInterval(this.intv);
      }
    });

    this.placeBetsService.placeBetsStatus.subscribe(value => {

      let j = JSON.stringify(value);
      let o = JSON.parse(j);
      let v = o.value;
      let s = o.seat;

      if (this.placeBetsService.currentBet === undefined) {
        if (this.seatService.currentSeat !== undefined) {
          if (v) {
            this.placeBetsVisible = 'hidden';
            this.betInProgress = false;
          } else {
            this.placeBetsVisible = 'visible';
            this.betInProgress = true;
          }
        }
      }
    });

    this.placeBetsService.playerBanks.subscribe(value => {
      let currentSeat = this.seatService.currentSeat;
      for (let i = 0; i < value.length; i++) {
        if (value[i].seat === currentSeat) {
          this.chips = value[i].chips;
        }
      }
    });
  }

  onSubmit() {
    clearInterval(this.intv);
    this.currentBet = this.placeBetForm.get('chips').value;
    this.placeBetsService.currentBet = this.currentBet;
    this.placeBetsService.setVisible(false,this.seatService.currentSeat);
    let table = this.tableService.tableNum;
    this.playerboxService.reset(this.seatService.currentSeat);
    this.wss.emit('nextPlayerBet', {
      table: table,
      socketId: this.wss.socketId,
      betfinished: this.seatService.currentSeat
    });
  }

  timer(count) {
    let that = this;
    that.countStatus = count;
    this.intv = setInterval(function () {
      if (count < 1) {
        that.clearSeat();
        clearInterval(that.intv);
        count = that.timerCount;
      }
      count--;
      that.countStatus = count;
    }, 1000);
  }

  clearSeat() {
    //////clear seat//////////////////////////////////////////
    this.wss.emit('standUpTable', {
      player: this.seatService.currentSeat,
      tableNum: this.tableService.tableNum
    });
    this.placeBetsService.setVisible(false,this.seatService.currentSeat);
    this.playerboxService.reset(this.seatService.currentSeat);
    this.seatService.resetSeat(this.seatService.currentSeat);
    //////////////////////////////////////////////////////////
  }

  getTime() {
    return this.countStatus;
  }

  getChips() {
    return this.placeBetsService.currentBank;
  }

  logStuff(stuff: any) {
    if (!environment.production) {
      console.log(stuff);
    }
  }

  ngOnInit(): void {

  }

}
