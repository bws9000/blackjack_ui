import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PlaceBetsService} from "../services/place-bets.service";
import {environment} from "../../environments/environment";
import {SeatService} from "../services/seat.service";
import {FormControl, FormGroup} from '@angular/forms';
import {WebsocketService} from "../services/websocket.service";
import {TableService} from "../services/table.service";
import {PlayerboxService} from "../services/playerbox.service";
import {ActivatedRoute, Params} from "@angular/router";
import {Observable, Subscription} from "rxjs";
import {BetService} from "../services/bet.service";


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
  countStatus: number;
  tableName: string;

  private timer;
  private subTimer: Subscription;
  private startcount: number;

  userSubscription: Subscription;

  constructor(private placeBetsService: PlaceBetsService,
              private seatService: SeatService,
              private tableService: TableService,
              private wss: WebsocketService,
              private playerboxService: PlayerboxService,
              private route: ActivatedRoute,
              private betService: BetService) {


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
        this.startcount = 10;

        this.placeBetsService.visible.subscribe(value => {

          let currentTable = 'table' + this.tableService.tableNum;
          if (currentTable === params.tableId) {

            let j = JSON.stringify(value);
            let o = JSON.parse(j);
            let v = o.value;
            let s = o.seat;

            if (v) {
              if (s === this.seatService.currentSeat) {
                if (this.placeBetsVisible === 'hidden') {

                  this.wss.emit('actionOrder', {
                    seat: this.seatService.currentSeat,
                    table: this.tableService.tableNum
                  });

                  this.logStuff('* placebet timer started *');
                  this.placeBetsVisible = 'visible';

                  //timer
                  this.startcount = 10;
                  this.timer = Observable.timer(1000, 1000);
                  this.subTimer = this.timer.subscribe(t => this.timerTest(t));

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
    this.betService.playerBet = true;
    this.placeBetsVisible = 'hidden';
    this.currentBet = this.placeBetForm.get('chips').value;
    this.placeBetsService.currentBet = this.currentBet;
    let table = this.tableService.tableNum;
    this.playerboxService.reset(this.seatService.currentSeat);
    this.wss.emit('nextPlayerBet', {
      timeOut:false,
      fromm:'betDash',
      socketid: this.wss.socketId,
      seat: this.seatService.currentSeat,
      table: table
    });

    /*
    this.wss.emit('openPlayerDash', {
      socketid: this.wss.socketId,
      seat: this.seatService.currentSeat,
      table: table
    });
    */
    this.subTimer.unsubscribe();
  }

  timerTest(t) {
    this.startcount--;
    this.countStatus = this.startcount;
    if (this.startcount == -1) {
      //this.clearSeat();
      //this.onSubmit();
      this.placeBetsVisible = 'hidden';
      this.playerboxService.reset(this.seatService.currentSeat);
      let table = this.tableService.tableNum;
      this.wss.emit('nextPlayerBet', {
        timeOut:true,
        fromm:'betDash',
        socketid: this.wss.socketId,
        seat: this.seatService.currentSeat,
        table: table
      });
      this.seatService.playerStandUp(this.seatService.currentSeat);//important after emit
      this.subTimer.unsubscribe();

    }
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
    if (this.subTimer !== undefined) {
      this.subTimer.unsubscribe();
    }
  }

}
