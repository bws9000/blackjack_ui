import {Component, Input, OnInit} from '@angular/core';
import {WebsocketService} from "../services/websocket.service";
import {environment} from "../../environments/environment";
import {HandService} from "../services/hand.service";
import {StatusUpdateService} from "../services/status-update.service";

@Component({
  selector: 'app-player-hand',
  templateUrl: './player-hand.component.html',
  styleUrls: ['./player-hand.component.css']
})
export class PlayerHandComponent implements OnInit {

  @Input() hand: string;
  //cards: [number,number];
  cards: [number];
  interval;

  constructor(private wss: WebsocketService,
              private handService: HandService,
              private statusUpdateService: StatusUpdateService) {

    this.handService.standUp.subscribe(value => {
      if (this.cards !== undefined) {
        if (+this.hand == value) {
          for (let i = 0; i < this.cards.length; i++) {
            this.cards[i] = 99;
          }
        }
        if (this.statusUpdateService.currentSeatedPlayers == 1) {
          this.handService.dealerHandVisible(false);
        }
      }
    });

    this.handService.playerHands.subscribe(value => {
      let that = this;
      for (let i = 0; i < value.length; i++) {
        if (value[i].seat === this.hand) {
          that.cards = value[i].hand;
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
