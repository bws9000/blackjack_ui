import {Component, Input, OnInit} from '@angular/core';
import {WebsocketService} from "../services/websocket.service";
import {environment} from "../../environments/environment";
import {HandService} from "../services/hand.service";
import {SeatService} from "../services/seat.service";

@Component({
  selector: 'app-player-hand',
  templateUrl: './player-hand.component.html',
  styleUrls: ['./player-hand.component.css']
})
export class PlayerHandComponent implements OnInit {
  @Input() hand: string;

  cards: [number, number];

  //seat: number;

  constructor(private wss: WebsocketService,
              private handService: HandService,
              private seatService: SeatService) {

    //this.seat = +this.hand;

    this.handService.playerHands.subscribe(value => {

      this.logStuff(this.hand + ':::::' + this.seatService.currentSeat);

      if (+this.hand == this.seatService.currentSeat) {

        for (let i = 0; i < value.length; i++) {
          this.cards = value[i].hand;
          this.logStuff(value[i].hand);
        }
      }
    });

  }

  ngOnInit() {

  }

  logStuff(stuff: any) {
    if (!environment.production) {
      console.log(stuff);
    }
  }

}
