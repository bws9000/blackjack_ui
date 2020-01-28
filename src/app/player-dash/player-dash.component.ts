import {AfterViewInit, Component, ElementRef, HostBinding, Input, OnInit, ViewChild} from '@angular/core';
import {PlayerDashService} from "../services/player-dash.service";
import {SeatService} from "../services/seat.service";
import {environment} from "../../environments/environment";
import {PlayerHandComponent} from "../player-hand/player-hand.component";
import {Style} from "@angular/cli/lib/config/schema";
import {HandService} from "../services/hand.service";
import {PlaceBetsService} from "../services/place-bets.service";

@Component({
  selector: 'app-player-dash',
  templateUrl: './player-dash.component.html',
  styleUrls: ['./player-dash.component.css'],
})

export class PlayerDashComponent implements OnInit {

  @Input() player: string;
  @Input() dash: string;
  cards: [number];
  dcards: [number, number];
  playerDashVisible: string;
  seat: string;

  constructor(private playerDashService: PlayerDashService,
              private seatService: SeatService,
              private handService: HandService) {

    this.playerDashVisible = 'hidden';

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
      if (value) {
        if (+this.dash == this.seatService.currentSeat) {
          this.show();
        }
      } else {
        this.hide();
      }
    });

  }

  getSeat() {
    return this.dash;
  }

  hide() {
    this.playerDashVisible = 'hidden';
  }

  show() {
    this.playerDashVisible = 'visible';
  }

  ngOnInit() {
  }

  logStuff(stuff: any) {
    if (!environment.production) {
      console.log(stuff);
    }
  }

}
