import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PlayerDashService} from "../services/player-dash.service";
import {SeatService} from "../services/seat.service";
import {environment} from "../../environments/environment";
import {HandService} from "../services/hand.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Params} from "@angular/router";
import {TableService} from "../services/table.service";
import {WebsocketService} from "../services/websocket.service";

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

  userSubscription: Subscription;

  constructor(private playerDashService: PlayerDashService,
              private seatService: SeatService,
              private handService: HandService,
              private route: ActivatedRoute,
              private tableService: TableService,
              private wss: WebsocketService) {


    this.playerDashVisible = 'hidden';


    this.userSubscription = this.route.params.subscribe(
      (params: Params) => {

        this.tableName = params.tableId;

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

  getSeat() {
    return this.dash;
  }

  hit(){
    alert('hit');
  }

  other(){
    alert('dd / split');
  }

  stand(){
    this.wss.emit('nextPlayerDash', {
      currentSeat:this.seatService.currentSeat,
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

  ngOnDestroy():void{
    this.userSubscription.unsubscribe();
  }

  logStuff(stuff: any) {
    if (!environment.production) {
      console.log(stuff);
    }
  }

}
