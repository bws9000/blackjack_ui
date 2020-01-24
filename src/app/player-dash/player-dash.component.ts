import {Component, Input, OnInit} from '@angular/core';
import {PlayerDashService} from "../services/player-dash.service";
import {SeatService} from "../services/seat.service";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-player-dash',
  templateUrl: './player-dash.component.html',
  styleUrls: ['./player-dash.component.css']
})
export class PlayerDashComponent implements OnInit {

  @Input() player: string;
  @Input() dash: string;
  playerDashVisible: string;
  seat: string;

  constructor(private playerDashService: PlayerDashService,
              private seatService: SeatService) {

    this.playerDashVisible = 'hidden';

    this.playerDashService.visible.subscribe(value => {
      if (value) {
        if(+this.dash == this.seatService.currentSeat) {
          this.show();
        }
      } else {
        this.hide();
      }
    });

  }

  getSeat(){
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
