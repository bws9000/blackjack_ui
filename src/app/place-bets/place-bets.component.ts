import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PlaceBetsService} from "../services/place-bets.service";
import {environment} from "../../environments/environment";
import {SeatService} from "../services/seat.service";
import {FormControl, FormGroup} from '@angular/forms';
import {WebsocketService} from "../services/websocket.service";
import {TableService} from "../services/table.service";
import {PlayerboxService} from "../services/playerbox.service";
import {ActivatedRoute, Params} from "@angular/router";
import {Subscription} from "rxjs";


@Component({
  selector: 'app-place-bets',
  templateUrl: './place-bets.component.html',
  styleUrls: ['./place-bets.component.css']
})

export class PlaceBetsComponent implements OnInit, OnDestroy {

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
  tableName: string;

  userSubscription: Subscription;

  constructor(private placeBetsService: PlaceBetsService,
              private seatService: SeatService,
              private tableService: TableService,
              private wss: WebsocketService,
              private playerboxService: PlayerboxService,
              private route: ActivatedRoute) {

    this.timerCount = 11;
    this.placeBetsVisible = 'hidden';

    this.chips = this.placeBetsService.currentBank;
    this.seatService.currentSeat = undefined;

    this.selectedValue = 5;
    this.placeBetForm = new FormGroup({
      chips: new FormControl()
    });


    this.userSubscription = this.route.params.subscribe(
      (params: Params) => {

        this.tableName = params.tableId;

        this.placeBetsService.visible.subscribe(value => {

          let currentTable = 'table' + this.tableService.tableNum;
          if (currentTable === params.tableId) {


            let j = JSON.stringify(value);
            let o = JSON.parse(j);
            let t = o.table;
            let v = o.value;
            let s = o.seat;

            /*
            alert('-v: ' + v +
              ' -seat: ' + s +
              ' -current seat: ' + this.seatService.currentSeat +
              ' -current-table: ' + this.tableService.tableNum +
              ' -tableName: ' + t);
            */

            if (v) {
              if (s == this.seatService.currentSeat) {
                if (this.placeBetsVisible === 'hidden') {
                  clearInterval(this.placeBetsService.intv);
                  this.logStuff('* placebet timer started *');
                  this.placeBetsVisible = 'visible';
                  this.timer(this.timerCount);
                }
              }
            } else {
              this.placeBetsVisible = 'hidden';
            }
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


      });


  }

  onSubmit() {
    this.placeBetsVisible = 'hidden';
    this.currentBet = this.placeBetForm.get('chips').value;
    this.placeBetsService.currentBet = this.currentBet;
    let table = this.tableService.tableNum;
    this.playerboxService.reset(this.seatService.currentSeat);
    this.wss.emit('nextPlayerBet', {
      table: table,
      socketId: this.wss.socketId,
      betfinished: this.seatService.currentSeat
    });
    clearInterval(this.placeBetsService.intv);
  }

  timer(count) {

    let that = this;
    that.countStatus = count;
    this.placeBetsService.intv = setInterval(function () {
      if (count < 1) {
        clearInterval(that.placeBetsService.intv);
        that.clearSeat();
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
    this.placeBetsVisible = 'hidden';
    //this.placeBetsService.setVisible(false, this.seatService.currentSeat);
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

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    clearInterval(this.placeBetsService.intv);
  }

}
